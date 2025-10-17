import { E_CarModel, E_CarBrand, E_VehiclePaintColor, E_TrophyType, E_CarDexMode } from "./mappings.js";

const numToModel = Object.fromEntries(Object.values(E_CarModel).map((v, i) => [i, v]));
const numToBrand = Object.fromEntries(Object.values(E_CarBrand).map((v, i) => [i, v]));
const numToColor = Object.fromEntries(Object.values(E_VehiclePaintColor).map((v, i) => [i, v]));
const numToType = Object.fromEntries(Object.values(E_TrophyType).map((v, i) => [i, v]));
const numToMode = Object.fromEntries(Object.values(E_CarDexMode).map((v, i) => [i, v]));

const modelToNum = Object.fromEntries(Object.values(numToModel).map((v, i) => [v.toLowerCase(), i]));
const brandToNum = Object.fromEntries(Object.values(numToBrand).map((v, i) => [v.toLowerCase(), i]));
const colorToNum = Object.fromEntries(Object.values(numToColor).map((v, i) => [v.toLowerCase(), i]));
const typeToNum = Object.fromEntries(Object.values(numToType).map((v, i) => [v.toLowerCase(), i]));
const modeToNum = Object.fromEntries(Object.values(numToMode).map((v, i) => [v.toLowerCase(), i]));

export { numToModel, numToBrand, numToColor, numToType, numToMode };
export { modelToNum, brandToNum, modeToNum, colorToNum, typeToNum };

// const verifyMappings = (toNum, fromNum) => {
//   let missMatches = 0;
//   for (const [value, num] of Object.entries(toNum)) {
//     if (fromNum[num]?.toLowerCase() !== value) {
//       console.error(`❌ Mismatch: ${value} → ${num} → ${fromNum[num]}`);
//       missMatches++;
//     }
//   }
//   for (const [num, value] of Object.entries(fromNum)) {
//     if (toNum[value?.toLowerCase()]?.toString() !== num) {
//       console.error(`❌ Mismatch: ${num} → ${value} → ${toNum[value?.toLowerCase()]}`);
//       missMatches++;
//     }
//   }
//   if (missMatches > 0) {
//     return false;
//   }
//   return true;
// };

// const integrityCheck = () => {
//   return verifyMappings(modelToNum, numToModel) && verifyMappings(brandToNum, numToBrand) && verifyMappings(colorToNum, numToColor) && verifyMappings(typeToNum, numToType) && verifyMappings(modeToNum, numToMode);
// };

// export { integrityCheck };
