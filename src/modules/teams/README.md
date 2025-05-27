# Módulo de Equipos

Este módulo maneja la funcionalidad relacionada con la creación y gestión de equipos.

## Estructura

```
teams/
├── domain/
│   └── types.ts              # Tipos e interfaces del dominio
├── infrastructure/
│   └── api.ts               # Llamadas a la API
├── application/
│   └── hooks/
│       ├── useTeams.ts      # Hook para obtener equipos
│       └── useCreateTeam.ts # Hook para crear equipos
└── presentation/
    ├── CreateTeamForm.tsx   # Formulario de creación
    ├── CreateTeamPage.tsx   # Página de creación
    ├── TeamsList.tsx        # Lista de equipos
    └── TeamsPage.tsx        # Página principal de equipos
```

## Funcionalidades

### Creación de Equipos

La vista de creación de equipos (`/teams/create`) permite crear nuevos equipos con:

- **Nombre del equipo** (requerido)
- **Escudo del equipo** (opcional) - Imagen hasta 5MB

#### Características del Formulario

- **Validación en tiempo real**: El nombre es requerido
- **Subida de archivos**: Componente drag & drop para escudos
- **Preview de imagen**: Vista previa del escudo seleccionado
- **Validación de archivos**: Tamaño máximo 5MB, solo imágenes
- **Estados de carga**: Feedback visual durante la creación

### Lista de Equipos

La vista de equipos (`/teams`) muestra todos los equipos registrados con:

- **Tarjetas visuales**: Cada equipo en una tarjeta con escudo
- **Información básica**: Nombre y fecha de creación
- **Escudo placeholder**: Icono por defecto si no hay escudo
- **Paginación**: Información de páginas cuando hay muchos equipos
- **Estados manejados**: Carga, error, vacío

## Componentes UI

### FileUpload

Componente reutilizable para subir archivos con:

- **Drag & drop**: Área de arrastre visual
- **Preview**: Vista previa de imágenes
- **Validación**: Tamaño y tipo de archivo
- **Estados**: Selección, preview, error
- **Accesibilidad**: Labels y feedback apropiados

## Uso

```typescript
// Navegar a equipos
<Link to="/teams">Ver Equipos</Link>
<Link to="/teams/create">Crear Equipo</Link>

// Usar hooks
const { teams, loading, error } = useTeams();
const { createTeam, loading, error } = useCreateTeam();

// Usar FileUpload
<FileUpload
  onFileSelect={handleFileSelect}
  accept="image/*"
  maxSize={5}
  placeholder="Seleccionar escudo"
/>
```

## API Endpoints

- `GET /teams` - Obtener lista de equipos (paginada)
- `POST /teams` - Crear nuevo equipo (multipart/form-data)

### Formato de Datos

**Crear Equipo:**

```typescript
{
  name: string;
  shield?: File; // Imagen del escudo
}
```

**Respuesta del Equipo:**

```typescript
{
  id: string;
  name: string;
  shield_url?: string;
  created_at: string;
  updated_at: string;
}
```

## Navegación

- **HomePage → Equipos**: Botones "Ver Equipos" y "Crear Equipo"
- **Equipos → Crear**: Botón "Crear Nuevo Equipo"
- **Estado vacío → Crear**: Botón "Crear Primer Equipo"

## Características Técnicas

- **Subida de archivos**: FormData con multipart/form-data
- **Validación de imágenes**: Tipo MIME y tamaño
- **Preview en tiempo real**: URL.createObjectURL()
- **Gestión de memoria**: Cleanup de URLs de preview
- **Responsive design**: Grid adaptativo para diferentes pantallas
