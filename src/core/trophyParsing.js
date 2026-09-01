import { E_CarBrand, E_CarModel, E_TrophyType, E_VehiclePaintColor, brandLookup, modelLookup, typeLookup, colorLookup } from "../data/index.js";

const normalizeTrophyData = (trophy) => ({
  brand: E_CarBrand[trophy.brand] || E_CarBrand["NewEnumerator0"],
  model: E_CarModel[trophy.model] || E_CarModel["NewEnumerator0"],
  name: `${E_CarBrand[trophy.brand] || E_CarBrand["NewEnumerator0"]} ${E_CarModel[trophy.model] || E_CarModel["NewEnumerator0"]}`,
  color: E_VehiclePaintColor[trophy.paintColor] || E_VehiclePaintColor["NewEnumerator0"],
  type: E_TrophyType[trophy.trophyType] || E_TrophyType["NewEnumerator0"],
  year: parseInt(trophy.productionYear, 10) || 0,
});

const parseTrophyString = (str) => {
  const inside = str.match(/\((.*)\)/)?.[1];
  if (!inside) {
    console.warn("Invalid trophy string format:", str);
    return;
  }
  const obj = {};
  for (const entry of inside.split(",")) {
    const [rawKey, value] = entry.split("=");
    if (!rawKey || !value) continue;
    const cleanKey = rawKey.split("_")[0];
    const key = cleanKey.charAt(0).toLowerCase() + cleanKey.slice(1);
    obj[key] = value;
  }
  return normalizeTrophyData(obj);
};

const parseSlotID = (slotID) => {
  const [mode, brand, model, year, color, type] = slotID.split("+");
  return [mode, brandLookup[brand] || brand, modelLookup[model] || model, year, colorLookup[color] || color, typeLookup[type] || type];
};

export { normalizeTrophyData, parseTrophyString, parseSlotID };
