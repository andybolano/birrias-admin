# Configuración de Variables de Entorno

## Variables Requeridas

Para que la aplicación funcione correctamente, necesitas configurar las siguientes variables de entorno:

### VITE_API_URL

- **Descripción**: URL base de la API de Supabase
- **Valor**: `https://bfubdcpazartagbuqyvz.supabase.co/functions/v1`
- **Requerido**: Sí

## Configuración

### 1. Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```bash
VITE_API_URL=https://bfubdcpazartagbuqyvz.supabase.co/functions/v1
```

### 2. Archivo .env.local (opcional)

Para configuraciones locales específicas, puedes crear un archivo `.env.local`:

```bash
VITE_API_URL=http://localhost:3000
```

## Estructura de Configuración

La configuración de variables de entorno está centralizada en:

- `src/config/env.ts` - Configuración y validación centralizada
- `src/env.d.ts` - Tipos TypeScript para las variables
- `docs/ENVIRONMENT.md` - Esta documentación

## Validación

La aplicación valida automáticamente que todas las variables requeridas estén presentes al inicio. Si falta alguna variable, se mostrará un error en la consola.

## Uso en el Código

Para usar las variables de entorno en tu código:

```typescript
import { env } from "@/config/env";

// Usar la URL de la API
console.log(env.API_URL);

// Verificar el entorno
if (env.IS_DEVELOPMENT) {
  console.log("Modo desarrollo");
}
```

## Consideraciones de Seguridad

- Las variables que comienzan con `VITE_` son públicas y se incluyen en el bundle del cliente
- No incluyas información sensible en variables `VITE_`
- El archivo `.env` debe estar en `.gitignore` para evitar subir configuraciones locales
