# CLAUDE.md — Landing Steffano Millones

> Este archivo es leído automáticamente por Claude Code al iniciar en este directorio.
> Define el comportamiento esperado de Claude para git, Vercel y el flujo de deploy.

---

## 1. Identidad del proyecto

```
PROYECTO   : landing-steffano
OWNER      : Steffano Millones
STACK      : HTML + CSS + JS vanilla (sin framework, sin Node)
ESTILOS    : CSS puro — styles/main.css + styles/waves.css
JS         : scripts/main.js + scripts/waves.js
BASE DATOS : N/A
DEPLOY     : Vercel (static site, sin build command)
BRANCH PROD: main
BRANCH DEV : develop
```

### Paleta del proyecto
```
Background : #070410
Primario   : #9D5CF6  (amatista)
Acento     : #E879A0  (rosa)
```

### Contacto del owner
```
WhatsApp : +51992551735
Email    : steffanomillones@gmail.com
```

### Estructura de carpetas
```
landing-steffano/
├── index.html
├── styles/
│   ├── main.css
│   └── waves.css
├── scripts/
│   ├── main.js
│   └── waves.js
└── assets/
    └── images/
```

---

## 2. Contexto del negocio

Steffano es consultor especializado en soluciones digitales para empresas y MYPEs:

- **Dashboards ejecutivos** para toma de decisiones
- **Automatizaciones con n8n** para reducir trabajo manual
- **Agentes de IA** para operaciones internas
- Integraciones con Airtable, BigQuery, Google Sheets y APIs

**Tono del copy:** formal profesional. Sin jerga técnica innecesaria.
**Audiencia:** gerentes, equipos operativos, dueños de MYPE.

---

## 3. Reglas de Git — OBLIGATORIAS

### 3.1 Flujo auditado

```
Claude edita archivos
    ↓
Claude hace git add + git commit
    ↓
Claude muestra resumen del diff    ← STEFFANO AUDITA AQUÍ
    ↓
Steffano aprueba con "push" o "ok push"
    ↓
Claude ejecuta git push origin [branch]
    ↓
Vercel detecta el push y deploya automáticamente
```

### 3.2 Reglas estrictas

- **SIEMPRE** hacer `git add` + `git commit` al terminar cada tarea o iteración.
- **NUNCA** hacer `git push` sin aprobación explícita de Steffano.
- **SIEMPRE** mostrar resumen del diff tras el commit:
  ```bash
  git diff HEAD~1 --stat
  ```
- Si Steffano rechaza o pide corrección: usar `git commit --amend`, no crear commit nuevo.
- Si Steffano aprueba: ejecutar `git push origin [branch actual]`.

### 3.3 Mensaje que Claude muestra tras cada commit

```
✅ Commit: "[mensaje]"

📄 Cambios:
[output de git diff HEAD~1 --stat]

🔍 Para ver el diff completo: git diff HEAD~1
💬 ¿Hacemos push a [branch]? Responde "push" para subir o dime qué corregir.
```

---

## 4. Convención de commits

Formato: `tipo: descripción breve en minúsculas`

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat:` | Nueva sección o funcionalidad visual |
| `fix:` | Corrección de bug o error visual |
| `style:` | Ajustes de CSS, colores, tipografía, espaciado |
| `perf:` | Optimización de imágenes, animaciones, performance |
| `content:` | Cambios de copy, textos, headlines |
| `chore:` | Archivos de configuración, `.gitignore`, meta tags |
| `refactor:` | Reorganización de código sin cambio visual |

Ejemplos válidos:
```
feat: sound waves hero con 6 capas y glow amatista
fix: botón whatsapp sin pulso en safari mobile
style: aumentar espaciado entre secciones a 120px
content: actualizar headline opción B en hero
perf: convertir imágenes proyectos a webp
chore: agregar meta tags open graph completos
```

---

## 5. Conexión a GitHub

### 5.1 Setup inicial (solo una vez)

```bash
# Verificar si ya existe remote
git remote -v

# Si no existe, agregar:
git remote add origin https://github.com/steffanomillones/landing-steffano.git

# Verificar rama actual
git branch --show-current

# Si la rama es 'master', renombrar:
git branch -m master main
```

### 5.2 Push estándar (post-aprobación)

```bash
# Primera vez
git push -u origin main

# Pushes siguientes
git push origin main
```

### 5.3 Si el push falla por conflicto

1. Claude muestra el error exacto.
2. Claude **NO** resuelve el conflicto solo.
3. Claude espera instrucción de Steffano.

---

## 6. Conexión a Vercel

### 6.1 Este proyecto es HTML estático

Vercel detecta automáticamente que no hay framework ni build command.
**No se necesita** `npm install`, `npm run build` ni ningún comando previo.
Vercel simplemente sirve el `index.html` directamente.

### 6.2 Setup inicial (solo una vez)

```bash
# Instalar Vercel CLI si no está
npm install -g vercel

