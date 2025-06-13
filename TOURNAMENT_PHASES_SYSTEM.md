# 🎯 Sistema de Fases Dinámicas - Implementación Frontend

## 📋 Resumen

El Sistema de Fases Dinámicas permite crear torneos completamente personalizables donde cada fase puede tener diferentes configuraciones y tipos de competencia. Este documento describe la implementación frontend del sistema.

## 🏗️ Arquitectura Frontend

### Estructura de Archivos

```
src/modules/tournaments/
├── domain/
│   └── types.ts                          # Interfaces y tipos
├── infrastructure/
│   └── api.ts                           # Endpoints API
├── application/hooks/
│   ├── useTournamentPhases.ts           # Hook para gestión de fases
│   └── useTournamentPhaseTypes.ts       # Hook para tipos de fase
└── presentation/
    ├── TournamentPhasesManager.tsx      # Componente principal
    └── ManageTournamentPage.tsx         # Página de gestión actualizada
```

### Interfaces Principales

#### TournamentPhase
```typescript
export interface TournamentPhase {
  id?: string;
  name: string;
  type: string;
  order: number;
  config: Record<string, string | number | boolean>;
  home_away?: boolean;
  teams_advance?: number;
  groups_count?: number;
  teams_per_group?: number;
  is_active?: boolean;
  is_completed?: boolean;
}
```

#### CreateTournamentPhaseRequest
```typescript
export interface CreateTournamentPhaseRequest {
  name: string;
  type: string;
  home_away?: boolean;
  teams_advance?: number;
  groups_count?: number;
  teams_per_group?: number;
  config?: Record<string, string | number | boolean>;
}
```

#### TournamentPhaseResponse
```typescript
export interface TournamentPhaseResponse {
  id: string;
  tournament_id: string;
  phase_number: number;
  name: string;
  type: string;
  config: Record<string, string | number | boolean>;
  home_away: boolean;
  teams_advance?: number;
  groups_count?: number;
  teams_per_group?: number;
  is_active: boolean;
  is_completed: boolean;
  order: number;
  matches_count?: number;
}
```

## 🔌 API Integration

### Endpoints Implementados

#### Obtener Tipos de Fase
```typescript
getPhaseTypes: () => request.get<TournamentPhaseTypesResponse>("/tournament-phase-types")
```

#### Gestión de Fases
```typescript
// Obtener fases del torneo
getTournamentPhases: (tournamentId: string) => 
  request.get<TournamentPhasesResponse>(`/tournaments/${tournamentId}/phases`)

// Crear nueva fase
createTournamentPhase: (tournamentId: string, data: CreateTournamentPhaseRequest) => 
  request.post<TournamentPhaseResponse>(`/tournaments/${tournamentId}/phases`, data)

// Generar fixtures de una fase
generatePhaseFixtures: (tournamentId: string, phaseId: string) => 
  request.post(`/tournaments/${tournamentId}/phases/${phaseId}/generate-fixtures`)
```

## 🎮 Componentes

### TournamentPhasesManager

Componente principal que gestiona las fases del torneo.

**Props:**
- `tournamentId: string` - ID del torneo

**Funcionalidades:**
- ✅ Listar fases existentes
- ✅ Crear nuevas fases
- ✅ Generar fixtures por fase
- ✅ Mostrar estado de cada fase (activa, completada)
- ✅ Configuración dinámica según tipo de fase

### NewPhaseForm

Formulario para crear nuevas fases con configuración dinámica.

**Características:**
- ✅ Selección de tipo de fase
- ✅ Campos dinámicos según el tipo seleccionado
- ✅ Validación en tiempo real
- ✅ Configuración específica por tipo (grupos, equipos que avanzan, etc.)

### PhaseCard

Tarjeta que muestra información de una fase existente.

**Información mostrada:**
- ✅ Nombre y tipo de fase
- ✅ Estado (activa, completada)
- ✅ Configuración específica
- ✅ Número de partidos generados
- ✅ Botón para generar fixtures

## 🎯 Hooks

### useTournamentPhases

Hook principal para gestionar las fases de un torneo.

```typescript
const {
  phases,           // Array de fases
  loading,          // Estado de carga
  creating,         // Estado de creación
  error,            // Errores
  createPhase,      // Función para crear fase
  generateFixtures, // Función para generar fixtures
  refetch,          // Refrescar datos
} = useTournamentPhases(tournamentId);
```

