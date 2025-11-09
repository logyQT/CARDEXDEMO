import { carData } from "../../carData.js";
import { VERSION } from "../../utils/constants.js";

const BASE_YEAR = 1975;
const NULL_ID = 0;

const COLOR_MAP = { Black: 1, Silver: 2, Red: 3, Blue: 4, Purple: 5, NavyBlue: 6, White: 7, Gray: 8, Gold: 9, Green: 10, Brown: 11, Orange: 12, Yellow: 13, Graphite: 14, "Light-Blue": 15, "Light-Green": 16 };
const TYPE_MAP = { Common: 1, Silver: 2, Gold: 3, Diamond: 4, Rust: 5 };
const MODE_MAP = { model: 0, year: 1, color: 2, type: 3 };

const REVERSE_CAT_MAPS = {
  color: Object.fromEntries(Object.entries(COLOR_MAP).map(([k, v]) => [v, k])),
  type: Object.fromEntries(Object.entries(TYPE_MAP).map(([k, v]) => [v, k])),
  mode: Object.fromEntries(Object.entries(MODE_MAP).map(([k, v]) => [v, k])),
};

const MODE_SHIFT = 20;
const CAR_ID_SHIFT = 15;
const COLOR_SHIFT = 10;
const YEAR_SHIFT = 4;
const YEAR_NULL_SHIFT = 3;
const TYPE_SHIFT = 0;

const MODE_MASK = 0x03; // 2 bits
const CAR_ID_MASK = 0x1f; // 5 bits
const COLOR_MASK = 0x1f; // 5 bits
const YEAR_MASK = 0x3f; // 6 bits
const YEAR_NULL_MASK = 0x01; // 1 bit
const TYPE_MASK = 0x07; // 3 bits

let CAR_ID_MAP = {};
let REVERSE_CAR_MAP = {};

export function buildCarMaps(data) {
  let currentCarId = 0;
  const processedCars = new Set();
  for (const key of Object.keys(data)) {
    const item = data[key];
    const carKey = item.brand + "|" + item.model;

    if (!processedCars.has(carKey)) {
      const carName = item.name;

      CAR_ID_MAP[carKey] = currentCarId;

      REVERSE_CAR_MAP[currentCarId] = {
        name: carName,
        brand: item.brand,
        model: item.model,
      };

      processedCars.add(carKey);
      currentCarId++;
    }
  }
  return [CAR_ID_MAP, REVERSE_CAR_MAP];
}
buildCarMaps(carData);

export function packTrophyData(key, item) {
  let packed = 0;
  const _mode = key.split("+")[0];

  const modeID = MODE_MAP[_mode];
  const carKey = item.brand + "|" + item.model;
  const carID = CAR_ID_MAP[carKey] || 0;
  const colorID = COLOR_MAP[item.color] || NULL_ID;
  const typeID = TYPE_MAP[item.type] || NULL_ID;

  let yearOffset = 0;
  let yearNullFlag = 0;

  if (item.year === null || item.year === undefined) {
    yearNullFlag = 1;
  } else {
    yearOffset = item.year - BASE_YEAR;
  }

  packed |= modeID << MODE_SHIFT;
  packed |= carID << CAR_ID_SHIFT;
  packed |= colorID << COLOR_SHIFT;
  packed |= yearOffset << YEAR_SHIFT;
  packed |= yearNullFlag << YEAR_NULL_SHIFT;
  packed |= typeID << TYPE_SHIFT;

  return packed;
}

export function unpackData(packed) {
  const yearNullFlag = (packed >>> YEAR_NULL_SHIFT) & YEAR_NULL_MASK;

  const modeID = (packed >>> MODE_SHIFT) & MODE_MASK;
  const carID = (packed >>> CAR_ID_SHIFT) & CAR_ID_MASK;
  const colorID = (packed >>> COLOR_SHIFT) & COLOR_MASK;
  const typeID = (packed >>> TYPE_SHIFT) & TYPE_MASK;

  let year = null;
  if (yearNullFlag === 0) {
    const yearOffset = (packed >>> YEAR_SHIFT) & YEAR_MASK;
    year = yearOffset + BASE_YEAR;
  }

  const carData = REVERSE_CAR_MAP[carID] || { name: null, brand: null, model: null };

  const color = colorID === NULL_ID ? null : REVERSE_CAT_MAPS.color[colorID];
  const type = typeID === NULL_ID ? null : REVERSE_CAT_MAPS.type[typeID];
  const mode = REVERSE_CAT_MAPS.mode[modeID];

  const isOwned = color !== null && year !== null && type !== null;

  function keysFromMode(mode, carData) {
    const _mode = mode.toLowerCase();
    const _brand = carData.brand.toLowerCase().replace(/\s+/g, "_");
    const _model = carData.model.toLowerCase().replace(/\s+/g, "_");
    const _year = year;
    const _color = color !== null ? color.toLowerCase().replace(/\s+/g, "_") : null;
    const _type = type !== null ? type.toLowerCase().replace(/\s+/g, "_") : null;
    if (_mode === "model") {
      return `model+${_brand}+${_model}+null+null+null`;
    } else if (_mode === "year") {
      return `year+${_brand}+${_model}+${_year}+null+null`;
    } else if (_mode === "color") {
      return `color+${_brand}+${_model}+null+${_color}+null`;
    } else if (_mode === "type") {
      return `type+${_brand}+${_model}+null+null+${_type}`;
    }
  }

  return {
    key: keysFromMode(mode, carData),
    value: {
      name: carData.name,
      brand: carData.brand,
      model: carData.model,
      color,
      type,
      year,
      owned: isOwned,
    },
  };
}

