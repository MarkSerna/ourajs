import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Oura from '../src/index';
import { injectStyles } from '../src/styles';
import { setPrefersColorSchemeDark } from './setup';

describe('OuraNotification UI Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        const styles = document.getElementById('oura-styles');
        if (styles) styles.remove();
        injectStyles();
        Oura.configure({ locale: 'en' });
    });

    afterEach(() => {
        document.querySelectorAll('.oura-overlay').forEach(el => el.remove());
        document.querySelectorAll('.oura-toast').forEach(el => el.remove());
    });

    it('should inject styles into the document on load', () => {
        expect(document.getElementById('oura-styles')).toBeTruthy();
        expect(document.getElementById('oura-toast-container')).toBeTruthy();
    });

    it('should open a success modal and respond to confirm', async () => {
        const promise = Oura.fire({ title: 'Test', text: 'Success Message', icon: 'success' });
        
        const modal = document.querySelector('.oura-modal');
        expect(modal).toBeTruthy();
        expect(modal?.querySelector('.oura-title')?.textContent).toBe('Test');
        
        const btn = document.querySelector('.oura-btn') as HTMLButtonElement;
        expect(btn).toBeTruthy();
        btn.click();
        
        const result = await promise;
        expect(result.isConfirmed).toBe(true);
    });

    it('should handle locale i18n exactly as specified', async () => {
        Oura.configure({ locale: 'es' });
        Oura.confirm('Are you sure?');
        
        const btns = document.querySelectorAll('.oura-btn');
        expect(btns.length).toBe(2);
        expect(btns[0].textContent).toBe('Cancelar');
        expect(btns[1].textContent).toBe('Confirmar');
    });

    it('should expose update() on toast handle', () => {
        const handle = Oura.toast({ title: 'Old', timer: 60_000 });
        expect(typeof handle.update).toBe('function');
        handle.update({ title: 'New' });
        expect(document.querySelector('.oura-toast-title')?.textContent).toBe('New');
    });

    it('should generate a toast with correct ARIA roles', async () => {
        Oura.success('Data saved');
        
        const container = document.getElementById('oura-toast-container');
        expect(container?.getAttribute('aria-live')).toBe('polite');
        
        const toast = document.querySelector('.oura-toast');
        expect(toast).toBeTruthy();
        expect(toast?.getAttribute('role')).toBe('status');
    });

    it('should handle preConfirm async validation', async () => {
        let validated = false;
        const promise = Oura.fire({
            title: 'Async',
            preConfirm: async (val: string | undefined) => {
                await new Promise(r => setTimeout(r, 10));
                validated = true;
                return val;
            }
        });

        const btn = document.querySelector('.oura-btn') as HTMLButtonElement;
        btn.click();
        
        // Modal should not be removed yet if async is running
        // But our implementation closes after await
        await promise;
        expect(validated).toBe(true);
    });

    it('should handle deny button result', async () => {
        const promise = Oura.confirm({
            title: 'Save?',
            showDenyButton: true,
            denyButtonText: 'No'
        });

        const btns = document.querySelectorAll('.oura-btn');
        expect(btns.length).toBe(3); // Cancel, Deny, Confirm
        
        const denyBtn = btns[1] as HTMLButtonElement;
        expect(denyBtn.classList.contains('oura-btn-deny')).toBe(true);
        denyBtn.click();

        const result = await promise;
        expect(result.isDenied).toBe(true);
        expect(result.isConfirmed).toBe(false);
    });

    it('should handle Oura.promise states', async () => {
        const p = new Promise(resolve => setTimeout(() => resolve('done'), 20));
        const op = Oura.promise(p, {
            loading: 'Loading...',
            success: 'Success!',
            error: 'Error!'
        });

        const toast = document.querySelector('.oura-toast');
        expect(toast?.textContent).toContain('Loading...');
        
        await op;
        expect(toast?.textContent).toContain('Success!');
    });

    it('should pass rejection to Oura.promise error handler and show message', async () => {
        const failing = Promise.reject(new Error('boom'));
        const op = Oura.promise(failing, {
            loading: 'Wait',
            success: 'OK',
            error: (err: unknown) => (err instanceof Error ? err.message : String(err)),
        });

        await expect(op).rejects.toThrow('boom');
        const toast = document.querySelector('.oura-toast');
        expect(toast?.textContent).toContain('boom');
    });

    it('should update toast container position', () => {
        Oura.configure({ position: 'bottom-center' });
        const container = document.getElementById('oura-toast-container');
        expect(container?.classList.contains('oura-pos-bottom-center')).toBe(true);
    });

    it('should render a drawer with correct side', async () => {
        Oura.drawer({ title: 'Settings', side: 'left' });
        const drawer = document.querySelector('.oura-drawer');
        expect(drawer).toBeTruthy();
        expect(drawer?.classList.contains('oura-drawer-left')).toBe(true);
        expect(drawer?.querySelector('.oura-title')?.textContent).toBe('Settings');
    });

    it('should apply themes correctly including dark mode', () => {
        const container = document.getElementById('oura-toast-container');
        expect(container).toBeTruthy();
        Oura.configure({ theme: 'dark-glass' });
        expect(container?.classList.contains('oura-dark-glass')).toBe(true);
        Oura.configure({ theme: 'light-glass' });
        expect(container?.classList.contains('oura-dark-glass')).toBe(false);
    });

    it('should apply system theme from prefers-color-scheme', () => {
        const container = document.getElementById('oura-toast-container');
        expect(container).toBeTruthy();
        setPrefersColorSchemeDark(true);
        Oura.configure({ theme: 'system' });
        expect(container?.classList.contains('oura-dark-glass')).toBe(true);
        setPrefersColorSchemeDark(false);
        Oura.configure({ theme: 'system' });
        expect(container?.classList.contains('oura-dark-glass')).toBe(false);
        Oura.configure({ theme: 'light-glass' });
    });

    it('should use i18n aria-label for alert dismiss and allow dismissLabel override', () => {
        Oura.configure({ locale: 'es' });
        Oura.alert({ description: 'Msg', variant: 'info' });
        let dismiss = document.querySelector('.oura-alert-dismiss') as HTMLButtonElement;
        expect(dismiss.getAttribute('aria-label')).toBe('Cerrar');

        Oura.alert({ description: 'Otro', dismissLabel: 'Quitar aviso' });
        dismiss = document.querySelectorAll('.oura-alert-dismiss')[1] as HTMLButtonElement;
        expect(dismiss.getAttribute('aria-label')).toBe('Quitar aviso');
    });

    it('should restore focus to the previously focused element after closing a modal', async () => {
        const trigger = document.createElement('button');
        trigger.textContent = 'Open';
        document.body.appendChild(trigger);
        trigger.focus();
        expect(document.activeElement).toBe(trigger);

        const promise = Oura.fire({ title: 'Focus test' });
        const btn = document.querySelector('.oura-modal .oura-btn') as HTMLButtonElement;
        expect(document.activeElement).not.toBe(trigger);
        btn.click();

        await promise;
        expect(document.activeElement).toBe(trigger);
    });

    it('should add closing classes during modal exit animation', async () => {
        const promise = Oura.fire({ title: 'Exit' });
        const modal = document.querySelector('.oura-modal');
        const overlay = document.querySelector('.oura-overlay');
        
        const btn = modal?.querySelector('.oura-btn') as HTMLButtonElement;
        btn.click();
        
        expect(modal?.classList.contains('oura-closing')).toBe(true);
        expect(overlay?.classList.contains('oura-closing')).toBe(true);
        
        await promise;
    });

    it('should render and handle toast actions', async () => {
        let actionClicked = false;
        Oura.toast({
            title: 'Action Toast',
            actions: [
                { label: 'Undo', onClick: () => { actionClicked = true; } }
            ]
        });
        
        const actionBtn = document.querySelector('.oura-toast-action') as HTMLButtonElement;
        expect(actionBtn).toBeTruthy();
        expect(actionBtn.textContent).toBe('Undo');
        
        actionBtn.click();
        expect(actionClicked).toBe(true);
    });

    it('should support custom SVG icons in modals and toasts', () => {
        const customSvg = '<svg id="custom-icon"></svg>';
        
        // Modal
        Oura.fire({ icon: customSvg });
        expect(document.querySelector('#custom-icon')).toBeTruthy();
        document.querySelector('.oura-overlay')?.remove();

        // Toast
        Oura.toast({ icon: customSvg });
        expect(document.querySelector('#custom-icon')).toBeTruthy();
    });

    it('should handle keyboard navigation in dropdown menus', async () => {
        const btn = document.createElement('button');
        btn.id = 'trigger';
        document.body.appendChild(btn);

        let clicked = false;
        Oura.dropdown('#trigger', {
            items: [
                { label: 'Item 1', onClick: () => {} },
                { label: 'Item 2', onClick: () => { clicked = true; } }
            ]
        });

        btn.click(); // Open
        await new Promise(r => setTimeout(r, 50));
        const menu = document.querySelector('.oura-dropdown');
        expect(menu?.classList.contains('oura-show')).toBe(true);

        const items = menu?.querySelectorAll('.oura-dropdown-item');
        
        // Mock focus for JSDOM
        (items?.[0] as HTMLElement).focus();
        
        // ArrowDown to Item 2
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(document.activeElement).toBe(items?.[1]);

        // Enter to click Item 2
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(clicked).toBe(true);
        expect(menu?.classList.contains('oura-show')).toBe(false);
    });

    it('should render new components: Tooltip, Popover, Alert, Skeleton', () => {
        const btn = document.createElement('button');
        btn.id = 'cmp-trigger';
        document.body.appendChild(btn);

        // Tooltip (adds listeners)
        Oura.tooltip('#cmp-trigger', { content: 'Tip' });
        
        // Popover
        Oura.popover('#cmp-trigger', { title: 'Pop', html: 'content' });
        btn.click();
        expect(document.querySelector('.oura-popover')).toBeTruthy();

        // Alert
        Oura.alert({ title: 'Alert Title', description: 'Alert description', variant: 'error' });
        const alert = document.querySelector('.oura-alert');
        expect(alert).toBeTruthy();
        expect(alert?.classList.contains('oura-alert-error')).toBe(true);

        // Skeleton
        Oura.skeleton({ variant: 'text', count: 2 });
        expect(document.querySelectorAll('.oura-skeleton').length).toBe(2);
    });
});
