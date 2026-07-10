/**
 * Baby Shower de Franco — backend de la lista de regalos (VERSIÓN 3)
 * ------------------------------------------------------------------
 * Novedad: la hoja de Google es la FUENTE ÚNICA de la lista. La página ya no
 * usa su copia local salvo como respaldo sin conexión: nombres, categorías,
 * links de compra y cupos se leen de aquí. Edita la hoja y la página se
 * actualiza sola (al abrirla, cada minuto y al volver a la pestaña).
 *
 * Hoja "LISTA DE REGALOS":  ID | REGALO | CATEGORÍA | LINK | CANTIDAD | SEPARADOS | ESTADO
 * Hoja "SEPARACIONES" (registro, no se toca): FECHA | ID | REGALO | NOMBRE | APELLIDO
 *
 * CÓMO ACTUALIZAR desde la versión anterior (ver INSTRUCCIONES.md):
 *  1. Pega este código reemplazando todo lo anterior y guarda.
 *  2. Ejecuta una vez `configurarHoja` (conserva las separaciones existentes
 *     y NO borra la hoja SEPARACIONES).
 *  3. Implementar → Administrar implementaciones → ✏️ → Versión: Nueva versión
 *     → Implementar. (NO crees una implementación nueva: así la URL no cambia.)
 *
 * Para editar regalos DESPUÉS de configurar: hazlo directo en la hoja.
 *  - Cambiar nombre, categoría, link o cantidad: edita la celda.
 *  - Agregar un regalo: nueva fila con el siguiente ID libre.
 *  - Quitar un regalo: elimina la fila.
 */

const NOMBRE_HOJA = "LISTA DE REGALOS";
const NOMBRE_LOG  = "SEPARACIONES";

