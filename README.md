# Censo Odontológico 10A

Sistema de caracterización del impacto y recuperación del sector odontológico
colombiano tras el sismo del 10 de agosto de 2026.

Iniciativa privada y gremial impulsada por **Vértice LATAM**. No es una entidad
gubernamental. No es un registro oficial de damnificados. No sustituye los
registros de la UNGRD, alcaldías, gobernaciones, el Ministerio de Salud u
otras entidades públicas competentes.

---

## 1. Estructura del proyecto

```
censo-odontologico-10a/
├── index.html
├── reportar-afectacion.html
├── necesito-ayuda.html
├── quiero-ayudar.html
├── sobre-el-proyecto.html
├── privacidad.html
├── css/
│   ├── reset.css          Reset mínimo
│   ├── styles.css         Sistema de diseño y estilos generales del sitio
│   └── forms.css          Estilos del motor de formularios paso a paso
├── js/
│   ├── catalogos.js        Única fuente de verdad de listas cerradas (frontend)
│   ├── app.js               Motor genérico de formularios (FormStepper) + menú móvil
│   ├── api.js                Comunicación con el backend de Apps Script
│   ├── formulario-afectacion.js   Lógica de "Reportar afectación"
│   ├── formulario-ayuda.js         Lógica de "Necesito ayuda"
│   └── formulario-oferta.js        Lógica de "Quiero ayudar"
├── apps-script/
│   ├── configuracion.gs   IDs de hojas y constantes (placeholders)
│   ├── catalogos.gs        Catálogos espejo, usados para validar
│   ├── validacion.gs       Validación y sanitización de cada formulario
│   └── Code.gs               Punto de entrada (doGet/doPost) y escritura en Sheets
├── assets/
│   ├── logo/
│   └── icons/
└── README.md
```

El frontend es HTML + CSS + JavaScript vanilla. No usa frameworks ni build
tools: se publica directamente como sitio estático.

---

## 2. Crear el Archivo A (datos operativos)

1. Crea una Google Sheet nueva y nómbrala, por ejemplo, `Censo 10A — Archivo A (datos)`.
2. No necesitas crear las pestañas a mano: `Code.gs` las crea automáticamente
   la primera vez que llega un envío (`Reportes`, `Necesidades`, `Ofertas`),
   con sus encabezados correctos.
3. Copia el ID de la hoja desde la URL:
   `https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit`

---

## 3. Crear el Archivo B (contactos — restringido)

1. Crea **otra** Google Sheet distinta, por ejemplo `Censo 10A — Archivo B (contactos)`.
2. Este archivo nunca debe compartirse con "cualquiera con el enlace". Compártelo
   solo con las 1–2 personas del equipo que deban tener acceso a datos de contacto.
3. Copia también su ID desde la URL.

**Regla de separación:** el Archivo A nunca contiene nombre, teléfono ni
correo — solo un `id_contacto` que apunta al Archivo B.

---

## 4. Configurar Google Apps Script