export function compressDelta(packedInts) {
  if (packedInts.length === 0) return new Uint8Array(0);

  const sortedInts = [...packedInts].sort((a, b) => a - b);
  const compressedBytes = [];
  let previous = 0;

  const anchor = sortedInts[0];
  compressedBytes.push((anchor >>> 16) & 0xff);
  compressedBytes.push((anchor >>> 8) & 0xff);
  compressedBytes.push(anchor & 0xff);
  previous = anchor;

  for (let i = 1; i < sortedInts.length; i++) {
    const current = sortedInts[i];
    const delta = current - previous;

    if (delta <= 127) {
      compressedBytes.push(delta & 0x7f);
    } else if (delta <= 16383) {
      const byte1 = 0x80 | ((delta >>> 8) & 0x3f);
      const byte2 = delta & 0xff;
      compressedBytes.push(byte1);
      compressedBytes.push(byte2);
    } else if (delta <= 1048575) {
      const byte1 = 0xc0 | ((delta >>> 16) & 0x3f);
      const byte2 = (delta >>> 8) & 0xff;
      const byte3 = delta & 0xff;
      compressedBytes.push(byte1);
      compressedBytes.push(byte2);
      compressedBytes.push(byte3);
    } else {
      throw new Error(`Delta ${delta} exceeded 22-bit limit!`);
    }
    previous = current;
  }
  return new Uint8Array(compressedBytes);
}

export function decompressDelta(byteArray) {
  if (byteArray.length === 0) return [];
  const decompressedInts = [];

  const anchor = (byteArray[0] << 16) | (byteArray[1] << 8) | byteArray[2];
  decompressedInts.push(anchor);
  let previous = anchor;
  let index = 3;

  while (index < byteArray.length) {
    const byte1 = byteArray[index++];
    let delta = 0;

    if ((byte1 & 0x80) === 0) {
      delta = byte1 & 0x7f;
    } else if ((byte1 & 0xc0) === 0x80) {
      const byte2 = byteArray[index++];
      delta = ((byte1 & 0x3f) << 8) | byte2;
    } else if ((byte1 & 0xc0) === 0xc0) {
      const byte2 = byteArray[index++];
      const byte3 = byteArray[index++];
      delta = ((byte1 & 0x3f) << 16) | (byte2 << 8) | byte3;
    } else {
      throw new Error(`Invalid compression flag at byte index ${index - 1}`);
    }

    previous += delta;
    decompressedInts.push(previous);
  }

  return new Uint32Array(decompressedInts);
}

function encodeVersion(ver) {
  const [major, minor, patch] = ver.split(".").map(Number);
  const buffer = new Uint8Array(3);
  buffer[0] = major;
  buffer[1] = minor;
  buffer[2] = patch;
  return buffer;
}

function decodeVersion(buffer) {
  const major = buffer[0];
  const minor = buffer[1];
  const patch = buffer[2];
  return `${major}.${minor}.${patch}`;
}

export function zipData(dataArray) {
  dataArray = new Uint8Array([...encodeVersion(VERSION), ...dataArray]);
  try {
    const compressed = pako.deflate(dataArray, { level: 9 });
    return compressed;
  } catch (err) {
    console.error("Gzip compression failed:", err);
    return dataArray;
  }
}

export function unzipData(compressedData) {
  try {
    const decompressed = pako.inflate(compressedData);

    const version = decodeVersion(decompressed.slice(0, 3));
    const data = decompressed.slice(3);

    return [version, data];
  } catch (err) {
    console.error("Gzip decompression failed:", err);
    return compressedData;
  }
}

export function convertUint8ArrayToBase64(uint8Array) {
  let binaryString = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }
  const base64String = btoa(binaryString);
  let urlSafeString = base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return urlSafeString;
}

export function convertBase64ToUint8Array(base64String) {
  if (typeof atob === "undefined") {
    return new Uint8Array();
  }
  let standardBase64 = base64String.replace(/-/g, "+").replace(/_/g, "/");
  while (standardBase64.length % 4) {
    standardBase64 += "=";
  }
  const binaryString = atob(standardBase64);
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return uint8Array;
}

const reconstructSlots = (data) => {
  const slots = {
    model: {},
    year: {},
    color: {},
    type: {},
    inventory: {},
  };
  for (const key in data) {
    const mode = key.split("+")[0];
    slots[mode][key] = data[key];
  }
  return slots;
};

export function encodeData(slots) {
  const source = { ...slots.model, ...slots.year, ...slots.color, ...slots.type };
  const compressed = new Uint32Array(Object.keys(source).length);
  let index = 0;
  for (const key in source) compressed[index++] = packTrophyData(key, source[key]);
  const deltaCompressed = compressDelta(compressed);
  const zipped = zipData(deltaCompressed);
  const base64String = convertUint8ArrayToBase64(zipped);
  return base64String;
}

export function decodeData(string) {
  const zipped = convertBase64ToUint8Array(string);
  const [ver, unziped] = unzipData(zipped);
  if (ver !== VERSION) throw new Error(`Version mismatch! Expected ${VERSION}, got ${ver}`);
  const compressed = decompressDelta(unziped);
  const decompressed = {};
  for (let i = 0; i < compressed.length; i++) {
    const unpacked = unpackData(compressed[i]);
    decompressed[unpacked.key] = unpacked.value;
  }
  const reconstructedSlots = reconstructSlots(decompressed);
  return reconstructedSlots;
}
