import { carIdToModel, modelToBrand } from "../data/index.js";

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
  return { trophyType: parts[0], carModel: parts[2], value: statBody.integer };
};

const models = Object.values(carIdToModel);

class Stats {
  constructor() {
    const init = Object.fromEntries(models.map((m) => [m, 0]));
    this.commonTrophies = { ...init };
    this.rustTrophies = { ...init };
    this.silverTrophies = { ...init };
    this.goldTrophies = { ...init };
    this.diamondTrophies = { ...init };
    this.carDex = { model: {}, year: {}, color: {}, type: {} };
  }
  setInit(type, model, value) {
    this[statTypes[type]][carIdToModel[model]] = value;
  }
  setCarDex(mode, owned, missing, total) {
    this.carDex[mode] = { owned, missing, total };
  }
  get totalTrophies() {
    return Object.fromEntries(
      models.map((model) => [model, this.commonTrophies[model] + this.silverTrophies[model] + this.goldTrophies[model] + this.diamondTrophies[model] + this.rustTrophies[model]])
    );
  }
  get nextMilestone() {
    const milestones = {};
    for (const model of models) {
      const total = this.totalTrophies[model];
      milestones[model] = total >= 50 ? null : total >= 25 ? 50 : total >= 10 ? 25 : 10;
    }
    return milestones;
  }
  updateStats(slots) {
    for (const mode in slots) {
      if (mode === "inventory") continue;
      const owned = {};
      const missing = {};
      const total = {};
      for (const slotID in slots[mode]) {
        const slot = slots[mode][slotID];
        const modelName = slot.model;
        total[modelName] = (total[modelName] || 0) + 1;
        if (slot.owned) {
          (owned[modelName] ??= []).push(slot);
        } else {
          (missing[modelName] ??= []).push(slot);
        }
      }
      this.setCarDex(mode, owned, missing, total);
    }
  }
}

const getStats = (SaveObject, slots) => {
  if (!SaveObject) return null;
  const stats = new Stats();
  const rawStats = SaveObject.AdditionalGameData.PlayerStatistics.statisticValues;
  for (const [key, value] of Object.entries(rawStats)) {
    if (!key.includes("trophy")) continue;
    const { trophyType, carModel, value: v } = processTrophyStat(key, value);
    stats.setInit(trophyType, carModel, v);
  }
  stats.updateStats(slots);
  return stats;
};

export { getStats, Stats, modelToBrand };
