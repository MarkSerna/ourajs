# Modales

Oura ofrece una gran flexibilidad para generar diálogos en el centro de la pantalla, perfectos para advertencias, configuraciones o captura de datos.

## Disparar un Modal Personalizado

Usa el método `Oura.fire()` con un objeto de configuración.

```javascript
import Oura from 'oura-js';

Oura.fire({
  title: 'Error de Red',
  text: 'No se puede sincronizar con la base de datos central.',
  icon: 'error',
  confirmButtonText: 'Reintentar Conexión',
});
```

<OuraDemo label="▶ Probar Modal de Error" :fn="(Oura) => Oura.fire({ title: 'Error', text: 'La conexión ha fallado', icon: 'error' })" />

## Confirmar Acción

El método `.confirm` vincula automáticamente una interfaz de Cancelar y Confirmar.

```javascript
const result = await Oura.confirm('¿Eliminar Espacio?', 'Esta acción no se puede deshacer.');

if (result.isConfirmed) {
  Oura.success('¡Espacio Terminado!');
} else {
  Oura.info('Acción cancelada.');
}
```

<OuraDemo label="▶ Probar Confirmación" :fn="async (Oura) => {
  const result = await Oura.confirm('¿Eliminar Espacio?', 'Esto no se puede deshacer.');
  if (result.isConfirmed) Oura.success('¡Eliminado!');
}" />

## Captura de Datos (Prompt)

¡Captura la entrada del usuario de forma elegante sin necesidad de estructuras de formulario!

```javascript
const result = await Oura.prompt(
  'Introduce tu email',
  'Te enviaremos un enlace de restablecimiento',
  'email'
);

if (result.isConfirmed && result.value) {
  Oura.toast(`Enlace enviado a ${result.value}`);
}
```

<OuraDemo label="▶ Probar Prompt" :fn="async (Oura) => {
  const result = await Oura.prompt('Introduce tu email', 'Te enviaremos un enlace', 'email');
  if (result.isConfirmed && result.value) Oura.toast(`Enlace enviado a ${result.value}`);
}" />
