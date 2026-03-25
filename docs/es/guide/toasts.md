# Toasts

Los Toasts son notificaciones no intrusivas y transitorias que se apilan elegantemente en la esquina de la pantalla.

## Uso Básico

Invocación estándar:

```javascript
import Oura from 'oura-js';

Oura.success('Perfil guardado con éxito');
Oura.error('Error al subir el archivo');
Oura.info('Nuevo mensaje recibido');
```

<div style="display:flex; gap:10px;">
  <OuraDemo label="▶ Éxito" :fn="(Oura) => Oura.success('¡Perfil guardado!')" />
  <OuraDemo label="▶ Error" variant="outline" :fn="(Oura) => Oura.error('Fallo al guardar')" />
</div>

## Toast de Progreso

Puedes mostrar una barra de progreso animada que indica el tiempo restante antes de desaparecer. Muy recomendado para estados de carga.

```javascript
Oura.toast({
  title: 'Subiendo 3 archivos...',
  type: 'progress',
  timer: 4500,
  icon: 'progress',
});
```

<OuraDemo label="▶ Probar Progreso" :fn="(Oura) => Oura.toast({
  title: 'Subiendo...',
  type: 'progress',
  timer: 4000,
  icon: 'progress'
})" />

## Acciones en Toasts

Añade botones interactivos directamente en tus toasts.

```javascript
Oura.toast({
  title: 'Mensaje eliminado',
  actions: [{ label: 'Deshacer', onClick: () => Oura.success('¡Restaurado!') }],
});
```

<OuraDemo label="▶ Toast con Acciones" :fn="(Oura) => Oura.toast({
  title: 'Mensaje eliminado',
  actions: [
    { label: 'Deshacer', onClick: () => Oura.success('¡Restaurado!') }
  ]
})" />
