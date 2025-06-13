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
│       ├── useTournamentFormats.ts       # Hook para obtener formatos (legacy)
│       ├── useTournamentPhaseTypes.ts    # Hook para obtener tipos de fases
│       ├── useTournamentSchema.ts        # Hook para gestionar esquemas
│       └── useCreateTournament.ts        # Hook para crear torneos
└── presentation/
    ├── CreateTournamentForm.tsx          # Formulario de creación
    ├── CreateTournamentPage.tsx          # Página contenedora
    ├── TournamentSchemaManager.tsx       # Gestor de esquemas de torneo
    ├── TournamentSchemaManagerWrapper.tsx # Wrapper con integración de hooks
    ├── ManageTournamentPage.tsx          # Página de gestión del torneo
    └── TournamentDetails.tsx             # Detalles del torneo
```

## Funcionalidades

### Creación de Torneos

La vista de creación de torneos (`/tournaments/create`) permite crear nuevos torneos con información básica.

#### Información Básica

**Campos requeridos:**
- Nombre del torneo
- Fecha de inicio
- Cuota de inscripción
- Moneda

### Gestión de Torneos

La vista de gestión de torneos (`/tournaments/{id}/manage`) permite administrar todos los aspectos del torneo a través de pestañas:

#### Pestaña: Equipos
- Agregar/eliminar equipos del torneo
- Ver estadísticas de equipos inscritos
- Generar fixtures (requiere esquema configurado)

#### Pestaña: Fixtures
- Ver y gestionar los partidos del torneo
- Disponible después de generar fixtures

#### Pestaña: Esquema ⭐ **NUEVO**
- **Configuración requerida antes de generar fixtures**
- Gestión dinámica de fases del torneo
- Cada fase puede tener diferentes tipos y configuraciones

### Esquema del Torneo

El sistema de esquemas permite crear torneos con fases dinámicas. **La configuración del esquema es obligatoria antes de generar los fixtures.**

**Tipos de Fases Disponibles:**

Los tipos de fases se obtienen dinámicamente del endpoint `/api/tournament-phase-types`. Ejemplo de respuesta:

```json
{
  "phase_types": [
    {
      "value": "round_robin",
      "label": "Todos contra Todos",
      "description": "Cada equipo juega contra todos los demás equipos",
      "supports_home_away": true,
      "required_fields": [],
      "optional_fields": ["home_away", "teams_advance"],
      "config_options": {
        "rounds": "Número de vueltas"
      }
    }
  ]
}
```

**Configuración de Fases:**

Cada fase puede configurarse con:
- **Nombre**: Identificador de la fase (ej: "Fase de Grupos", "Semifinales")
- **Tipo**: Tipo de fase seleccionado de los disponibles
- **Configuración**: Opciones específicas según el tipo de fase
  - Campos de configuración (ej: número de vueltas)
  - Campos opcionales (ej: partidos de ida y vuelta, equipos que avanzan)

**Gestión de Fases:**

- **Agregar**: Crear nuevas fases dinámicamente
- **Editar**: Modificar configuración de fases existentes
- **Eliminar**: Remover fases del esquema
- **Reordenar**: Cambiar el orden de las fases (↑/↓)

### Flujo de Trabajo

1. **Crear Torneo**: Información básica del torneo
2. **Configurar Esquema**: Definir fases del torneo (obligatorio)
3. **Agregar Equipos**: Inscribir equipos al torneo
4. **Generar Fixtures**: Crear partidos basados en el esquema
5. **Gestionar Partidos**: Administrar resultados y fechas

### Interfaces de Datos

#### TournamentPhaseType
```typescript
interface TournamentPhaseType {
  value: string;                    // Identificador único del tipo
  label: string;                    // Nombre para mostrar
  description: string;              // Descripción del tipo
  supports_home_away: boolean;      // Si soporta partidos ida/vuelta
  required_fields: string[];        // Campos obligatorios
  optional_fields: string[];        // Campos opcionales
  config_options: Record<string, string>; // Opciones de configuración
}
```

#### TournamentPhase
```typescript
interface TournamentPhase {
  id?: string;                      // ID opcional (para fases existentes)
  name: string;                     // Nombre de la fase
  type: string;                     // Tipo de fase
  order: number;                    // Orden de la fase
  config: Record<string, string | number | boolean>; // Configuración
}
```

#### TournamentSchema
```typescript
interface TournamentSchema {
  phases: TournamentPhase[];        // Array de fases del torneo
}
```

## Uso

### Gestionar Esquema de Torneo

```typescript
// Navegar a la gestión del torneo
<Link to="/tournaments/{id}/manage">Gestionar Torneo</Link>

// Usar el hook de esquemas
const { schema, loading, updating, error, updateSchema } = useTournamentSchema(tournamentId);

// Usar el hook de tipos de fases
const { phaseTypes, loading, error } = useTournamentPhaseTypes();

// Ejemplo de esquema
const schema: TournamentSchema = {
  phases: [
    {
      name: "Fase de Grupos",
      type: "round_robin",
      order: 1,
      config: {
        rounds: 2,
        home_away: true
      }
    },
    {
      name: "Eliminatorias",
      type: "knockout",
      order: 2,
      config: {
        teams_advance: 8
      }
    }
  ]
};
```

### Componente TournamentSchemaManagerWrapper

```typescript
<TournamentSchemaManagerWrapper tournamentId={tournamentId} />
```

## API Endpoints

- `GET /api/tournament-phase-types` - Obtener tipos de fases disponibles
- `GET /api/tournaments/{id}/schema` - Obtener esquema del torneo
- `PUT /api/tournaments/{id}/schema` - Actualizar esquema del torneo
- `POST /api/tournaments` - Crear nuevo torneo (solo información básica)
- `GET /api/tournaments` - Listar torneos
- `GET /api/tournaments/{id}` - Obtener detalles de torneo
- `POST /api/tournaments/{id}/generate-fixtures` - Generar fixtures (requiere esquema)

## Validaciones

- **Esquema requerido**: No se pueden generar fixtures sin un esquema configurado
- **Fases válidas**: Cada fase debe tener un tipo válido y configuración completa
- **Orden secuencial**: Las fases deben estar ordenadas correctamente

## Migración

El sistema anterior de formatos fijos ha sido reemplazado por el nuevo sistema de esquemas dinámicos. Los torneos existentes mantienen su compatibilidad, pero los nuevos torneos requieren configuración de esquema antes de generar fixtures.
