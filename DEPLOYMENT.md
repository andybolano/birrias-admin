# Guía de Despliegue en Netlify

Este documento contiene las instrucciones para desplegar el proyecto **Birrias Admin** en Netlify.

## Configuraciones Realizadas

### 1. Archivos de Configuración Creados

- **`netlify.toml`**: Configuración principal de Netlify con build settings, redirects y headers
- **`public/_redirects`**: Archivo de respaldo para redirects de SPA
- **`env.example`**: Ejemplo de variables de entorno necesarias
- **`vite.config.ts`**: Actualizado con optimizaciones para producción

### 2. Configuraciones Incluidas

- ✅ Build command: `npm run build:prod` (optimizado para Netlify)
- ✅ Publish directory: `dist`
- ✅ Node.js version: 18
- ✅ SPA redirects para React Router
- ✅ Headers de seguridad
- ✅ Optimización de cache
- ✅ Configuración de assets

## Pasos para Desplegar

### 1. Preparar el Repositorio

```bash
# Asegúrate de que todos los cambios estén committeados
git add .
git commit -m "Add Netlify deployment configuration"
git push origin main
```

### 2. Configurar en Netlify

1. **Conectar Repositorio**:
   - Ve a [netlify.com](https://netlify.com) e inicia sesión
   - Click en "New site from Git"
   - Conecta tu repositorio de GitHub/GitLab/Bitbucket
   - Selecciona el repositorio `birrias-admin`

2. **Configuración de Build** (debería detectarse automáticamente):
   - **Build command**: `npm run build:prod`
   - **Publish directory**: `dist`
   - **Base directory**: (dejar vacío)

3. **Variables de Entorno**:
   - Ve a Site settings > Environment variables
   - Agrega las siguientes variables:
     ```
     VITE_API_URL = https://birrias-api.onrender.com/api
     NODE_ENV = production
     ```

### 3. Desplegar

1. Click en "Deploy site"
2. Netlify comenzará el proceso de build automáticamente
3. Una vez completado, tendrás una URL como: `https://amazing-name-123456.netlify.app`

### 4. Configurar Dominio Personalizado (Opcional)

1. Ve a Site settings > Domain management
2. Click en "Add custom domain"
3. Ingresa tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

## Comandos Útiles

```bash
# Construir localmente para verificar (desarrollo)
npm run build

# Construir para producción (igual que Netlify)
npm run build:prod

# Preview del build local
npm run preview

# Verificar que no hay errores de lint
npm run lint
```

## Verificaciones Post-Despliegue

Después del despliegue, verifica que:

- ✅ La aplicación carga correctamente
- ✅ Las rutas de React Router funcionan (navegar directamente a `/tournaments`, etc.)
- ✅ Las llamadas a la API funcionan correctamente
- ✅ Los assets (CSS, JS, imágenes) se cargan sin errores
- ✅ No hay errores en la consola del navegador

## Troubleshooting

### Problema: Rutas 404
**Solución**: Verifica que el archivo `public/_redirects` existe y que `netlify.toml` tiene la configuración de redirects.

### Problema: API no funciona
**Solución**: Verifica que `VITE_API_URL` esté configurada correctamente en las variables de entorno de Netlify.

### Problema: Build falla
**Solución**: 
1. Verifica que `package.json` tenga todas las dependencias
2. Ejecuta `npm run build:prod` localmente para identificar errores
3. Revisa los logs de build en Netlify

### Problema: "tsc: not found" en Netlify
**Solución**: Este error se resuelve usando `npm run build:prod` en lugar de `npm run build`. El script `build:prod` usa solo Vite sin TypeScript compilation por separado, evitando problemas de dependencias en Netlify.

### Problema: Assets no cargan
**Solución**: Verifica que la configuración de `base` en `vite.config.ts` sea correcta para tu dominio.

## Configuración de CI/CD

El despliegue automático está configurado:
- ✅ Cada push a `main` despliega automáticamente
- ✅ Preview deployments para pull requests
- ✅ Build logs disponibles en Netlify dashboard

## Monitoreo

Netlify proporciona:
- 📊 Analytics de tráfico
- 🚨 Alertas de build failures
- 📈 Performance metrics
- 🔍 Function logs (si usas Netlify Functions)

---

**¡Listo!** Tu aplicación debería estar funcionando en Netlify. Si tienes problemas, revisa los logs de build en el dashboard de Netlify. 