// [id, nombre, categoría, link, cantidad, separadosIniciales]
// Mismo orden que el Excel «Bebé Oso.xlsx · LISTA DE REGALOS» (9-jul-2026).
const REGALOS_INICIALES = [
  [1,  "SET BIBERONES",                                        "Alimentación", "https://www.falabella.com.pe/falabella-pe/product/21090137/set-natural-3-0-biberon-125ml-biberon-260ml-afv125ml-afv260ml-cepillo-chupon/21090137", 1,  1],
  [2,  "SILLA DE COMER BEBE ESCRITORIO 3 EN 1 PRIORI",         "Alimentación", "https://www.falabella.com.pe/falabella-pe/product/883501696/silla-de-comer-bebe-escritorio-3-en-1-tango-priori/883501698", 1,  1],
  [3,  "TERMO CARESTINO 1200 ML FRIO/CALOR",                   "Alimentación", "https://www.carestino.com.pe/producto/termo-carestino-1200ml-frio-calor-blanco/", 1,  0],
  [4,  "BIBERON DE VIDRIO",                                    "Alimentación", "https://infanti.com.pe/products/biberon-natural-response-3-0-125ml-flow-2-0m?variant=48241124278572", 1,  1],
  [5,  "CHUPON AVENT",                                         "Alimentación", "https://www.falabella.com.pe/falabella-pe/product/149467547/chupon-avent-0-6m-ultra-aereado-x-2-uni-estuche-nino/149467548", 1,  0],
  [6,  "PACK CUIDADO EUCERIN",                                 "Aseo",         "https://www.falabella.com.pe/falabella-pe/product/prod17470139/Pack-Cuidado-para-Bebe-Eucerin/sku17830007", 1,  1],
  [7,  "BODY LOTION ISDIN",                                    "Aseo",         "https://www.falabella.com.pe/falabella-pe/product/18135675/isdin-babynaturals-body-lotion-400ml-locion-corporal-hidratante-para-la-piel-del-bebe/18135675", 1,  1],
  [8,  "REDUCTOR DE INODORO CON ESCALERA",                     "Aseo",         "https://www.carestino.com.pe/producto/reductor-de-inodoro-con-escalera-pekin-v2-gris/", 1,  0],
  [9,  "CAMA MONTESSORI",                                      "Cuarto",       "https://www.falabella.com.pe/falabella-pe/product/142638094/CAMA-MONTESSORI-EVOLUTIVA-DESARMABLE-1.5-PLZ/142638095", 1,  0],
  [38, "COLCHON PARA CAMA MONTESSORI 1.5 PLAZAS",              "Cuarto",       "https://www.falabella.com.pe/falabella-pe/product/13892160/colchon-royal-prince-firme-1-5-plz-1-almohada-protector/13892160", 1,  0],
  [39, "FUNDA DE COLCHON IMPERMEABLE 1.5 PLAZAS",              "Cuarto",       "https://www.falabella.com.pe/falabella-pe/product/145935110/Funda-De-Colchon-Impermeable-Hypno-de-Bambu-Con-Cierre-Bl/145935118", 1,  0],
  [10, "CUNA CORRAL",                                          "Cuarto",       "", 1,  1],
  [11, "COLCHON PARA CUNA CORRAL",                             "Cuarto",       "", 1,  1],
  [12, "EDREDON PARA CUNA CORRAL",                             "Cuarto",       "https://www.carestino.com.pe/producto/edredon-para-cuna-corral-de-70x104cm-blanco/", 1,  0],
  [40, "ASPIRADOR NASAL MOMCOZY",                              "Cuarto",       "https://www.falabella.com.pe/falabella-pe/product/80070854/aspirador-nasal-electrico-momcozy/80070854", 1,  0],
  [13, "ESCALERA INFANTIL MULTIFUNCION",                       "Cuarto",       "https://www.carestino.com.pe/producto/escalera-infantil-multifuncion-daily-v2-gris/", 1,  0],
  [14, "MECEDORA ELECTRICA DE BEBE",                           "Cuarto",       "", 1,  1],
  [15, "CREMA LANOLINA 40GR LANSINOH",                         "Cuidado",      "https://www.falabella.com.pe/falabella-pe/product/120796092/Crema-Lanolina-40gr-Lansinoh/120796094", 2,  0],
  [16, "COCHE DE PASEO",                                       "Paseo",        "", 1,  1],
  [17, "CANGURO PORTA BEBE",                                   "Paseo",        "https://www.carestino.com.pe/producto/canguro-porta-bebe-basic-grafito/", 1,  0],
  [18, "COMBO MOSQUITERO CON COBERTOR DE LLUVIA CARESTINO",    "Paseo",        "https://www.carestino.com.pe/producto/combo-mosquitero-cobertor-de-lluvia/", 1,  0],
  [19, "SILLA DE AUTO MONZA",                                  "Paseo",        "https://www.carestino.com.pe/producto/silla-de-auto-booster-monza-negro/", 1,  0],
  [20, "BATA OSO 2-4 AÑOS",                                    "Ropa",         "https://www.carestino.com.pe/producto/bata-oso-2-4-anios-gris/", 1,  0],
  [21, "ESTERILIZADOR DE BIBERONES",                           "Alimentación", "https://www.falabella.com.pe/falabella-pe/product/126491583/CALENTADOR-DE-BIBERONES-4-EN-1-PREMIUM-Y-ESTERILIZADOR/126491586", 1,  0],
  [22, "COJIN DE LACTANCIA",                                   "Alimentación", "https://www.falabella.com.pe/falabella-pe/product/128116235/Cojin-de-Lactancia-Con-Funda-Premium-Grafito/128116236", 1,  1],
  [23, "MEDIA DE CONTROL DE MONITOREO DE FRECUENCIA CARDIACA", "Cuidado",      "https://shop.sense-u.com/en-saf/products/sense-u-smart-sock-shoe", 1,  0],
  [24, "KIT DE MANICURA",                                      "Cuidado",      "", 1,  1],
  [25, "BAÑERA CON CAMBIADOR PLEGABLE",                        "Aseo",         "https://www.falabella.com.pe/falabella-pe/product/140682567/Banera-Cambiador-y-Organizador-Desmontable-con-Drenaje-Spark/140682568", 1,  1],
  [26, "EXTRACTOR DE LECHE ELECTRICO",                         "Mamá",         "https://www.falabella.com.pe/falabella-pe/product/20704098/extractor-portatil-m9-doble-succion/20704098", 1,  0],
  [27, "HUMIDIFICADOR SMART",                                  "Cuarto",       "https://www.falabella.com.pe/falabella-pe/product/154851043/humidificador-xiaomi-smart-humidifier-2-uv-c-4-5l-350ml-h-32db-difusor-aromas-wifi-mi-home/154851044", 1,  0],
  [28, "CAMARA C500 DUAL XIAOMI",                              "Cuarto",       "https://www.falabella.com.pe/falabella-pe/product/148950136/camara-xiaomi-c500-dual-4mp-2lentes-deteccion-ia-llanto-bebe-audio-bidireccional/148950137", 1,  1],
  [29, "GIMNASIO DIDACTICO CARESTINO",                         "Cuarto",       "https://www.carestino.com.pe/producto/gimnasio-didactico-carestino-gatito/", 1,  0],
  [30, "BOLSA DE DORMIR OSITO",                                "Cuarto",       "https://www.sodimac.com.pe/sodimac-pe/articulo/147116907/Bolsa-de-Dormir-Osito-de-Felpa-Gris-para-Bebe/147116908", 1,  0],
  [31, "SABANAS PARA CUNA",                                    "Cuarto",       "https://www.carestino.com.pe/producto/sabanas-300-hilos-para-cuna-corral-de-70x104cm-blanco/", 2,  0],
  [32, "PROTECTOR IMPERMEABLE PARA COLCHON",                   "Cuarto",       "https://www.carestino.com.pe/producto/protector-impermeable-para-cuna-corral-de-70x104cm-blanco/", 2,  0],
  [33, "MANTA SHERPA",                                         "Cuarto",       "https://www.sodimac.com.pe/sodimac-pe/articulo/155133463/manta-premium-de-sherpa-para-bebes-y-ninos-suavidad-y-abrigo-excepcional-frazada/155133464", 1,  1],
  [34, "SET DE ALIMENTACION DE SILICONA",                      "Alimentación", "https://www.falabella.com.pe/falabella-pe/product/153401695/set-de-alimentacion-para-bebe-de-silicona-antideslizante-9-piezas-verde-libre-de-bpa/153401696", 1,  0],
  [35, "PAÑALES HUGGIES NATURAL CARE TALLA P",                 "Cuidado",      "https://www.mifarma.com.pe/producto/panal-huggies-unisex-talla-p-natural-care/010472", 4,  1],
  [36, "PAÑALES HUGGIES NATURAL CARE TALLA M",                 "Cuidado",      "https://www.mifarma.com.pe/producto/panales-huggies-natural-care-m-60un/011390", 10, 0],
  [37, "PAÑALES HUGGIES NATURAL CARE TALLA G",                 "Cuidado",      "https://www.mifarma.com.pe/producto/panales-huggies-g-bigpack-natural-care-bolsa-66-un/036335", 8,  0],
  [41, "PACK TOALLAS HUMEDAS + CICAPLAST BAUME B5",            "Cuidado",      "https://www.mifarma.com.pe/producto/pack-toallas-humedas-huggies-crema-cicaplast-baume/PACKDB810", 3,  0],
  [42, "EXTRACTOR MANUAL DE LECHE",                            "Cuidado",      "https://www.falabella.com.pe/falabella-pe/product/16974146/extractor-manual-de-leche-240ml-nuby/16974146", 1,  0],
  [43, "TOALLAS HUMEDAS",                                      "Cuidado",      "https://www.mifarma.com.pe/producto/toalla-humeda-babysec-super-premium-99-agua/078910", 10, 0],
  [44, "MOCHILA PAÑALERA",                                     "Paseo",        "https://www.carestino.com.pe/producto/mochila-panialera-boston-negro-melange/", 1,  0],
  [45, "COOLER BAG DE LACTANCIA",                              "Alimentación", "https://www.falabella.com.pe/falabella-pe/product/152937271/cooler-bag-de-lactancia-conservador-de-leche-materna-incluye-2-bloques-de-hielo-con-gel/152937272", 1,  0],
  [46, "EXTRACTOR NASAL",                                      "Cuidado",      "https://www.falabella.com.pe/falabella-pe/product/80070854/aspirador-nasal-electrico-momcozy/80070854", 1,  0],
];

