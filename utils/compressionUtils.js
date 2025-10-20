import { modelToNum, brandToNum, modeToNum, colorToNum, typeToNum } from "./compressionData.js";
import { numToModel, numToBrand, numToColor, numToType, numToMode } from "./compressionData.js";

const compressYear = (year) => {
  if (year === null || year === "null") return "?";
  year = Number(year);
  return Number(String(year).slice(2));
};
const decompressYear = (year) => {
  year = Number(year);
  if (isNaN(year)) return null;
  return year <= 10 ? year + 2000 : year + 1900;
};

export { compressYear, decompressYear };

const compressID = (id) => {
  const parts = id.replace(/_/g, " ").split("+");
  let [mode, brand, model, year, color, type] = parts;
  let str = "";
  str += `${modeToNum[mode]}`;
  str += `+${brandToNum[brand]}`;
  str += `+${modelToNum[model]}`;
  str += `+${compressYear(year)}`;
  str += color === null || color === "null" ? `+?` : `+${colorToNum[color]}`;
  str += type === null || type === "null" ? `+?` : `+${typeToNum[type]}`;
  return str;
};

const decompressID = (id) => {
  const parts = id.split("+");
  let [mode, brand, model, year, color, type] = parts;
  let str = "";
  str += `${numToMode[mode]}`;
  str += `+${numToBrand[brand]}`;
  str += `+${numToModel[model]}`;
  str += year === "?" ? `+null` : `+${decompressYear(year)}`;
  str += color === "?" ? `+null` : `+${numToColor[color]}`;
  str += type === "?" ? `+null` : `+${numToType[type]}`;
  return str.toLowerCase().replace(/ /g, "_");
};

export { compressID, decompressID };

const compressTrophySlots = (obj) => {
  const minified = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const mkey = compressID(key);
      let { brand, model, year, color, type, owned } = obj[key];

      let str = "";
      str += `${brandToNum[(brand ?? "").toLowerCase()]}`;
      str += `+${modelToNum[(model ?? "").toLowerCase()]}`;
      str += `+${compressYear(year)}`;
      str += color === null ? `+?` : `+${colorToNum[(color ?? "").toLowerCase()]}`;
      str += type === null ? `+?` : `+${typeToNum[(type ?? "").toLowerCase()]}`;
      str += `+${owned ? 1 : 0}`;
      minified[mkey] = str;
    }
  }
  return minified;
};

const decompressTrophySlots = (minified) => {
  const restored = {};
  for (const mkey in minified) {
    if (minified.hasOwnProperty(mkey)) {
      const key = decompressID(mkey);
      const parts = minified[mkey].split("+");
      let [nbrand, nmodel, nyear, ncolor, ntype, nowned] = parts;

      const name = `${numToBrand[nbrand]} ${numToModel[nmodel]}`;
      const brand = numToBrand[nbrand];
      const model = numToModel[nmodel];
      const year = decompressYear(nyear);
      const color = ncolor === "?" ? null : numToColor[ncolor];
      const type = ntype === "?" ? null : numToType[ntype];
      const owned = nowned === "1" ? true : false;
      restored[key] = { name, model, brand, year, color, type, owned };
    }
  }
  return restored;
};

export { compressTrophySlots, decompressTrophySlots };
