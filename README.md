<p align="center">
  <img src="https://cdn.simpleicons.org/angular/DD0031" width="72" alt="Angular logo" />
</p>

<h1 align="center">Reservaditos — Web de la administración</h1>

<p align="center">
  <a href="https://github.com/kingperseocs/reservaditos-webapp/actions/workflows/ci.yml"><img src="https://github.com/kingperseocs/reservaditos-webapp/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <img src="https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white" alt="Angular 22" />
  <img src="https://img.shields.io/badge/Angular_Material-22-3F51B5?logo=angular&logoColor=white" alt="Angular Material 22" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vitest-tests-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white" alt="pnpm 10" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License: MIT" /></a>
</p>

Web de la administración del **Edificio Demo**. Los residentes piden áreas comunes desde la app; aquí la administración ve esas solicitudes, las **aprueba o rechaza**, y puede **suspender un área** (las reservas pagadas se devuelven al 100 %). Consume la API de [reservaditos-backend](https://github.com/kingperseocs/reservaditos-backend).

## Requisitos
- Node **26 LTS** (`.nvmrc`; mínimo 22.22)
- pnpm 10
- El backend corriendo en `http://localhost:8000` (ver su README: `docker compose up -d`, `pnpm seed`, `pnpm start:dev`)

## Cómo correrlo
```bash
pnpm install
pnpm start          # http://localhost:4200
```

## Scripts
| Comando | Qué hace |
|---|---|
| `pnpm start` | Servidor de desarrollo en el puerto 4200 |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm lint` | ESLint (angular-eslint) |
| `pnpm build` | Build de producción en `dist/` |

## Estructura
```
src/app/
  core/       configuración, interceptores HTTP, layout (sidebar), notificaciones
  shared/     componentes de UI, pipes y modelos reutilizables
  features/
    reservations/   pantalla 5 · Solicitudes por aprobar
    areas/          pantalla 6 · Suspender un área
    residents/      «Próximamente»
```
Cada feature tiene `data-access/` (API + store con signals), `models/`, `pages/` y `components/`.

## Pantallas
### 5 · Solicitudes por aprobar (`/reservas`)
- Muestra las solicitudes que los residentes envían desde la app: residente, depto, área, fecha, horario y hace cuánto la pidieron.
- **Aparecen solas:** la lista se actualiza cada 10 s (se pausa si la pestaña está oculta) y las nuevas se resaltan unos segundos. El menú «Reservas» muestra cuántas hay pendientes.
- **«Pedida primero»** marca la solicitud más antigua cuando varias compiten por el mismo horario. Si se intenta aprobar otra, la web muestra el aviso del backend.
- **Aprobar** envía al residente su link de pago. **Rechazar** abre un diálogo para escribir o elegir el motivo.
- Filtros por área y mes.

### 6 · Suspender un área (`/areas`)
- Tabla de áreas con tarifa, garantía y estado.
- El modal pide motivo y rango de fechas y, **antes de confirmar**, avisa cuántas reservas pagadas se devolverán al 100 % y cuántas solicitudes sin pagar se rechazarán.

## Decisiones y supuestos
- **Sin login.** El backend usa identidad simulada; la web envía `x-user-id: admin` en cada petición mediante un interceptor (configurable en `src/environments`).
- **Diálogo de rechazo.** El Figma no lo muestra, pero el backend exige un motivo y el residente lo ve en la app. Sigue el estilo del modal de suspensión, con motivos sugeridos.
- **«Residentes» queda como «Próximamente».** Está en el menú del diseño, pero no es una de las pantallas pedidas ni tiene endpoint.
- **Actualización por polling (10 s) y no WebSockets.** Es suficiente para el volumen de un edificio y no agrega infraestructura al backend.
- **Filtros en el navegador.** Se cargan todas las solicitudes pendientes (son pocas) y se filtra en el cliente; así el contador del menú muestra el total real y los filtros responden al instante.
- **Fechas escritas como día/mes.** El adaptador nativo de Angular Material lee «14/11/2026» como mes/día; un adaptador propio (`DayFirstDateAdapter`) lo interpreta al estilo peruano.
- **Sin despliegue.** La prueba solo pide explicar el despliegue del backend; la web se corre en local.

## Cómo usé IA mientras programaba
Usé **Claude Code** como asistente de desarrollo, por pasos y con revisión mía antes de avanzar:

- **Reglas para la IA en el repo:** [CLAUDE/rules.md](CLAUDE/rules.md) define rol, objetivo, contrato con el backend, arquitectura por features y convenciones. El asistente lo lee en cada sesión.
- **Esqueleto primero:** generamos la estructura completa (core, shared, features, tema de Material con los colores del Figma) antes de las pantallas, para validar la arquitectura de un vistazo.
- **Pantallas contra la API real:** cada pantalla se probó en el navegador con el backend corriendo, incluida una solicitud creada «desde la app» que apareció sola en la web.
- **Bugs encontrados en esas pruebas:** las filas se recreaban en cada refresco automático (se corrigió con `trackBy`), las fechas escritas a mano no se reconocían (adaptador día/mes) y, en el backend, el área suspendida cambiaba de lugar en la lista (se corrigió y se agregó un test que lo reproduce).
- **Tests:** stores, tabla, diálogo de suspensión, adaptador de fechas y pipes, con Vitest.

Lo que no delegué: las decisiones de diseño y alcance, la revisión del código y las pruebas finales.

> Reglas del proyecto para el desarrollo asistido: [CLAUDE/rules.md](CLAUDE/rules.md).

## Licencia
Distribuido bajo la licencia [MIT](LICENSE).
