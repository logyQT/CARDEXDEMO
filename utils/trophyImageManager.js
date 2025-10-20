import { E_CarModel, E_VehiclePaintColor, E_TrophyType } from "./mappings.js";
import { modelToBrandMap } from "../carData.js";

class TrophyImageManager {
  static instance = null;

  constructor() {
    if (TrophyImageManager.instance) return TrophyImageManager.instance;

    this.cache = new Map();
    this.isPreloading = false;

    TrophyImageManager.instance = this;
  }

  static getInstance() {
    return new TrophyImageManager();
  }

  _getTrophyId(brand, model, color, type) {
    return `${brand}-${model}-${color ?? "default"}-${type}`;
  }

  _getTrophyImagePath(brand, model, color, type) {
    const base = `${brand} ${model}`.replace(/\s+/g, "_");
    const suffix = type === "Common" && color ? `_Color_${color}` : `_Type_${type}`;
    return `./assets/Trophies/Textures/${brand.replace(/\s+/g, "_")}/${model.replace(/\s+/g, "_")}/${base}${suffix}.webp`;
  }

  registerAll() {
    const models = Object.values(E_CarModel);
    const colors = Object.values(E_VehiclePaintColor);
    const types = Object.values(E_TrophyType);

    for (const model of models) {
      const brand = modelToBrandMap.get(model);
      for (const type of types) {
        if (type === "Common") {
          for (const color of colors) {
            this._registerSingle(brand, model, color, type);
          }
        } else {
          this._registerSingle(brand, model, null, type);
        }
      }
    }
  }

  _registerSingle(brand, model, color, type) {
    const id = this._getTrophyId(brand, model, color, type);
    if (!this.cache.has(id)) {
      const src = this._getTrophyImagePath(brand, model, color, type);
      this.cache.set(id, { img: null, src, loaded: false, error: false });
    }
  }

  async preloadAll() {
    if (this.isPreloading) return;
    this.isPreloading = true;

    const entries = Array.from(this.cache.entries());
    let loaded = 0;
    const total = entries.length;

    const { root, text, bar } = this._createStatusDiv();

    let index = 0;
    let batchSize = 4;
    const maxBatch = total / 4;
    const minBatch = 4;

    const loadImage = (id, src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const entry = this.cache.get(id);
          if (entry) {
            entry.img = img;
            entry.loaded = true;
          }
          update(++loaded);
          resolve(true);
        };
        img.onerror = () => {
          const entry = this.cache.get(id);
          if (entry) entry.error = true;
          update(++loaded);
          resolve(false);
        };
        img.src = src;
      });

    const update = (count) => {
      const percent = (count / total) * 100;
      text.innerText = `${count}/${total} trophies loaded`;
      bar.style.width = `${percent}%`;
      if (count === total) {
        root.style.transition = "opacity 0.6s ease";
        root.style.opacity = "0";
        setTimeout(() => root.remove(), 800);
      }
    };

    while (index < total) {
      const batch = entries.slice(index, index + batchSize);
      const start = performance.now();
      await Promise.all(batch.map(([id, { src }]) => loadImage(id, src)));
      const elapsed = performance.now() - start;

      if (elapsed < 200 && batchSize < maxBatch) batchSize += 4;
      else if (elapsed > 600 && batchSize > minBatch) batchSize -= 2;

      index += batch.length;
    }

    this.isPreloading = false;
  }

  _loadImage(id, src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const entry = this.cache.get(id);
        if (entry) {
          entry.img = img;
          entry.loaded = true;
          entry.loading = null;
        }
        resolve();
      };
      img.onerror = () => {
        const entry = this.cache.get(id);
        if (entry) {
          entry.error = true;
          entry.loading = null;
        }
        resolve();
      };
      img.src = src;
    });
  }

  async getImage(brand, model, color, type) {
    const id = this._getTrophyId(brand, model, color, type);
    let entry = this.cache.get(id);

    if (!entry) {
      const src = this._getTrophyImagePath(brand, model, color, type);
      entry = { img: null, src, loaded: false, error: false };
      this.cache.set(id, entry);
    }

    if (entry.loaded && entry.img) return entry.img;

    if (!entry.loading) {
      entry.loading = this._loadImage(id, entry.src);
    }

    await entry.loading;
    return this.cache.get(id)?.img ?? null;
  }

  getId(brand, model, color, type) {
    return this._getTrophyId(brand, model, color, type);
  }

  ensure(id, src) {
    if (!this.cache.has(id)) {
      this.cache.set(id, { img: null, src, loaded: false, error: false });
    }
  }

  _createStatusDiv() {
    const root = document.createElement("div");
    root.style.position = "fixed";
    root.style.top = "10px";
    root.style.left = "10px";
    root.style.padding = "5px 10px";
    root.style.background = "rgba(0,0,0,0.7)";
    root.style.color = "#fff";
    root.style.fontFamily = "sans-serif";
    root.style.fontSize = "14px";
    root.style.borderRadius = "4px";
    root.style.width = "160px";
    root.style.zIndex = "1000";

    const text = document.createElement("div");
    text.innerText = "0 trophies loaded";
    root.appendChild(text);

    const barContainer = document.createElement("div");
    barContainer.style.height = "6px";
    barContainer.style.background = "rgba(255,255,255,0.2)";
    barContainer.style.borderRadius = "3px";
    barContainer.style.marginTop = "4px";
    root.appendChild(barContainer);

    const bar = document.createElement("div");
    bar.style.height = "100%";
    bar.style.width = "0%";
    bar.style.background = "#4caf50";
    bar.style.borderRadius = "3px";
    bar.style.transition = "width 0.2s ease";
    barContainer.appendChild(bar);

    document.body.appendChild(root);
    return { root, text, bar };
  }
}

export const trophyImageManager = TrophyImageManager.getInstance();