1. Abre [script.google.com](https://script.google.com) y crea un proyecto nuevo.
2. Crea 4 archivos de script con estos nombres exactos y pega el contenido
   correspondiente de la carpeta `apps-script/` de este proyecto:
   - `Code.gs`
   - `catalogos.gs`
   - `validacion.gs`
   - `configuracion.gs`
3. En `configuracion.gs`, reemplaza:
   ```js
   SHEET_ID_A: "REEMPLAZAR_CON_ID_ARCHIVO_A",
   SHEET_ID_B: "REEMPLAZAR_CON_ID_ARCHIVO_B",
   ```
   con los IDs reales que copiaste en los pasos 2 y 3.
4. (Opcional, recomendado en producción) En vez de escribir los IDs directamente
   en el código, puedes guardarlos en **Configuración del proyecto > Propiedades
   del script** y leerlos con `PropertiesService.getScriptProperties().getProperty("SHEET_ID_A")`.
   Esto evita que los IDs queden visibles si alguna vez compartes el código.
5. Guarda el proyecto (ícono de disco o Ctrl/Cmd+S).

---

## 5. Desplegar Apps Script como Web App

1. En el editor de Apps Script: **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Configuración:
   - **Ejecutar como:** Yo (tu cuenta de Google).
   - **Quién tiene acceso:** Cualquier usuario.
4. Haz clic en **Implementar** y autoriza los permisos solicitados (acceso a
   tus propias hojas de cálculo).
5. Copia la **URL de la aplicación web** que te entrega (termina en `/exec`).

> Cada vez que modifiques el código en `apps-script/`, debes crear una
> **nueva versión** de la implementación (Implementar → Gestionar implementaciones
> → editar → Versión: Nueva) para que los cambios se reflejen en la URL pública.

---

## 6. Conectar el frontend con el endpoint

Edita `js/api.js` y reemplaza:

```js
API_ENDPOINT: "REEMPLAZAR_CON_URL_DE_APPS_SCRIPT",
```

con la URL `.../exec` que copiaste en el paso anterior.

Mientras este valor no se reemplace, el sitio sigue funcionando en **modo
demo**: los formularios se completan y muestran un código de seguimiento
simulado, con un aviso visible de que el envío no llegó a ningún servidor.
Esto permite probar toda la experiencia de usuario antes de tener el backend
conectado.

---

## 7. Probar localmente

No necesitas un servidor especial: al ser HTML/CSS/JS puro, puedes:

- Abrir `index.html` directamente en el navegador, o
- Servir la carpeta con cualquier servidor estático simple, por ejemplo:
  ```
  npx serve .
  ```
  o
  ```
  python3 -m http.server 8080
  ```
  y visitar `http://localhost:8080`.

Prueba la navegación, los tres formularios completos (ver checklist de la
sección 11) y confirma que el modo demo genera códigos de seguimiento antes
de conectar Apps Script.

---

## 8. Subir a GitHub

```bash
cd censo-odontologico-10a
git init
git add .
git commit -m "MVP inicial del Censo Odontológico 10A"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/censo-odontologico-10a.git
git push -u origin main
```

**Antes del primer commit**, verifica que `js/api.js` no contenga tu URL real
de Apps Script si el repositorio va a ser público y prefieres no exponerla
(aunque el endpoint solo acepta escritura validada, es buena práctica no
publicarla innecesariamente). Si prefieres ocultarla, puedes:
- Dejar el placeholder en el repositorio, y
- Sobreescribir `js/api.js` únicamente en el entorno de Cloudflare Pages
  (fuera del control de versiones), o
- Usar una variable de entorno de build si más adelante agregas un paso de build.

Para el MVP más simple, es aceptable publicar la URL del endpoint: por diseño,
Apps Script solo permite **escritura validada contra catálogos cerrados**, no
lectura de datos.

---

## 9. Conectar GitHub con Cloudflare Pages

1. Entra a [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Crear → Pages → Conectar a Git**.
2. Selecciona el repositorio `censo-odontologico-10a`.
3. Configuración de build:
   - **Framework preset:** None
   - **Comando de build:** (dejar vacío)
   - **Directorio de salida (output):** `/` (raíz del repositorio)
4. Haz clic en **Guardar y desplegar**.
5. Cloudflare Pages te entrega una URL tipo `censo-odontologico-10a.pages.dev`.

Cada `git push` a la rama `main` vuelve a desplegar el sitio automáticamente.

---

## 10. Configurar el dominio (opcional)

1. En el proyecto de Cloudflare Pages: **Custom domains → Set up a custom domain**.
2. Escribe el dominio o subdominio (ej. `censo10a.tudominio.com`).
3. Si el dominio ya está en Cloudflare, el DNS se configura automáticamente;
   si no, sigue las instrucciones para apuntar un registro CNAME hacia tu
   proyecto de Pages.
4. Espera la validación del certificado SSL (automática, unos minutos).

---

## 11. PRUEBAS OBLIGATORIAS ANTES DE PUBLICAR

Ejecuta manualmente cada uno de estos casos, con Apps Script ya conectado
(no solo en modo demo), y confirma que la fila correcta aparece en el
Archivo A o B:

- [ ] **Persona sin afectación** — reporta solo persona, con capacidad de trabajo normal.
- [ ] **Persona afectada** — reporta persona con 1 o más tipos de afectación marcados.
- [ ] **Establecimiento sin daño** — reporta establecimiento, sin marcar "infraestructura" en "qué ocurrió".
- [ ] **Establecimiento afectado** — reporta establecimiento con varias categorías en "qué ocurrió" y verifica que aparezcan las preguntas condicionales correctas (infraestructura, equipos, inventario, operación).
- [ ] **Persona + establecimiento** — selecciona "Ambas" y confirma que se muestran ambos bloques de preguntas en la secuencia correcta.
- [ ] **Necesidad de ayuda** — completa "Necesito ayuda" de forma independiente (sin código de reporte previo) y confirma que exige nombre y contacto.
- [ ] **Oferta de ayuda** — completa "Quiero ayudar" y confirma que exige nombre/organización y contacto.
- [ ] **Error de validación** — intenta avanzar sin responder un paso obligatorio y confirma que se muestra el mensaje de error sin perder las respuestas ya dadas.
- [ ] **Envío sin consentimiento** — intenta enviar con el checkbox de consentimiento sin marcar y confirma que el envío se bloquea.
- [ ] **Generación de código** — confirma que cada envío exitoso muestra un código de seguimiento único con el formato esperado (`10A-XXXXX`, `10A-N-XXXXX`, `10A-O-XXXXX`).
- [ ] **Separación de contacto** — después de un envío con nombre/contacto, confirma en las hojas que el Archivo A **no** contiene nombre ni teléfono/correo, y que el Archivo B sí los tiene, vinculados por `id_contacto`.
- [ ] **Fallo temporal de API** — con el endpoint apuntando temporalmente a una URL inválida, confirma que el frontend muestra el mensaje de error de conexión y permite reintentar sin perder las respuestas.

---

## Qué falta a propósito (fuera de este MVP)

Por diseño, esta versión **no incluye**: mapa interactivo, dashboard público,
autenticación de usuarios, perfiles, matching automático, verificación de
daños ni carga de documentos. Esas piezas se construyen en etapas
posteriores, una vez el MVP esté validado con datos reales.
