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
| WhatsApp de confirmación de asistencia | `const WA_CONFIRMACION = "51950012550";` |
| WhatsApp de respaldo para regalos | `const WA_REGALOS = "51991006480";` |
| Dirección del botón «Cómo llegar» | `const DIRECCION = "..."` |
| Punto del osito en el mapa | `const COORDS = [lat, lng]` (clic derecho en Google Maps → copiar coordenadas) |
| Fecha para la cuenta regresiva | `new Date(2026, 7, 22)` (se recalcula sola al abrir la página) |
| Regalos | ⚠️ Ya NO se editan aquí: se editan en la **hoja de Google** (ver sección 5). La lista `const REGALOS` del archivo es solo un respaldo si no hay conexión |

## 5 · Actualizar el Apps Script a la VERSIÓN 3 (Drive = fuente única) ⭐

Con la versión 3 la hoja de Google pasa a ser la ÚNICA fuente de la lista:
la página descarga desde Drive los nombres, categorías, links de compra y
cupos — al abrirla, cada minuto y al volver a la pestaña. Editas la hoja y
la página se actualiza sola, sin tocar `index.html` ni subir nada a GitHub.

1. Abre tu hoja de Google → **Extensiones → Apps Script**.
2. Reemplaza TODO el código por el `apps-script/Code.gs` nuevo y guarda (💾).
3. Ejecuta una vez **`configurarHoja`** (▶). Reconstruye LISTA DE REGALOS con
   la columna nueva **LINK** y los ítems actualizados del Excel, **conserva
   todas las separaciones ya hechas** (empareja por nombre del regalo) y
   **NO toca la hoja SEPARACIONES** (el registro de quién separó qué sigue intacto).
4. **Implementar → Administrar implementaciones → ✏️ Editar → Versión: "Nueva
   versión" → Implementar**. ⚠️ NO uses "Nueva implementación": editando la
   existente, la URL `/exec` no cambia y la página sigue conectada sola.

Mientras no hagas estos pasos no se pierde nada: la página detecta que el
backend sigue en versión 2, sincroniza solo los cupos y usa su lista local.

### Cómo editar la lista desde Drive (después de la versión 3)

En la hoja **LISTA DE REGALOS**:

| Quiero… | Hago… |
|---|---|
| Cambiar nombre, categoría, link o cupos | Edito la celda y listo |
| Agregar un regalo | Nueva fila con el siguiente ID libre |
| Quitar un regalo | Elimino la fila |
| Marcar separado a mano | Subo el número en SEPARADOS |

Los cambios aparecen en la página en ~1 minuto (o al recargarla).
La hoja **SEPARACIONES** es solo el registro privado de quién separó qué.

## 6 · Novedades de la lista (Bebé Oso.xlsx · 9-jul-2026)

Ítems nuevos: colchón para cama Montessori 1.5 plz, funda de colchón
impermeable, aspirador nasal Momcozy, pack toallas húmedas + Cicaplast (×3),
extractor manual de leche, toallas húmedas (×10), mochila pañalera, cooler
bag de lactancia y extractor nasal. La cama Montessori ahora tiene link y el
protector impermeable pasó a ×2 (fila duplicada en el Excel).

> 📝 OJO: el Excel trae «ASPIRADOR NASAL MOMCOZY» y «EXTRACTOR NASAL» con el
> MISMO link (son el mismo producto). Se incluyeron ambos por fidelidad al
> Excel; si sobra uno, elimina su fila en la hoja de Google y desaparecerá
> de la página solo.