### useTournamentPhaseTypes

Hook para obtener los tipos de fase disponibles.

```typescript
const {
  phaseTypes,  // Array de tipos disponibles
  loading,     // Estado de carga
  error,       // Errores
} = useTournamentPhaseTypes();
```

## 🔄 Flujo de Trabajo

### 1. Crear Torneo
```typescript
// Solo información básica
const tournamentData = {
  name: "Copa del Mundo Birrias 2024",
  start_date: "2024-06-01",
  fee: 100,
  currency: "USD"
};
```

### 2. Configurar Fases
```typescript
// Ejemplo: Fase de Grupos
const groupPhase = {
  name: "Fase de Grupos",
  type: "groups",
  groups_count: 8,
  teams_per_group: 4,
  teams_advance: 16
};

// Ejemplo: Octavos de Final
const knockoutPhase = {
  name: "Octavos de Final",
  type: "single_elimination",
  teams_advance: 8,
  home_away: false
};
```

### 3. Generar Fixtures
```typescript
// Se genera por fase individual
await generatePhaseFixtures(tournamentId, phaseId);
```

## 🎨 UI/UX Features

### Estados Visuales
- **Cargando**: Spinner con mensaje descriptivo
- **Error**: Banner rojo con mensaje de error
- **Creando**: Banner azul indicando creación en progreso
- **Éxito**: Banner verde confirmando operación

### Validaciones
- ✅ Nombre de fase requerido
- ✅ Tipo de fase requerido
- ✅ Validación de campos numéricos
- ✅ Configuración específica por tipo

### Responsive Design
- ✅ Grid adaptativo para formularios
- ✅ Botones responsivos
- ✅ Tarjetas de fase optimizadas para móvil

## 🔧 Configuraciones por Tipo de Fase

### Round Robin
```typescript
{
  name: "Liga Regular",
  type: "round_robin",
  home_away: true,
  teams_advance: 8,
  config: {
    rounds: 2
  }
}
```

### Single Elimination
```typescript
{
  name: "Playoffs",
  type: "single_elimination",
  teams_advance: 8,
  home_away: true,
  config: {
    bracket_seeding: "ranked"
  }
}
```

### Groups
```typescript
{
  name: "Fase de Grupos",
  type: "groups",
  groups_count: 4,
  teams_per_group: 4,
  teams_advance: 8,
  config: {
    group_assignment: "random",
    advance_per_group: 2
  }
}
```

## 🚀 Ventajas del Sistema

### Flexibilidad
- ✅ Cualquier combinación de tipos de fase
- ✅ Configuración granular por fase
- ✅ Fácil extensión para nuevos tipos

### Usabilidad
- ✅ Interfaz intuitiva
- ✅ Validación en tiempo real
- ✅ Feedback visual claro
- ✅ Flujo de trabajo guiado

### Escalabilidad
- ✅ Arquitectura modular
- ✅ Hooks reutilizables
- ✅ Componentes independientes
- ✅ API bien estructurada

## 🔍 Debugging

### Logs Útiles
```typescript
// En desarrollo, verificar:
console.log("Phases:", phases);
console.log("Phase Types:", phaseTypes);
console.log("Creating:", creating);
console.log("Error:", error);
```

### Estados a Verificar
- ✅ `phases.length` - Número de fases creadas
- ✅ `phase.is_active` - Fase actualmente activa
- ✅ `phase.matches_count` - Partidos generados
- ✅ `phaseTypes.length` - Tipos disponibles cargados

## 📝 Próximos Pasos

### Funcionalidades Pendientes
- [ ] Editar fases existentes
- [ ] Reordenar fases (drag & drop)
- [ ] Eliminar fases
- [ ] Duplicar configuración de fase
- [ ] Plantillas de torneo predefinidas

### Mejoras de UX
- [ ] Preview de fixtures antes de generar
- [ ] Wizard para configuración de torneo completo
- [ ] Validación avanzada de configuraciones
- [ ] Exportar/importar configuración de fases

---

**El Sistema de Fases Dinámicas está listo para crear torneos completamente personalizables con máxima flexibilidad y facilidad de uso.** 