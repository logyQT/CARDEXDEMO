const typePriority = {
  diamond: 5,
  gold: 4,
  silver: 3,
  rust: 2,
  common: 1,
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
export { sortTrophySlots };
