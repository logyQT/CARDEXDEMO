/**
 * @function getStats
 * @param {import("./types.js".SaveObjectRoot)} SaveObject
 * @returns {Object|null}
 */

import { sortTrophies } from "./sortTrophies.js";

const carIdToModel = {
  0: "Striker",
  1: "Vanguard",
  2: "600C",
  3: "Thunder",
  4: "Boulder",
  5: "Canyon",
  6: "Andante",
  7: "Largo",
  8: "Allegretto",
  9: "Pulse",
  10: "Journey",
  11: "P3",
  12: "P4",
  14: "280G",
  15: "Gale",
  16: "Cortega",
  17: "Voyager",
  18: "P2",
  19: "Ignis",
  20: "Ridge",
  21: "ThunderX",
  23: "Outrider",
  24: "800C",
};

const statTypes = {
  0: "commonTrophies",
  1: "silverTrophies",
  2: "goldTrophies",
  3: "diamondTrophies",
  4: "rustTrophies",
};

const processTrophyStat = (statKey, statBody) => {
  const statId = statKey.split("trophy")[1];
  const parts = statId.split("x");
  const trophyType = parts[0];
  const carModel = parts[2];
  const value = statBody.integer;
  return { trophyType, carModel, value };
};

class Stats {
  constructor() {
    this.commonTrophies = {};
    this.rustTrophies = {};
    this.silverTrophies = {};
    this.goldTrophies = {};
    this.diamondTrophies = {};
    this.carDex = {
      model: { owned: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])), missing: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])), total: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])) },
      year: { owned: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])), missing: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])), total: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])) },
      color: { owned: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])), missing: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])), total: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])) },
      type: { owned: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])), missing: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])), total: Object.fromEntries(Object.values(carIdToModel).map((model) => [model, {}])) },
    };
    this._init();
  }
  _init() {
    this.commonTrophies = Object.fromEntries(Object.values(carIdToModel).map((model) => [model, 0]));
    this.rustTrophies = Object.fromEntries(Object.values(carIdToModel).map((model) => [model, 0]));
    this.silverTrophies = Object.fromEntries(Object.values(carIdToModel).map((model) => [model, 0]));
    this.goldTrophies = Object.fromEntries(Object.values(carIdToModel).map((model) => [model, 0]));
    this.diamondTrophies = Object.fromEntries(Object.values(carIdToModel).map((model) => [model, 0]));
  }
  setInit(type, model, value) {
    this[statTypes[type]][carIdToModel[model]] = value;
  }
  setCarDex(mode, owned, missing, total) {
    this.carDex[mode] = { owned, missing, total };
  }
  get totalTrophies() {
    const totals = {};
    for (const model of Object.values(carIdToModel)) {
      totals[model] = this.commonTrophies[model] + this.silverTrophies[model] + this.goldTrophies[model] + this.diamondTrophies[model] + this.rustTrophies[model];
    }
    return totals;
  }
  get nextMilestone() {
    const milestones = {};
    for (const model of Object.values(carIdToModel)) {
      const total = this.totalTrophies[model];
      if (total >= 50) {
        milestones[model] = null;
        continue;
      } else if (total >= 25) {
        milestones[model] = 50;
      } else if (total >= 10) {
        milestones[model] = 25;
      } else {
        milestones[model] = 10;
      }
    }
    return milestones;
  }
  updateStats(slots) {
    for (const mode in slots) {
      const owned = {};
      const missing = {};
      const total = {};
      for (const slotID in slots[mode]) {
        const slot = slots[mode][slotID];
        const modelName = slot.model;
        total[modelName] = (total[modelName] || 0) + 1;
        if (slot.owned) {
          if (!owned[modelName]) owned[modelName] = [slots[mode][slotID]];
          else owned[modelName].push(slots[mode][slotID]);
        } else {
          if (!missing[modelName]) missing[modelName] = [slots[mode][slotID]];
          else missing[modelName].push(slots[mode][slotID]);
        }
      }
      this.setCarDex(mode, owned, missing, total);
    }
  }
}

const getStats = (SaveObject, slots) => {
  slots = { ...slots };
  delete slots["inventory"];
  if (!SaveObject) return null;
  const stats = new Stats();
  const rawStats = SaveObject.AdditionalGameData.PlayerStatistics.statisticValues;

  Object.keys(rawStats).forEach((key) => {
    if (!key.includes("trophy")) delete rawStats[key];
  });

  for (const statKey in rawStats) {
    const { trophyType, carModel, value } = processTrophyStat(statKey, rawStats[statKey]);
    stats.setInit(trophyType, carModel, value);
  }

  stats.updateStats(slots);

  console.log(stats);

  return stats;
};
export { getStats };
