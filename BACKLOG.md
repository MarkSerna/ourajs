# Backlog de Producto (Oura vs SweetAlert2)

Este backlog está pensado para abrir issues de GitHub directamente y ejecutar por fases.

## Objetivo

Llevar Oura a nivel competitivo con SweetAlert2 en:

- API madura y predecible.
- Accesibilidad y seguridad.
- Robustez (tests y edge-cases).
- DX (integración real en frameworks).

---

## P0 (crítico, alto impacto)

### P0-01: API de ciclo de vida de modal

**Título sugerido del issue:** `feat(modal): add lifecycle hooks (willOpen/didOpen/willClose/didClose/didDestroy)`

**Qué hacer**

- Añadir callbacks en `OuraOptions` para ciclo de vida.
- Ejecutar hooks en orden garantizado, incluso con cierre por `Escape`, click fuera o `preConfirm`.

**Criterios de aceptación**

- [ ] Hooks se ejecutan en orden correcto en apertura/cierre normal.
- [ ] Hooks se ejecutan en cierre por `Escape` y click fuera.
- [ ] Hooks funcionan con modales apilados.
- [ ] Tests unitarios para todos los caminos.

---

### P0-02: Modo seguro por defecto para contenido textual

**Título sugerido del issue:** `security(api): safe text mode by default and explicit trusted html`

**Qué hacer**

- Introducir campos explícitos para HTML confiable (`trustedHtml`, `trustedTitleHtml`, etc.) o una bandera clara.
- Usar `textContent` por defecto en title/text cuando no sea contenido confiable.

**Criterios de aceptación**

- [ ] El flujo por defecto no inyecta HTML en title/text.
- [ ] HTML sigue siendo posible solo con API explícita.
- [ ] Guía de migración corta para usuarios actuales.
- [ ] Tests de regresión para XSS básico.

---

### P0-03: `queue()` avanzada (pasos reales)

**Título sugerido del issue:** `feat(queue): add progress steps, cancel flow, and shared context`

**Qué hacer**

- Extender `queue()` para soportar:
  - progreso visual (`currentStep/total`),
  - cancelación global,
  - contexto compartido entre pasos.

**Criterios de aceptación**

- [ ] Se puede cancelar la cola sin dejar listeners colgados.
- [ ] Cada paso puede leer/escribir contexto de flujo.
- [ ] Progress UI configurable.
- [ ] Tests de interrupción y finalización completa.

---

### P0-04: Elevar umbrales de cobertura

**Título sugerido del issue:** `test(coverage): raise minimum thresholds to 65/55/60/70`

**Qué hacer**

- Subir `thresholds` en `vitest.config.ts` de forma progresiva.
- Añadir tests para ramas faltantes en componentes flotantes y cierres.

**Criterios de aceptación**

- [ ] Umbral CI: statements >= 65, branches >= 55, functions >= 60, lines >= 70.
- [ ] CI falla si baja cobertura.
- [ ] No snapshots frágiles; tests conductuales.

---

## P1 (importante, diferenciación)

### P1-01: Presets y `mixin()`

**Título sugerido del issue:** `feat(api): add mixin/preset support for reusable defaults`

**Qué hacer**

- Soportar creación de instancias preconfiguradas (`Oura.mixin({ ...defaults })`).
- Mantener instancia global actual como comportamiento por defecto.

**Criterios de aceptación**

- [ ] Preset aplica defaults sin mutar global.
- [ ] Overrides por llamada siguen funcionando.
- [ ] Tipos TS completos para mixins.

---

### P1-02: Event bus interno (observabilidad)

**Título sugerido del issue:** `feat(core): add internal events for open/close/confirm/dismiss`

**Qué hacer**

- Exponer eventos opcionales para analytics/debug (`onEvent` o `subscribe`).

**Criterios de aceptación**

- [ ] Eventos de modal/toast/componentes con payload estable.
- [ ] Sin impacto cuando no se usa.
- [ ] Documentación de eventos y compatibilidad.

---

### P1-03: Gestión de foco avanzada y configurable

**Título sugerido del issue:** `a11y(modal): add focusConfirm/focusCancel/returnFocus/allowEnterKey`

**Qué hacer**

- Opciones finas para foco inicial y retorno de foco.
- Compatibilidad con teclado (`Enter`, `Escape`) configurable.

**Criterios de aceptación**

- [ ] Navegación completa con teclado.
- [ ] WCAG básico cubierto en modales y drawers.
- [ ] Tests con JSDOM para foco/teclas.

---

## P2 (adopción y ecosistema)

### P2-01: Guía de migración desde SweetAlert2

**Título sugerido del issue:** `docs(migration): sweetalert2 -> oura mapping and examples`

**Qué hacer**

- Documento con equivalencias API (`Swal.fire`, `Swal.mixin`, `Swal.queue`, etc.).

**Criterios de aceptación**

- [ ] Tabla de mapeo clara.
- [ ] Ejemplos antes/después.
- [ ] Nota de diferencias intencionales.

---

### P2-02: Ejemplos oficiales por framework

**Título sugerido del issue:** `docs(examples): add React/Vue/Svelte integration examples (client-only + SSR-safe)`

**Qué hacer**

- Crear ejemplos reales de uso en frameworks.

**Criterios de aceptación**

- [ ] React, Vue y Svelte con patrón client-only.
- [ ] Sección SSR y errores comunes.
- [ ] Código copiable y probado.

---

### P2-03: Templates de issues y PR

**Título sugerido del issue:** `chore(github): add issue and pull request templates`

**Qué hacer**

- Añadir plantillas en `.github/ISSUE_TEMPLATE` y PR template.

**Criterios de aceptación**

- [ ] Bug report template.
- [ ] Feature request template.
- [ ] PR template con checklist de tests/lint/docs.

---

## Orden recomendado de ejecución

1. P0-01
2. P0-02
3. P0-03
4. P0-04
5. P1-01
6. P1-03
7. P1-02
8. P2-01
9. P2-02
10. P2-03

---

## Definición de terminado (global)

Un issue se considera terminado solo si cumple:

- [ ] Código implementado.
- [ ] Tests nuevos o actualizados.
- [ ] `npm run lint`, `npm run format:check`, `npm run build`, `npm run test:coverage` en verde.
- [ ] Documentación mínima actualizada (README o docs guide).
- [ ] Nota en `CHANGELOG.md` si es cambio visible para usuarios.
