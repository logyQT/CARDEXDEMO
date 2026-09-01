import { typePriority } from "../data/index.js";

const TYPE_RANK = { Diamond: 0, Gold: 1, Silver: 2, Rust: 3, Common: 4 };

const sortTrophies = (trophies, criterion) => {
  const sorted = [...trophies];
  const criteria = Array.isArray(criterion) ? criterion : [criterion];
  sorted.sort((a, b) => {
    for (const c of criteria) {
      let result = 0;
      switch (c) {
        case "type":
          result = (TYPE_RANK[a.type] ?? 9) - (TYPE_RANK[b.type] ?? 9);
          break;
        case "brand":
          result = a.brand.localeCompare(b.brand);
          break;
        case "model":
          result = a.model.localeCompare(b.model);
          break;
        case "year":
          result = b.year - a.year;
          break;
        case "color":
          result = a.color.localeCompare(b.color);
          break;
      }
      if (result !== 0) return result;
    }
    return 0;
  });
  return sorted;
};

const sortTrophySlots = (data, sortParameters) => {
  const dataArray = Object.entries(data);
  dataArray.sort(([, a], [, b]) => {
    for (const [property, direction] of sortParameters) {
      let valueA = a[property];
      let valueB = b[property];
      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      let comparison = 0;
      if (property === "type") {
        valueA = typePriority[valueA] || 0;
        valueB = typePriority[valueB] || 0;
      }
      if (valueA < valueB) comparison = -1;
      else if (valueA > valueB) comparison = 1;
      if (direction.toLowerCase() === "desc") comparison *= -1;
      if (comparison !== 0) return comparison;
    }
    return 0;
  });
  return Object.fromEntries(dataArray);
};

export { TYPE_RANK, sortTrophies, sortTrophySlots };
