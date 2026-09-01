import { TYPE_RANK } from "./trophySorting.js";

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

const filterTrophies = (trophies, criteria) =>
  trophies.filter((trophy) => Object.entries(criteria).every(([key, value]) => trophy[key] === value));

const byTypeThenYear = (a, b) => (TYPE_RANK[a.type] ?? 9) - (TYPE_RANK[b.type] ?? 9) || b.year - a.year;
const byYear = (a, b) => b.year - a.year;

const matchBestTrophy = (slot, trophies, mode) => {
  switch (mode) {
    case "model":
      return filterTrophies(trophies, { brand: slot.brand, model: slot.model }).sort(byTypeThenYear)[0] || null;
    case "year":
      return filterTrophies(trophies, { brand: slot.brand, model: slot.model, year: slot.year }).sort(byTypeThenYear)[0] || null;
    case "color":
      return filterTrophies(trophies, { brand: slot.brand, model: slot.model, color: slot.color, type: "Common" }).sort(byYear)[0] || null;
    case "type":
      return filterTrophies(trophies, { brand: slot.brand, model: slot.model, type: slot.type }).sort(byYear)[0] || null;
    default:
      return null;
  }
};

export { matchTrophy, getMatchingTrophies, filterTrophies, matchBestTrophy };
