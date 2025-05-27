# Birrias Admin

A modern admin dashboard built with React, TypeScript, and shadcn/ui, following clean architecture principles.

## Project Structure

The project follows a screaming architecture pattern with clean architecture principles:

```
src/
├── core/                 # Core functionality and utilities
│   └── request/         # Centralized HTTP request handling
├── modules/             # Feature modules
│   ├── auth/           # Authentication module
│   │   ├── domain/     # Business logic and types
│   │   ├── application/# Use cases and services
│   │   ├── infrastructure/ # External services implementation
│   │   └── presentation/   # React components
│   ├── home/           # Home module
│   └── register/       # Registration module
└── ui-lib/             # UI component library
    └── atoms/          # Atomic components
```

## Features

- Authentication (Login/Register)
- Protected routes
- Modern UI with shadcn/ui components
- TypeScript for type safety
- Clean architecture implementation
- Centralized HTTP request handling

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:

   ```
   VITE_API_URL=your_api_url_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture

The project follows clean architecture principles:

- **Domain Layer**: Contains business logic, entities, and interfaces
- **Application Layer**: Implements use cases and orchestrates domain objects
- **Infrastructure Layer**: Implements external services and repositories
- **Presentation Layer**: Contains React components and UI logic

## UI Components

The project uses shadcn/ui components, which are encapsulated in the `ui-lib/atoms` directory. Each component is built as an atomic component following the atomic design methodology.

## Development

- Use TypeScript for all new code
- Follow the established folder structure
- Keep components small and focused
- Use composition over inheritance
- Write clean, maintainable code
