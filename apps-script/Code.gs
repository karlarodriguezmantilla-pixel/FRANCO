/**
 * Baby Shower de Franco — backend de la lista de regalos
 * ------------------------------------------------------
 * Este script se pega en un proyecto de Google Apps Script vinculado
 * a una hoja de cálculo de Google. Expone:
 *   GET  → estados de todos los regalos (para pintar la página)
 *   POST → separar un regalo (guarda nombre y apellido, solo visibles en la hoja)
 *
 * Ver INSTRUCCIONES.md para los pasos de instalación.
 */

const NOMBRE_HOJA = "LISTA DE REGALOS";

// Los mismos regalos que en index.html (id, nombre, categoría, estado inicial)
const REGALOS_INICIALES = [
  [1,  "Set de biberones Avent Natural 3.0",              "Alimentación", "DISPONIBLE"],
  [2,  "Silla de comer escritorio 3 en 1 Tango · Priori", "Alimentación", "DISPONIBLE"],
  [3,  "Termo Carestino 1200 ml frío/calor",              "Alimentación", "DISPONIBLE"],
  [4,  "Biberón de vidrio Avent Natural 3.0 · 240 ml",    "Alimentación", "DISPONIBLE"],
  [5,  "Biberón Avent recién nacido x2 · 125 ml",         "Alimentación", "DISPONIBLE"],
  [6,  "Chupón Avent 0-6m ultra aireado x2 + estuche",    "Alimentación", "DISPONIBLE"],
  [7,  "Pack cuidado para bebé Eucerin",                  "Aseo",         "DISPONIBLE"],
  [8,  "Champú y gel de baño Eucerin Baby · 400 ml",      "Aseo",         "DISPONIBLE"],
  [9,  "Loción corporal ISDIN Babynaturals · 400 ml",     "Aseo",         "DISPONIBLE"],
  [10, "Reductor de inodoro con escalera Pekin V2",       "Aseo",         "DISPONIBLE"],
  [11, "Cama Montessori",                                 "Cuarto",       "DISPONIBLE"],
  [12, "Cuna corral",                                     "Cuarto",       "SEPARADO"],
  [13, "Colchón para cuna corral",                        "Cuarto",       "SEPARADO"],
  [14, "Edredón para cuna corral",                        "Cuarto",       "DISPONIBLE"],
  [15, "Escalera infantil multifunción",                  "Cuarto",       "DISPONIBLE"],
  [16, "Mecedora eléctrica de bebé",                      "Cuarto",       "SEPARADO"],
  [17, "Crema de lanolina Lansinoh · 40 g",               "Cuidado",      "DISPONIBLE"],
  [18, "Coche de paseo",                                  "Paseo",        "SEPARADO"],
  [19, "Canguro porta bebé",                              "Paseo",        "DISPONIBLE"],
  [20, "Carrito de paseo Trop",                           "Paseo",        "DISPONIBLE"],
  [21, "Combo mosquitero + cobertor de lluvia",           "Paseo",        "DISPONIBLE"],
  [22, "Silla de auto Booster Monza",                     "Paseo",        "DISPONIBLE"],
  [23, "Bata de oso 2-4 años",                            "Ropa",         "DISPONIBLE"],
  [24, "Esterilizador de biberones",                      "Alimentación", "DISPONIBLE"],
  [25, "Cojín de lactancia",                              "Alimentación", "DISPONIBLE"],
  [26, "Media monitor de frecuencia cardiaca Sense-U",    "Cuidado",      "DISPONIBLE"],
  [27, "Bañera con cambiador plegable",                   "Aseo",         "DISPONIBLE"],
  [28, "Extractor de leche eléctrico",                    "Mamá",         "DISPONIBLE"],
  [29, "Humidificador smart Xiaomi",                      "Cuarto",       "DISPONIBLE"],
  [30, "Cámara Xiaomi C500 Dual",                         "Cuarto",       "DISPONIBLE"],
  [31, "Almohada de lactancia",                           "Alimentación", "DISPONIBLE"],
  [32, "Gimnasio didáctico Carestino",                    "Cuarto",       "DISPONIBLE"],
  [33, "Bolsa de dormir de osito",                        "Cuarto",       "DISPONIBLE"],
  [34, "Sábanas para cuna 300 hilos",                     "Cuarto",       "DISPONIBLE"],
  [35, "Protector impermeable para colchón",              "Cuarto",       "DISPONIBLE"],
];

/**
 * PASO 1 — Ejecutar UNA sola vez desde el editor (▶ Ejecutar).
 * Crea la hoja "LISTA DE REGALOS" con todos los regalos.
 */
function configurarHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) hoja = libro.insertSheet(NOMBRE_HOJA);
  hoja.clear();
  hoja.getRange(1, 1, 1, 7).setValues([[
    "ID", "REGALO", "CATEGORÍA", "ESTADO", "SEPARADO POR (NOMBRE)", "SEPARADO POR (APELLIDO)", "FECHA"
  ]]).setFontWeight("bold").setBackground("#1b2a44").setFontColor("#ffffff");
  const filas = REGALOS_INICIALES.map(r => [r[0], r[1], r[2], r[3], "", "", ""]);
  hoja.getRange(2, 1, filas.length, 7).setValues(filas);
  hoja.setFrozenRows(1);
  hoja.autoResizeColumns(1, 7);
}

/** GET — devuelve {ok:true, estados:{id: "DISPONIBLE"|"SEPARADO"}} */
function doGet() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
  const salida = { ok: false, estados: {} };
  if (hoja && hoja.getLastRow() > 1) {
    const datos = hoja.getRange(2, 1, hoja.getLastRow() - 1, 4).getValues();
    datos.forEach(f => { if (f[0]) salida.estados[String(f[0])] = String(f[3]).trim().toUpperCase(); });
    salida.ok = true;
  }
  return respuestaJson(salida);
}

/** POST — body JSON: {accion:"separar", id, nombre, apellido} */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // evita que dos invitados separen lo mismo a la vez
  try {
    let cuerpo = {};
    try { cuerpo = JSON.parse(e.postData.contents); } catch (err) {}
    if (cuerpo.accion !== "separar" || !cuerpo.id || !cuerpo.nombre || !cuerpo.apellido) {
      return respuestaJson({ ok: false, motivo: "datos_invalidos" });
    }

    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
    if (!hoja || hoja.getLastRow() < 2) return respuestaJson({ ok: false, motivo: "sin_hoja" });

    const datos = hoja.getRange(2, 1, hoja.getLastRow() - 1, 4).getValues();
    for (let i = 0; i < datos.length; i++) {
      if (Number(datos[i][0]) === Number(cuerpo.id)) {
        const fila = i + 2;
        const estado = String(datos[i][3]).trim().toUpperCase();
        if (estado === "SEPARADO") {
          return respuestaJson({ ok: false, motivo: "ya_separado" });
        }
        hoja.getRange(fila, 4, 1, 4).setValues([[
          "SEPARADO",
          String(cuerpo.nombre).trim(),
          String(cuerpo.apellido).trim(),
          new Date()
        ]]);
        return respuestaJson({ ok: true });
      }
    }
    return respuestaJson({ ok: false, motivo: "no_encontrado" });
  } finally {
    lock.releaseLock();
  }
}

function respuestaJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
