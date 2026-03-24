<OuraDemo label="▶ Try Error Modal" :fn="(Oura) => Oura.fire({ title: 'Error', text: 'Connection failed', icon: 'error' })" />

## Confirm Action

The `.confirm` method automatically binds a Cancel and Confirm UI.

```javascript
const result = await Oura.confirm('Delete Workspace?', 'This action cannot be undone.');

if (result.isConfirmed) {
  Oura.success('Workspace Terminated!');
} else {
  Oura.info('Action canceled.');
}
```

<OuraDemo label="▶ Try Confirm" :fn="async (Oura) => {
  const result = await Oura.confirm('Delete Workspace?', 'This cannot be undone.');
  if (result.isConfirmed) Oura.success('Deleted!');
}" />

## Input Prompt

Capture direct user input elegantly without needing form structures!

```javascript
const result = await Oura.prompt('Enter your email', 'We will send a reset link', 'email');

if (result.isConfirmed && result.value) {
  Oura.toast(`Link safely dispatched to ${result.value}`);
}
```

<OuraDemo label="▶ Try Prompt" :fn="async (Oura) => {
  const result = await Oura.prompt('Enter your email', 'We will send a reset link', 'email');
  if (result.isConfirmed && result.value) Oura.toast(`Link sent to ${result.value}`);
}" />
