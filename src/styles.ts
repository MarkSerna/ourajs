export const injectStyles = (): void => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('oura-styles')) return;

  const style = document.createElement('style');
  style.id = 'oura-styles';
  style.innerHTML = `
        :root {
            --oura-bg: rgba(255, 255, 255, 0.45);
            --oura-toast-bg: rgba(250, 252, 255, 0.7);
            --oura-text: #1a1a1a;
            --oura-text-muted: #4b5563;
            --oura-border: rgba(255, 255, 255, 0.6);
            --oura-accent: #007bff;
            
            --oura-radius: 16px;
            --oura-shadow: 
                -2px -2px 14px rgba(80, 200, 255, 0.15), 
                2px 2px 14px rgba(200, 100, 255, 0.15),
                0 15px 35px rgba(0,0,0,0.08),
                inset 0 1px 1.5px rgba(255,255,255,0.9);
            --oura-overlay: rgba(0, 0, 0, 0.1);
            --oura-font: system-ui, -apple-system, sans-serif;
            
            /* Positioning vars */
            --oura-pos-top: auto;
            --oura-pos-bottom: auto;
            --oura-pos-left: auto;
            --oura-pos-right: auto;
            --oura-pos-x: 0;
            --oura-pos-y: 0;
        }

        .oura-overlay {
            position: fixed;
            inset: 0;
            background: var(--oura-overlay);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 16px;
        }

        .oura-overlay.oura-show {
            opacity: 1;
        }

        .oura-modal {
            background: var(--oura-bg);
            backdrop-filter: blur(28px);
            -webkit-backdrop-filter: blur(28px);
            border-radius: var(--oura-radius);
            box-shadow: var(--oura-shadow);
            padding: 40px 36px;
            max-width: 440px;
            width: 100%;
            color: var(--oura-text);
            font-family: var(--oura-font);
            text-align: center;
            border: 1px solid var(--oura-border);
            transform: scale(0.95) translateY(10px);
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.35s ease;
            box-sizing: border-box;
        }

        .oura-modal.oura-show {
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        /* Exit Animations */
        .oura-modal.oura-closing {
            transform: scale(0.92) translateY(8px);
            opacity: 0;
            transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s ease;
        }
        .oura-overlay.oura-closing {
            opacity: 0;
            transition: opacity 0.25s ease;
        }
        .oura-drawer.oura-closing.oura-drawer-right { transform: translateX(100%); }
        .oura-drawer.oura-closing.oura-drawer-left { transform: translateX(-100%); }
        .oura-drawer.oura-closing.oura-drawer-top { transform: translateY(-100%); }
        .oura-drawer.oura-closing.oura-drawer-bottom { transform: translateY(100%); }
        .oura-drawer.oura-closing {
            opacity: 0;
            transition: transform 0.3s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s ease;
        }

        .oura-icon {
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .oura-image {
            max-width: 100%;
            height: auto;
            margin: 0 auto 20px;
            display: block;
            border-radius: 8px;
        }

        .oura-main-icon-glass {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: radial-gradient(circle at top left, rgba(255,255,255,0.6), rgba(255,255,255,0.05));
            box-shadow: 
                0 6px 20px rgba(0, 150, 255, 0.3),
                inset 0 1px 2px rgba(255,255,255,0.9);
            border: 1px solid rgba(255,255,255,0.4);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: oura-glass-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            transform: scale(0.5);
            opacity: 0;
        }

        .oura-main-icon-glass svg {
            width: 32px;
            height: 32px;
            stroke: var(--oura-accent);
            filter: drop-shadow(0 0 6px rgba(0, 150, 255, 0.5));
        }

        @keyframes oura-glass-pop {
            0% { transform: scale(0.5); opacity: 0; }
            80% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
        }

        .oura-title {
            margin: 0 0 12px;
            font-size: 1.5rem;
            font-weight: 600;
            letter-spacing: -0.02em;
        }

        .oura-text {
            margin: 0 0 24px;
            font-size: 1.05rem;
            color: var(--oura-text-muted);
            line-height: 1.5;
        }

        .oura-input {
            width: 100%;
            padding: 14px 16px;
            margin: 0 0 24px;
            border-radius: 12px;
            border: 1px solid rgba(0,0,0,0.1);
            background: rgba(255,255,255,0.5);
            color: var(--oura-text);
            font-family: inherit;
            font-size: 1rem;
            outline: none;
            transition: all 0.2s;
            box-sizing: border-box;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
            backdrop-filter: blur(8px);
        }
        .oura-input:focus {
            background: rgba(255,255,255,0.8);
            border-color: var(--oura-accent);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25), inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .oura-select {
            appearance: none;
            cursor: pointer;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='Length19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
            padding-right: 40px;
        }

        .oura-radio-group, .oura-checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 24px;
            text-align: left;
            padding: 0 10px;
        }

        .oura-choice-label {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            font-size: 0.95rem;
            color: var(--oura-text);
            padding: 8px 12px;
            border-radius: 10px;
            transition: background 0.2s;
            border: 1px solid transparent;
        }

        .oura-choice-label:hover {
            background: rgba(0, 0, 0, 0.03);
        }

        .oura-choice-input {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: var(--oura-accent);
        }

        .oura-range-container {
            margin-bottom: 24px;
            padding: 0 10px;
        }

        .oura-range-input {
            width: 100%;
            height: 6px;
            background: rgba(0,0,0,0.1);
            border-radius: 5px;
            appearance: none;
            outline: none;
            accent-color: var(--oura-accent);
        }

        .oura-range-value {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 8px;
            display: block;
            color: var(--oura-accent);
        }

        .oura-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
        }

        .oura-btn {
            appearance: none;
            background: rgba(30, 41, 59, 0.85);
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(0, 0, 0, 0.2);
            padding: 10px 28px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
            outline: none;
        }

        .oura-btn:hover {
            background: rgba(15, 23, 42, 0.95);
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .oura-btn:active {
            transform: translateY(1px);
        }

        .oura-btn-cancel {
            background: rgba(200, 204, 212, 0.2);
            color: var(--oura-text);
            box-shadow: none;
            border: 1px solid var(--oura-border);
        }

        .oura-btn-cancel:hover {
            background: rgba(200, 204, 212, 0.3);
            box-shadow: none;
        }

        .oura-footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--oura-border);
            font-size: 0.85rem;
            color: var(--oura-text-muted);
            text-align: center;
        }

        .oura-footer a {
            color: var(--oura-accent);
            text-decoration: none;
        }

        .oura-footer a:hover {
            text-decoration: underline;
        }

        .oura-btn-deny {
            background: rgba(220, 38, 38, 0.85);
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(0, 0, 0, 0.2);
        }

        .oura-btn-deny:hover {
            background: rgba(185, 28, 28, 0.95);
            box-shadow: 0 6px 18px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .oura-btn-loading {
            pointer-events: none;
            position: relative;
            color: transparent !important;
        }

        .oura-btn-loading::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            top: calc(50% - 10px);
            left: calc(50% - 10px);
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: oura-spin 0.8s linear infinite;
        }

        @keyframes oura-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .oura-validation-message {
            color: #ef4444;
            font-size: 0.9rem;
            margin: -8px auto 16px;
            display: none;
            animation: oura-shake 0.4s ease;
        }
        .oura-validation-message.oura-show {
            display: block;
        }

        @keyframes oura-shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-4px); }
            40%, 80% { transform: translateX(4px); }
        }

        /* Toast Container & Positioning */
        .oura-toast-container {
            position: fixed;
            top: var(--oura-pos-top);
            bottom: var(--oura-pos-bottom);
            left: var(--oura-pos-left);
            right: var(--oura-pos-right);
            width: 320px;
            z-index: 100000;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transform: translate(var(--oura-pos-x), var(--oura-pos-y));
        }

        .oura-pos-top-right { --oura-pos-top: 24px; --oura-pos-right: 24px; align-items: flex-end; }
        .oura-pos-top-left { --oura-pos-top: 24px; --oura-pos-left: 24px; align-items: flex-start; }
        .oura-pos-top-center { --oura-pos-top: 24px; --oura-pos-left: 50%; --oura-pos-x: -50%; align-items: center; }
        .oura-pos-bottom-right { --oura-pos-bottom: 24px; --oura-pos-right: 24px; align-items: flex-end; flex-direction: column-reverse; }
        .oura-pos-bottom-left { --oura-pos-bottom: 24px; --oura-pos-left: 24px; align-items: flex-start; flex-direction: column-reverse; }
        .oura-pos-bottom-center { --oura-pos-bottom: 24px; --oura-pos-left: 50%; --oura-pos-x: -50%; align-items: center; flex-direction: column-reverse; }

        .oura-toast {
            pointer-events: auto;
            position: relative;
            width: 100%;
            background: var(--oura-toast-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8);
            padding: 14px 20px;
            color: var(--oura-text);
            font-family: var(--oura-font);
            display: flex;
            flex-direction: column;
            border: 1px solid var(--oura-border);
            
            --y-offset: 0;
            --scale: 1;
            --z-index: 1;
            z-index: var(--z-index);
            transform: translateY(calc(var(--y-offset) * 1px)) scale(var(--scale));
            transform-origin: bottom center;
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.3s ease;
            cursor: pointer;
            overflow: hidden;
            box-sizing: border-box;
            will-change: transform, opacity;
        }
        
        /* Drawer Styles */
        .oura-drawer {
            position: fixed;
            background: var(--oura-bg);
            backdrop-filter: blur(28px);
            -webkit-backdrop-filter: blur(28px);
            border: 1px solid var(--oura-border);
            box-shadow: var(--oura-shadow);
            z-index: 100001;
            display: flex;
            flex-direction: column;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
            opacity: 0;
            pointer-events: auto;
            overflow-y: auto;
            will-change: transform, opacity;
        }

        .oura-drawer-right { top: 0; right: 0; bottom: 0; width: 400px; transform: translateX(100%); border-left: 1px solid var(--oura-border); }
        .oura-drawer-left { top: 0; left: 0; bottom: 0; width: 400px; transform: translateX(-100%); border-right: 1px solid var(--oura-border); }
        .oura-drawer-top { top: 0; left: 0; right: 0; height: 300px; transform: translateY(-100%); border-bottom: 1px solid var(--oura-border); }
        .oura-drawer-bottom { bottom: 0; left: 0; right: 0; height: 300px; transform: translateY(100%); border-top: 1px solid var(--oura-border); }

        .oura-drawer.oura-show {
            transform: translate(0, 0);
            opacity: 1;
        }

        .oura-drawer-content {
            padding: 40px;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .oura-drawer .oura-actions {
            margin-top: auto;
            padding-top: 20px;
            justify-content: flex-end;
        }

        .oura-toast.oura-init {
            transform: translateY(20px) scale(0.9);
        }
        
        .oura-toast.oura-show {
            opacity: 1;
        }

        .oura-toast-body {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .oura-toast-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .oura-toast-icon svg {
            width: 100%;
            height: 100%;
        }

        .oura-toast-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex-grow: 1;
        }

        .oura-toast-title {
            font-weight: 500;
            font-size: 0.95rem;
        }
        
        .oura-toast-text {
            font-size: 0.85rem;
            color: var(--oura-text-muted);
            margin: 0;
        }

        /* Toast Actions */
        .oura-toast-actions {
            display: flex;
            gap: 8px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid var(--oura-border);
        }
        .oura-toast-action {
            background: none;
            border: none;
            cursor: pointer;
            font-family: inherit;
            font-weight: 600;
            font-size: 0.8rem;
            color: var(--oura-accent);
            padding: 4px 10px;
            border-radius: 6px;
            transition: background 0.15s;
        }
        .oura-toast-action:hover {
            background: rgba(59,130,246,0.1);
        }

        .oura-progress-container {
            width: 100%;
            height: 4px;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
            margin-top: 12px;
            overflow: hidden;
        }

        .oura-progress-fill {
            height: 100%;
            background: var(--oura-accent);
            border-radius: 4px;
            width: 0%;
            box-shadow: 0 0 8px var(--oura-accent);
            transition: width linear;
        }

        :root.oura-dark-glass {
            --oura-bg: rgba(30, 35, 45, 0.65);
            --oura-toast-bg: rgba(40, 45, 55, 0.7);
            --oura-text: #ffffff;
            --oura-text-muted: #a0aebf;
            --oura-border: rgba(255, 255, 255, 0.1);
            --oura-shadow: 
                -2px -2px 14px rgba(80, 200, 255, 0.08), 
                2px 2px 14px rgba(200, 100, 255, 0.08), 
                0 20px 40px rgba(0,0,0,0.5), 
                inset 0 1px 1px rgba(255,255,255,0.08);
        }
        .oura-dark-glass .oura-input {
            background: rgba(255,255,255,0.05);
            color: #ffffff;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .oura-dark-glass .oura-input:focus {
            background: rgba(255,255,255,0.1);
        }

        /* Accessibility: Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
            .oura-modal, .oura-toast, .oura-main-icon-glass, .oura-overlay {
                animation: none !important;
                transition: opacity 0.15s ease !important;
                transform: none !important;
            }
        }

        /* ── Tooltip ── */
        .oura-tooltip {
            position: fixed;
            z-index: 100002;
            padding: 8px 14px;
            border-radius: 10px;
            background: var(--oura-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--oura-border);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.5);
            color: var(--oura-text);
            font-family: var(--oura-font);
            font-size: 0.85rem;
            font-weight: 500;
            pointer-events: none;
            opacity: 0;
            transform: scale(0.95);
            transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.25);
            white-space: nowrap;
            max-width: 280px;
        }
        .oura-tooltip.oura-show { opacity: 1; transform: scale(1); }

        /* ── Popover ── */
        .oura-popover {
            position: fixed;
            z-index: 100002;
            min-width: 220px;
            max-width: 360px;
            border-radius: var(--oura-radius);
            background: var(--oura-bg);
            backdrop-filter: blur(28px);
            -webkit-backdrop-filter: blur(28px);
            border: 1px solid var(--oura-border);
            box-shadow: var(--oura-shadow);
            color: var(--oura-text);
            font-family: var(--oura-font);
            opacity: 0;
            transform: scale(0.95) translateY(4px);
            transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.25);
        }
        .oura-popover.oura-show { opacity: 1; transform: scale(1) translateY(0); }
        .oura-popover-header {
            padding: 16px 20px 8px;
            font-weight: 600;
            font-size: 0.95rem;
            border-bottom: 1px solid var(--oura-border);
        }
        .oura-popover-body { padding: 16px 20px; font-size: 0.9rem; line-height: 1.5; }
        .oura-popover-close {
            position: absolute; top: 12px; right: 12px;
            background: none; border: none; cursor: pointer;
            color: var(--oura-text-muted); font-size: 1.2rem;
            width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
            border-radius: 6px; transition: background 0.15s;
        }
        .oura-popover-close:hover { background: rgba(0,0,0,0.05); }

        /* ── Dropdown Menu ── */
        .oura-dropdown {
            position: fixed;
            z-index: 100002;
            min-width: 200px;
            padding: 6px;
            border-radius: 14px;
            background: var(--oura-bg);
            backdrop-filter: blur(28px);
            -webkit-backdrop-filter: blur(28px);
            border: 1px solid var(--oura-border);
            box-shadow: var(--oura-shadow);
            font-family: var(--oura-font);
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
            transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.25);
        }
        .oura-dropdown.oura-show { opacity: 1; transform: scale(1) translateY(0); }
        .oura-dropdown-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.88rem;
            font-weight: 500;
            color: var(--oura-text);
            transition: background 0.15s;
            border: none; background: none; width: 100%; text-align: left; font-family: inherit;
        }
        .oura-dropdown-item:hover { background: rgba(59,130,246,0.08); }
        .oura-dropdown-item:focus { background: rgba(59,130,246,0.12); outline: 2px solid rgba(59,130,246,0.3); outline-offset: -2px; }
        .oura-dropdown-item.oura-danger { color: #ef4444; }
        .oura-dropdown-item.oura-danger:hover { background: rgba(239,68,68,0.08); }
        .oura-dropdown-item.oura-disabled { opacity: 0.4; pointer-events: none; }
        .oura-dropdown-item-icon { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.6; }
        .oura-dropdown-shortcut { margin-left: auto; font-size: 0.75rem; color: var(--oura-text-muted); font-family: inherit; }
        .oura-dropdown-separator { height: 1px; background: var(--oura-border); margin: 4px 8px; }

        /* ── Context Menu ── */
        .oura-context-menu {
            position: fixed;
            z-index: 100003;
            min-width: 180px;
            padding: 6px;
            border-radius: 14px;
            background: var(--oura-bg);
            backdrop-filter: blur(28px);
            -webkit-backdrop-filter: blur(28px);
            border: 1px solid var(--oura-border);
            box-shadow: var(--oura-shadow);
            font-family: var(--oura-font);
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.15s ease, transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.25);
        }
        .oura-context-menu.oura-show { opacity: 1; transform: scale(1); }

        /* ── Inline Alert ── */
        .oura-alert {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            padding: 16px 20px;
            border-radius: 14px;
            background: var(--oura-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--oura-border);
            box-shadow: 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 1px rgba(255,255,255,0.6);
            font-family: var(--oura-font);
            color: var(--oura-text);
            animation: oura-alert-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
            opacity: 0;
        }
        @keyframes oura-alert-in {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .oura-alert-icon { flex-shrink: 0; width: 20px; height: 20px; margin-top: 2px; }
        .oura-alert-icon svg { width: 100%; height: 100%; }
        .oura-alert-content { flex: 1; }
        .oura-alert-title { font-weight: 600; font-size: 0.92rem; margin-bottom: 2px; }
        .oura-alert-desc { font-size: 0.85rem; color: var(--oura-text-muted); line-height: 1.5; }
        .oura-alert-dismiss {
            flex-shrink: 0; background: none; border: none;
            cursor: pointer; color: var(--oura-text-muted);
            width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
            border-radius: 4px; transition: background 0.15s; font-size: 1rem;
        }
        .oura-alert-dismiss:hover { background: rgba(0,0,0,0.05); }
        .oura-alert-success { border-left: 3px solid #22c55e; }
        .oura-alert-warning { border-left: 3px solid #f59e0b; }
        .oura-alert-error { border-left: 3px solid #ef4444; }
        .oura-alert-info { border-left: 3px solid #3b82f6; }

        /* ── Skeleton ── */
        .oura-skeleton {
            background: linear-gradient(90deg,
                rgba(200,200,200,0.15) 25%,
                rgba(200,200,200,0.3) 50%,
                rgba(200,200,200,0.15) 75%);
            background-size: 200% 100%;
            animation: oura-skeleton-pulse 1.8s ease-in-out infinite;
            border-radius: 8px;
        }
        .oura-skeleton-circular { border-radius: 50%; }
        .oura-skeleton-text { border-radius: 4px; height: 16px; }
        @keyframes oura-skeleton-pulse {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* ── Hover Card ── */
        .oura-hover-card {
            position: fixed;
            z-index: 100002;
            min-width: 260px;
            max-width: 380px;
            border-radius: var(--oura-radius);
            background: var(--oura-bg);
            backdrop-filter: blur(28px);
            -webkit-backdrop-filter: blur(28px);
            border: 1px solid var(--oura-border);
            box-shadow: var(--oura-shadow);
            color: var(--oura-text);
            font-family: var(--oura-font);
            padding: 20px;
            font-size: 0.9rem;
            line-height: 1.5;
            opacity: 0;
            transform: scale(0.95) translateY(4px);
            transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.25);
            pointer-events: none;
        }
        .oura-hover-card.oura-show { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
    `;
  document.head.appendChild(style);

  if (!document.getElementById('oura-toast-container')) {
    const container = document.createElement('div');
    container.id = 'oura-toast-container';
    container.className = 'oura-toast-container oura-pos-top-right';
    container.setAttribute('aria-live', 'polite'); // A11y
    document.body.appendChild(container);
  }
};