# Linkear el proyecto desde la carpeta raíz
vercel link

# Cuando pregunte:
# → Set up and deploy? Y
# → Which scope? [cuenta de Steffano]
# → Link to existing project? N (primera vez)
# → Project name: landing-steffano
# → In which directory is your code located? ./
# → Want to override the settings? N
```

### 6.3 Configuración de Vercel para HTML estático

Si Vercel pide build settings, dejar así:
```
Framework Preset : Other
Build Command    : (vacío — no hay build)
Output Directory : . (punto — la raíz del proyecto)
Install Command  : (vacío)
```

### 6.4 Variables de entorno

Este proyecto no usa variables de entorno.
Los únicos datos de contacto van directamente en el HTML:
```
WhatsApp : +51992551735  → URL: https://wa.me/51992551735
Email    : steffanomillones@gmail.com
```

### 6.5 Inspeccionar deployments (con MCP de Vercel)

Si el MCP está activo, Claude puede leer logs y estado del deployment.

Para activar el MCP en una sesión nueva:
```bash
claude mcp add --transport http vercel https://mcp.vercel.com
# Dentro de Claude Code: escribir /mcp para autenticar
```

### 6.6 Deploy de emergencia (sin push a GitHub)

Solo si el pipeline automático falla:
```bash
vercel --prod
```

---

## 7. Estrategia de branches

```
main    → producción  → https://landing-steffano.vercel.app
develop → preview     → URL temporal de Vercel por cada push
```

Claude trabaja en `develop` para iteraciones visuales.
Claude trabaja directo en `main` para fixes de copy o contenido menor.

Para promover `develop` a `main` (Steffano debe aprobar):
```bash
git checkout main
git merge develop --no-ff -m "merge: [descripción del release]"
```

---

## 8. Checklist antes de cada push

Claude verifica estos puntos antes de ejecutar el push.
Si algo falla, avisa a Steffano antes de continuar.

### Contenido
- [ ] Nombre correcto: **Steffano Millones**
- [ ] WhatsApp correcto: **+51992551735** → `https://wa.me/51992551735`
- [ ] Email correcto: **steffanomillones@gmail.com**
- [ ] Mensaje de WhatsApp URL-encoded y legible
- [ ] Los 3 servicios presentes: Dashboards, Automatizaciones, Agentes IA

### Código
- [ ] No hay `console.log()` sin comentar
- [ ] No hay código comentado innecesario que no deba estar
- [ ] Todas las imágenes tienen atributo `alt`
- [ ] Links externos tienen `target="_blank" rel="noopener noreferrer"`

### Performance
- [ ] Imágenes en formato WebP (no PNG/JPG sin optimizar)
- [ ] Animaciones usan `requestAnimationFrame` o CSS puro
- [ ] No hay librerías externas cargadas innecesariamente

### SEO y meta
- [ ] `<title>` definido y descriptivo
- [ ] `<meta name="description">` presente
- [ ] Open Graph tags: og:title, og:description, og:image, og:url
- [ ] `favicon.svg` existe en la raíz

### Visual
- [ ] La landing se ve correcta en 375px (iPhone) y 1280px (desktop)
- [ ] El botón CTA de WhatsApp es visible sin scroll en móvil
- [ ] Contraste de texto sobre fondo #070410 es legible

---

## 9. Respuestas rápidas reconocidas

| Steffano dice | Claude hace |
|---------------|-------------|
| `push` | `git push origin [branch actual]` |
| `ok push` / `dale` / `sube` / `deploy` | `git push origin [branch actual]` |
| `push a main` | `git push origin main` |
| `push a develop` | `git push origin develop` |
| `no` / `espera` / `para` | No pushea, espera instrucción |
| `corrígelo` / `ajústalo` / `arréglalo` | `git commit --amend` con la corrección |
| `descarta` / `undo` | `git reset --soft HEAD~1` (deshace commit, conserva cambios) |
| `rollback` | Indica cómo revertir desde Vercel Dashboard |

---

## 10. Archivos que NUNCA se tocan sin permiso explícito

```
.gitignore
vercel.json  (si existe)
```

---

## 11. Si el deploy falla en Vercel

Para HTML estático los deploys casi nunca fallan.
Si falla, las causas más comunes son:

1. **Ruta incorrecta** — imagen o CSS referenciado con ruta que no existe en el repo.
2. **Archivo faltante** — se subió el HTML pero no el CSS o JS asociado.
3. **Encoding en el HTML** — caracteres especiales sin escape correcto.

En cualquier caso:
1. Claude lee los logs del error (vía MCP o Steffano los pega en el chat).
2. Claude identifica el archivo y línea del problema.
3. Claude propone el fix con explicación.
4. Aplica solo con aprobación de Steffano.
5. Nuevo commit + push siguiendo el flujo auditado.

---

*Proyecto: landing-steffano — Steffano Millones*
