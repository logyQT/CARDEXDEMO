import { sortTrophies } from "./trophySorting.js";

const matchTrophy = (slotID, trophy) => {
  const [smode, sbrand, smodel, syear, scolor, stype] = slotID.replace(/_/g, " ").split("+");
  const { brand, model, year, color, type } = trophy;
  const b = brand.toLowerCase();
  const m = model.toLowerCase();
  const y = year.toString();
  const c = color.toLowerCase();
  const t = type.toLowerCase();
  if (smode === "model") {
    return sbrand === b && smodel === m;
  } else if (smode === "year") {
    return sbrand === b && smodel === m && syear === y;
  } else if (smode === "color") {
    return sbrand === b && smodel === m && scolor === c && t === "common";
  } else if (smode === "type") {
    return sbrand === b && smodel === m && stype === t;
  }
  return false;
};

const getMatchingTrophies = (slotID, trophyInventory) => trophyInventory.filter((trophy) => matchTrophy(slotID, trophy));

const matchBestTrophy = (slot, trophies, mode) => {
  const exact = (criteria) => trophies.filter((trophy) => Object.entries(criteria).every(([key, value]) => trophy[key] === value));
  switch (mode) {
    case "model":
      return sortTrophies(exact({ brand: slot.brand, model: slot.model }), ["type", "year"])[0] || null;
    case "year":
      return sortTrophies(exact({ brand: slot.brand, model: slot.model, year: slot.year }), ["type", "year"])[0] || null;
    case "color":
      return sortTrophies(exact({ brand: slot.brand, model: slot.model, color: slot.color, type: "Common" }), ["year"])[0] || null;
    case "type":
      return sortTrophies(exact({ brand: slot.brand, model: slot.model, type: slot.type }), ["year"])[0] || null;
    default:
      return null;
  }
};

export { matchTrophy, getMatchingTrophies, matchBestTrophy };
