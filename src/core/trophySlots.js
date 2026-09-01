import { carWithName as cars, colorValues, typeValues } from "../data/index.js";
import { matchBestTrophy } from "./trophyMatching.js";

const generateID = (mode, trophy) => {
  if (!trophy || typeof trophy !== "object") return "";
  return `${mode}+${trophy.brand}+${trophy.model}+${trophy.year}+${trophy.color}+${trophy.type}`.replace(/\s+/g, "_").toLowerCase();
};

const baseSlot = (car) => ({ name: car.name, year: null, color: null, type: null, owned: false, brand: car.brand, model: car.model });

const generateAllTrophySlots = (mode, trophyInventory = []) => {
  const slots = {};
  cars.forEach((car) => {
    let values = null;
    if (mode === "model") {
      const slot = baseSlot(car);
      slots[generateID(mode, slot)] = slot;
      return;
    } else if (mode === "year") {
      for (let year = car.prodStart; year <= car.prodEnd; year++) {
        const slot = { ...baseSlot(car), year };
        slots[generateID(mode, slot)] = slot;
      }
      return;
    } else if (mode === "color") {
      values = colorValues;
    } else if (mode === "type") {
      values = typeValues;
    }
    if (!values) return;
    values.forEach((value) => {
      const slot = { ...baseSlot(car), [mode]: value };
      slots[generateID(mode, slot)] = slot;
    });
  });
  if (mode === "inventory") {
    if (trophyInventory.length === 0) return {};
    trophyInventory.forEach((trophy) => {
      const slot = { name: `${trophy.brand} ${trophy.model}`, year: trophy.year, color: trophy.color, type: trophy.type, owned: true, brand: trophy.brand, model: trophy.model };
      slots[generateID(mode, slot)] = slot;
    });
  }
  return slots;
};

const autoFillTrophySlots = (slots, trophyInventory) => {
  for (const mode in slots) {
    if (mode === "inventory") continue;
    for (const slotID of Object.keys(slots[mode])) {
      if (slots[mode][slotID].owned) continue;
      const bestTrophy = matchBestTrophy(slots[mode][slotID], trophyInventory, mode);
      if (bestTrophy) {
        slots[mode][slotID] = bestTrophy;
        slots[mode][slotID].owned = true;
      }
    }
  }
  return slots;
};

export { generateID, generateAllTrophySlots, autoFillTrophySlots };