/**
 * Ejecutar UNA vez desde el editor (▶). Reconstruye LISTA DE REGALOS con el
 * formato nuevo (columna LINK) y los ítems actualizados del Excel.
 * Conserva los SEPARADOS que ya hubiera (emparejando por nombre) y NO toca
 * la hoja SEPARACIONES (el registro de quién separó qué se mantiene).
 */
function configurarHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();

  // 1) Rescatar cuántas veces estaba separado cada regalo en la hoja actual
  const separadosPrevios = {};   // nombre normalizado -> número de separaciones
  const hojaVieja = libro.getSheetByName(NOMBRE_HOJA);
  if (hojaVieja && hojaVieja.getLastRow() > 1) {
    const cab = hojaVieja.getRange(1, 1, 1, hojaVieja.getLastColumn()).getValues()[0].map(String);
    const filas = hojaVieja.getRange(2, 1, hojaVieja.getLastRow() - 1, hojaVieja.getLastColumn()).getValues();
    if (cab[4] && cab[4].toUpperCase().indexOf("SEPARADOS") === 0) {
      // v2: ID | REGALO | CATEGORÍA | CANTIDAD | SEPARADOS | ESTADO
      filas.forEach(function (f) {
        const n = Number(f[4]) || 0;
        if (f[1] && n > 0) separadosPrevios[normalizar(f[1])] = n;
      });
    } else if (cab[5] && cab[5].toUpperCase().indexOf("SEPARADOS") === 0) {
      // v3 (re-ejecución): ID | REGALO | CATEGORÍA | LINK | CANTIDAD | SEPARADOS | ESTADO
      filas.forEach(function (f) {
        const n = Number(f[5]) || 0;
        if (f[1] && n > 0) separadosPrevios[normalizar(f[1])] = n;
      });
    } else if (cab[3] && cab[3].toUpperCase().indexOf("ESTADO") === 0) {
      // v1: ID | REGALO | CATEGORÍA | ESTADO | NOMBRE | APELLIDO | FECHA
      filas.forEach(function (f) {
        if (String(f[3]).trim().toUpperCase() === "SEPARADO") {
          const clave = normalizar(f[1]);
          separadosPrevios[clave] = (separadosPrevios[clave] || 0) + 1;
        }
      });
    }
  }

  // 2) Reconstruir la hoja principal (formato v3, con columna LINK)
  let hoja = hojaVieja || libro.insertSheet(NOMBRE_HOJA);
  hoja.clear();
  hoja.getRange(1, 1, 1, 7).setValues([[
    "ID", "REGALO", "CATEGORÍA", "LINK", "CANTIDAD", "SEPARADOS", "ESTADO"
  ]]).setFontWeight("bold").setBackground("#1b2a44").setFontColor("#ffffff");
  const filas = REGALOS_INICIALES.map(function (r) {
    const previo = separadosPrevios[normalizar(r[1])] || 0;
    const sep = Math.min(Math.max(previo, r[5]), r[4]);   // conserva lo separado, sin pasar los cupos
    return [r[0], r[1], r[2], r[3], r[4], sep, sep >= r[4] ? "SEPARADO" : "DISPONIBLE"];
  });
  hoja.getRange(2, 1, filas.length, 7).setValues(filas);
  hoja.setFrozenRows(1);
  hoja.autoResizeColumns(1, 3);
  hoja.setColumnWidth(4, 250);
  hoja.autoResizeColumns(5, 3);

  // 3) Hoja de registro (quién separó qué): solo se crea si no existe
  let log = libro.getSheetByName(NOMBRE_LOG);
  if (!log) {
    log = libro.insertSheet(NOMBRE_LOG);
    log.getRange(1, 1, 1, 5).setValues([["FECHA", "ID", "REGALO", "NOMBRE", "APELLIDO"]])
       .setFontWeight("bold").setBackground("#1e3b2c").setFontColor("#ffffff");
    log.setFrozenRows(1);
  }
}

