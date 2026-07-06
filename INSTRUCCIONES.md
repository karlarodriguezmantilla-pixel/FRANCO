# 🧸 Invitación web — Baby Shower de Franco

Página web para celulares con la invitación, el mapa, el dress code, la mesa de
regalos y la confirmación por WhatsApp.

## Qué contiene

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La invitación completa (una sola página) |
| `assets/tartan.png`, `assets/oso.png` | Imágenes sacadas de tu PowerPoint |
| `apps-script/Code.gs` | Código para que los regalos se separen "en vivo" (opcional) |

## 1 · Ver la invitación en tu compu

Haz doble clic en `index.html`. Se abre en el navegador; achica la ventana o usa
las herramientas de desarrollador (F12 → icono de celular) para verla como en un teléfono.

## 2 · Publicarla en internet (GitHub Pages, gratis)

Tu proyecto ya está conectado a GitHub (`karlarodriguezmantilla-pixel/FRANCO`).

1. Sube los archivos (pídemelo y lo hago por ti, o ejecuta):
   ```
   git add index.html assets INSTRUCCIONES.md apps-script
   git commit -m "Invitación web del baby shower"
   git push
   ```
2. Entra a `github.com/karlarodriguezmantilla-pixel/FRANCO` → **Settings** → **Pages**.
3. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
4. En 1–2 minutos tu invitación quedará en:
   **`https://karlarodriguezmantilla-pixel.github.io/FRANCO/`**
5. Ese es el enlace que envías a tus invitados por WhatsApp. 🎉

> ⚠️ El repositorio debe ser **público** para que GitHub Pages gratis funcione.
> Nota: la carpeta tiene otros archivos personales (tesis, etc.). Si el repo va a ser
> público, conviene mover la invitación a un repo propio o revisar el `.gitignore`
> para no subir nada que no quieras compartir.

## 3 · Separación de regalos

### Cómo funciona HOY (sin configurar nada)

El invitado elige un regalo, escribe su nombre y apellido, y se abre WhatsApp
con un mensaje listo para enviarte ("Quiero separar: 🎁 …"). Tú recibes el mensaje
y marcas el regalo como separado editando una línea en `index.html`
(cambia `e:"DISPONIBLE"` por `e:"SEPARADO"` en ese regalo y vuelve a subir el archivo).

### Cómo activar el modo "en vivo" (opcional, recomendado)

Con esto los regalos se marcan **SEPARADO automáticamente** para todos, sin mostrar
quién lo separó (los nombres solo los ves tú en una hoja de Google):

1. Entra a [sheets.new](https://sheets.new) con tu cuenta de Google y crea una
   hoja de cálculo nueva (nómbrala por ejemplo "Regalos Franco").
2. Menú **Extensiones → Apps Script**. Borra lo que aparezca y pega TODO el
   contenido de `apps-script/Code.gs`. Guarda (💾).
3. En la barra superior elige la función **`configurarHoja`** y presiona **▶ Ejecutar**.
   Autoriza los permisos (es tu propio script). Verás que la hoja se llena con los regalos.
4. Botón azul **Implementar → Nueva implementación**:
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
   - **Implementar** y copia la URL que te da (termina en `/exec`).
5. Abre `index.html`, busca la línea:
   ```js
   const API_URL = "";
   ```
   y pega la URL dentro de las comillas:
   ```js
   const API_URL = "https://script.google.com/macros/s/XXXXX/exec";
   ```
6. Sube el cambio a GitHub (paso 2.1). ¡Listo! Ahora:
   - La página muestra el estado real de cada regalo.
   - Al separar uno, queda **SEPARADO** para todos al instante.
   - El nombre y apellido de quien lo separó solo aparecen en TU hoja de Google.
   - Si dos personas intentan separar lo mismo, solo la primera lo consigue.

## 4 · Datos que puedes cambiar fácil (en `index.html`)

| Qué | Dónde |
|---|---|
| Número de WhatsApp | `const WA_NUMERO = "51950284762";` |
| Dirección del mapa | `const DIRECCION = "..."` (actualiza el mapa incrustado y el botón «Cómo llegar» a la vez) |
| Fecha para la cuenta regresiva | `new Date("2026-08-22T16:00:00-05:00")` |
| Regalos (agregar/quitar/marcar) | La lista `const REGALOS = [...]` |

Los regalos y sus enlaces de compra salieron de tu Excel
(`Bebé Oso.xlsx`, hoja **LISTA DE REGALOS**), incluyendo los 4 que ya estaban
separados: cuna corral, colchón, mecedora y coche de paseo.
