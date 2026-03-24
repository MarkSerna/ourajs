# Primeros Pasos

Oura.js es una librería de notificaciones premium, ligera y con estética glassmorphism para la web moderna.

## Instalación

Instala el paquete usando tu gestor de paquetes favorito:

```bash
npm install oura-js
```

O vía CDN:

```html
<script src="https://unpkg.com/oura-js/dist/oura.js"></script>
<link rel="stylesheet" href="https://unpkg.com/oura-js/dist/style.css">
```

## Uso Básico

Importa Oura y dispara tu primera notificación:

```javascript
import Oura from 'oura-js';

// Un simple toast de éxito
Oura.success('¡Instalación completada!');

// O un modal más complejo
Oura.fire({
  title: '¡Bienvenido!',
  text: 'Gracias por elegir Oura.js',
  icon: 'success'
});
```

<div style="display:flex; gap:10px; margin-top:20px;">
  <OuraDemo label="▶ Probar Éxito" :fn="(Oura) => Oura.success('¡Funciona perfectamente!')" />
  <OuraDemo label="▶ Abrir Modal" variant="outline" :fn="(Oura) => Oura.fire({ title: 'Hola', text: 'Bienvenido a Oura', icon: 'info' })" />
</div>

## Características Principales

- **Glassmorphism**: Estética moderna con desenfoque de fondo y bordes sutiles.
- **Zero Dependencies**: Sin librerías externas, ligero y rápido.
- **Dark Mode**: Soporte nativo para temas claros y oscos.
- **Accesibilidad**: Navegación por teclado y roles ARIA automáticos.
- **Gestos**: Compatible con gestos táctiles (swipe to dismiss).
