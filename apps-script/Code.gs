/**
 * Baby Shower de Franco — backend de la lista de regalos (VERSIÓN 2)
 * ------------------------------------------------------------------
 * Novedad: cada regalo tiene una CANTIDAD (cupos). Los pañales, por ejemplo,
 * pueden separarse varias veces hasta llenar sus cupos.
 *
 * Hoja "LISTA DE REGALOS":  ID | REGALO | CATEGORÍA | CANTIDAD | SEPARADOS | ESTADO
 * Hoja "SEPARACIONES" (registro): FECHA | ID | REGALO | NOMBRE | APELLIDO
 *
 * CÓMO ACTUALIZAR desde la versión anterior (ver INSTRUCCIONES.md):
 *  1. Pega este código reemplazando todo lo anterior y guarda.
 *  2. Ejecuta una vez `configurarHoja` (conserva las separaciones con nombre).
 *  3. Implementar → Administrar implementaciones → ✏️ → Versión: Nueva versión
 *     → Implementar. (NO crees una implementación nueva: así la URL no cambia.)
 */

const NOMBRE_HOJA = "LISTA DE REGALOS";
const NOMBRE_LOG  = "SEPARACIONES";

// [id, nombre, categoría, cantidad, separadosIniciales] — igual que en index.html
const REGALOS_INICIALES = [
  [1,  "SET BIBERONES",                                        "Alimentación", 1,  0],
  [2,  "SILLA DE COMER BEBE ESCRITORIO 3 EN 1 PRIORI",         "Alimentación", 1,  0],
  [3,  "TERMO CARESTINO 1200 ML FRIO/CALOR",                   "Alimentación", 1,  0],
  [4,  "BIBERON DE VIDRIO",                                    "Alimentación", 1,  0],
  [5,  "CHUPON AVENT",                                         "Alimentación", 1,  0],
  [6,  "PACK CUIDADO EUCERIN",                                 "Aseo",         1,  0],
  [7,  "BODY LOTION ISDIN",                                    "Aseo",         1,  0],
  [8,  "REDUCTOR DE INODORO CON ESCALERA",                     "Aseo",         1,  0],
  [9,  "CAMA MONTESSORI",                                      "Cuarto",       1,  0],
  [10, "CUNA CORRAL",                                          "Cuarto",       1,  1],
  [11, "COLCHON PARA CUNA CORRAL",                             "Cuarto",       1,  1],
  [12, "EDREDON PARA CUNA CORRAL",                             "Cuarto",       1,  0],
  [13, "ESCALERA INFANTIL MULTIFUNCION",                       "Cuarto",       1,  0],
  [14, "MECEDORA ELECTRICA DE BEBE",                           "Cuarto",       1,  1],
  [15, "CREMA LANOLINA 40GR LANSINOH",                         "Cuidado",      2,  0],
  [16, "COCHE DE PASEO",                                       "Paseo",        1,  1],
  [17, "CANGURO PORTA BEBE",                                   "Paseo",        1,  0],
  [18, "COMBO MOSQUITERO CON COBERTOR DE LLUVIA CARESTINO",    "Paseo",        1,  0],
  [19, "SILLA DE AUTO MONZA",                                  "Paseo",        1,  0],
  [20, "BATA OSO 2-4 AÑOS",                                    "Ropa",         1,  0],
  [21, "ESTERILIZADOR DE BIBERONES",                           "Alimentación", 1,  0],
  [22, "COJIN DE LACTANCIA",                                   "Alimentación", 1,  0],
  [23, "MEDIA DE CONTROL DE MONITOREO DE FRECUENCIA CARDIACA", "Cuidado",      1,  0],
  [24, "KIT DE MANICURA",                                      "Cuidado",      1,  1],
  [25, "BAÑERA CON CAMBIADOR PLEGABLE",                        "Aseo",         1,  0],
  [26, "EXTRACTOR DE LECHE ELECTRICO",                         "Mamá",         1,  0],
  [27, "HUMIDIFICADOR SMART",                                  "Cuarto",       1,  0],
  [28, "CAMARA C500 DUAL XIAOMI",                              "Cuarto",       1,  0],
  [29, "GIMNASIO DIDACTICO CARESTINO",                         "Cuarto",       1,  0],
  [30, "BOLSA DE DORMIR OSITO",                                "Cuarto",       1,  0],
  [31, "SABANAS PARA CUNA",                                    "Cuarto",       2,  0],
  [32, "PROTECTOR IMPERMEABLE PARA COLCHON",                   "Cuarto",       1,  0],
  [33, "MANTA SHERPA",                                         "Cuarto",       1,  0],
  [34, "SET DE ALIMENTACION DE SILICONA",                      "Alimentación", 1,  0],
  [35, "PAÑALES HUGGIES NATURAL CARE TALLA P",                 "Cuidado",      4,  0],
  [36, "PAÑALES HUGGIES NATURAL CARE TALLA M",                 "Cuidado",      10, 0],
  [37, "PAÑALES HUGGIES NATURAL CARE TALLA G",                 "Cuidado",      8,  0],
];

/**
 * Ejecutar UNA vez desde el editor (▶). Reconstruye la hoja con el formato
 * nuevo. Si existe la versión anterior, conserva las separaciones hechas por
 * invitados (las filas que tenían nombre y apellido), emparejándolas por
 * nombre del regalo.
 */
function configurarHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();

  // 1) Rescatar separaciones con nombre de la hoja anterior (si la hay)
  const previas = [];
  const hojaVieja = libro.getSheetByName(NOMBRE_HOJA);
  if (hojaVieja && hojaVieja.getLastRow() > 1) {
    const cab = hojaVieja.getRange(1, 1, 1, hojaVieja.getLastColumn()).getValues()[0].map(String);
    // formato v1: ID | REGALO | CATEGORÍA | ESTADO | NOMBRE | APELLIDO | FECHA
    if (cab[3] && cab[3].toUpperCase().indexOf("ESTADO") === 0) {
      const filas = hojaVieja.getRange(2, 1, hojaVieja.getLastRow() - 1, 7).getValues();
      filas.forEach(function (f) {
        if (String(f[3]).trim().toUpperCase() === "SEPARADO" && String(f[4]).trim()) {
          previas.push({ regalo: normalizar(f[1]), nombre: f[4], apellido: f[5], fecha: f[6] || new Date() });
        }
      });
    }
  }

  // 2) Reconstruir la hoja principal
  let hoja = hojaVieja || libro.insertSheet(NOMBRE_HOJA);
  hoja.clear();
  hoja.getRange(1, 1, 1, 6).setValues([[
    "ID", "REGALO", "CATEGORÍA", "CANTIDAD", "SEPARADOS", "ESTADO"
  ]]).setFontWeight("bold").setBackground("#1b2a44").setFontColor("#ffffff");
  const filas = REGALOS_INICIALES.map(function (r) {
    return [r[0], r[1], r[2], r[3], r[4], r[4] >= r[3] ? "SEPARADO" : "DISPONIBLE"];
  });
  hoja.getRange(2, 1, filas.length, 6).setValues(filas);
  hoja.setFrozenRows(1);
  hoja.autoResizeColumns(1, 6);

  // 3) Hoja de registro (quién separó qué; solo la ven ustedes)
  let log = libro.getSheetByName(NOMBRE_LOG);
  if (!log) {
    log = libro.insertSheet(NOMBRE_LOG);
    log.getRange(1, 1, 1, 5).setValues([["FECHA", "ID", "REGALO", "NOMBRE", "APELLIDO"]])
       .setFontWeight("bold").setBackground("#1e3b2c").setFontColor("#ffffff");
    log.setFrozenRows(1);
  }

  // 4) Reaplicar separaciones de invitados rescatadas de la versión anterior
  previas.forEach(function (p) {
    for (let i = 0; i < REGALOS_INICIALES.length; i++) {
      if (normalizar(REGALOS_INICIALES[i][1]) === p.regalo) {
        const fila = i + 2;
        const cant = Number(hoja.getRange(fila, 4).getValue());
        const sep = Number(hoja.getRange(fila, 5).getValue());
        if (sep < cant) {
          hoja.getRange(fila, 5, 1, 2).setValues([[sep + 1, (sep + 1 >= cant) ? "SEPARADO" : "DISPONIBLE"]]);
          log.appendRow([p.fecha, REGALOS_INICIALES[i][0], REGALOS_INICIALES[i][1], p.nombre, p.apellido]);
        }
        break;
      }
    }
  });
}

function normalizar(s) {
  return String(s).trim().toUpperCase()
    .replace(/[ÁÀÄÂ]/g, "A").replace(/[ÉÈËÊ]/g, "E").replace(/[ÍÌÏÎ]/g, "I")
    .replace(/[ÓÒÖÔ]/g, "O").replace(/[ÚÙÜÛ]/g, "U").replace(/\s+/g, " ");
}

/** GET — {ok:true, v:2, estados:{id:{s:separados, t:cupos}}} */
function doGet() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
  const salida = { ok: false, v: 2, estados: {} };
  if (hoja && hoja.getLastRow() > 1) {
    const datos = hoja.getRange(2, 1, hoja.getLastRow() - 1, 5).getValues();
    datos.forEach(function (f) {
      if (f[0]) salida.estados[String(f[0])] = { s: Number(f[4]) || 0, t: Number(f[3]) || 1 };
    });
    salida.ok = true;
  }
  return respuestaJson(salida);
}

/** POST — body JSON: {accion:"separar", v:2, id, nombre, apellido} */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // evita que dos invitados tomen el mismo cupo a la vez
  try {
    let cuerpo = {};
    try { cuerpo = JSON.parse(e.postData.contents); } catch (err) {}
    if (cuerpo.accion !== "separar" || !cuerpo.id || !cuerpo.nombre || !cuerpo.apellido) {
      return respuestaJson({ ok: false, motivo: "datos_invalidos" });
    }

    const libro = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = libro.getSheetByName(NOMBRE_HOJA);
    if (!hoja || hoja.getLastRow() < 2) return respuestaJson({ ok: false, motivo: "sin_hoja" });

    const datos = hoja.getRange(2, 1, hoja.getLastRow() - 1, 5).getValues();
    for (let i = 0; i < datos.length; i++) {
      if (Number(datos[i][0]) === Number(cuerpo.id)) {
        const fila = i + 2;
        const cupos = Number(datos[i][3]) || 1;
        const sep = Number(datos[i][4]) || 0;
        if (sep >= cupos) {
          return respuestaJson({ ok: false, motivo: "ya_separado" });
        }
        hoja.getRange(fila, 5, 1, 2).setValues([[sep + 1, (sep + 1 >= cupos) ? "SEPARADO" : "DISPONIBLE"]]);

        let log = libro.getSheetByName(NOMBRE_LOG);
        if (!log) {
          log = libro.insertSheet(NOMBRE_LOG);
          log.getRange(1, 1, 1, 5).setValues([["FECHA", "ID", "REGALO", "NOMBRE", "APELLIDO"]]);
        }
        log.appendRow([new Date(), Number(cuerpo.id), datos[i][1],
                       String(cuerpo.nombre).trim(), String(cuerpo.apellido).trim()]);

        return respuestaJson({ ok: true, s: sep + 1, t: cupos });
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
