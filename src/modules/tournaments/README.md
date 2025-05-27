# Módulo de Torneos

Este módulo maneja la funcionalidad relacionada con la creación y gestión de torneos.

## Estructura

```
tournaments/
├── domain/
│   └── types.ts              # Tipos e interfaces del dominio
├── infrastructure/
│   └── api.ts               # Llamadas a la API
├── application/
│   └── hooks/
│       ├── useTournamentFormats.ts    # Hook para obtener formatos
│       └── useCreateTournament.ts     # Hook para crear torneos
└── presentation/
    ├── CreateTournamentForm.tsx       # Formulario de creación
    └── CreateTournamentPage.tsx       # Página contenedora
```

## Funcionalidades

### Creación de Torneos

La vista de creación de torneos (`/tournaments/create`) permite crear nuevos torneos con campos dinámicos según el formato seleccionado.

#### Formatos Disponibles

1. **Liga Simple** (`league`)

   - Campos requeridos: `rounds`
   - Campos opcionales: `home_away`
   - Campos ignorados: `groups`, `teams_per_group`, `playoff_size`

2. **Liga + Playoffs** (`league_playoffs`)

   - Campos requeridos: `rounds`, `playoff_size`
   - Campos opcionales: `home_away`
   - Campos ignorados: `groups`, `teams_per_group`

3. **Grupos + Eliminatorias** (`groups_knockout`)
   - Campos requeridos: `groups`, `teams_per_group`, `playoff_size`, `rounds`
   - Campos opcionales: `home_away`
   - Campos ignorados: ninguno

#### Campos del Formulario

**Información Básica (siempre visible):**

- Nombre del torneo
- Fecha de inicio
- Cuota de inscripción
- Moneda

**Configuración del Formato (dinámico):**

- Número de vueltas
- Número de grupos
- Equipos por grupo
- Tamaño de playoffs
- Partidos de ida y vuelta

Los campos se muestran u ocultan automáticamente según el formato seleccionado, y se marcan como requeridos u opcionales según la configuración del formato.

## Uso

```typescript
// Navegar a la página de creación
<Link to="/tournaments/create">Crear Torneo</Link>;

// Usar el hook de formatos
const { formats, loading, error } = useTournamentFormats();

// Usar el hook de creación
const { createTournament, loading, error } = useCreateTournament();
```

## API Endpoints

- `GET /api/tournaments/formats` - Obtener formatos disponibles
- `POST /api/tournaments` - Crear nuevo torneo