function normalizar(s) {
  return String(s).trim().toUpperCase()
    .replace(/[ÁÀÄÂ]/g, "A").replace(/[ÉÈËÊ]/g, "E").replace(/[ÍÌÏÎ]/g, "I")
    .replace(/[ÓÒÖÔ]/g, "O").replace(/[ÚÙÜÛ]/g, "U").replace(/\s+/g, " ");
}

/**
 * GET — devuelve la LISTA COMPLETA leída de la hoja (fuente única):
 * {ok:true, v:3, lista:[{id, n:nombre, c:categoría, u:link, t:cupos, s:separados}]}
 * Si la hoja aún tiene el formato v2 (sin LINK), la devuelve igual con u:"".
 */
function doGet() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
  const salida = { ok: false, v: 3, conLink: false, lista: [] };
  if (hoja && hoja.getLastRow() > 1) {
    const cab = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0].map(String);
    const conLink = cab[3] && cab[3].toUpperCase().indexOf("LINK") === 0;
    salida.conLink = !!conLink;   // avisa a la página si la hoja ya tiene columna LINK
    const datos = hoja.getRange(2, 1, hoja.getLastRow() - 1, conLink ? 6 : 5).getValues();
    datos.forEach(function (f) {
      if (!f[0] || !f[1]) return;
      salida.lista.push(conLink
        ? { id: Number(f[0]), n: String(f[1]), c: String(f[2]), u: String(f[3] || ""), t: Number(f[4]) || 1, s: Number(f[5]) || 0 }
        : { id: Number(f[0]), n: String(f[1]), c: String(f[2]), u: "",                 t: Number(f[3]) || 1, s: Number(f[4]) || 0 });
    });
    salida.ok = salida.lista.length > 0;
  }
  return respuestaJson(salida);
}

/** POST — body JSON: {accion:"separar", id, nombre, apellido} */
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

    // Detecta si la hoja ya tiene la columna LINK (v3) o no (v2)
    const cab = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0].map(String);
    const conLink = cab[3] && cab[3].toUpperCase().indexOf("LINK") === 0;
    const colCant = conLink ? 5 : 4, colSep = colCant + 1;

    const datos = hoja.getRange(2, 1, hoja.getLastRow() - 1, colSep).getValues();
    for (let i = 0; i < datos.length; i++) {
      if (Number(datos[i][0]) === Number(cuerpo.id)) {
        const fila = i + 2;
        const cupos = Number(datos[i][colCant - 1]) || 1;
        const sep = Number(datos[i][colSep - 1]) || 0;
        if (sep >= cupos) {
          return respuestaJson({ ok: false, motivo: "ya_separado" });
        }
        hoja.getRange(fila, colSep, 1, 2).setValues([[sep + 1, (sep + 1 >= cupos) ? "SEPARADO" : "DISPONIBLE"]]);

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
