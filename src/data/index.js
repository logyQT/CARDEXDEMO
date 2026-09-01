const cars = [
  { brand: "Apex Motors", model: "Striker", prodStart: 1982, prodEnd: 1992 },
  { brand: "Apex Motors", model: "Vanguard", prodStart: 1982, prodEnd: 1992 },
  { brand: "Ardena", model: "Ignis", prodStart: 2000, prodEnd: 2010 },
  { brand: "Ardena", model: "Ventus", prodStart: 1970, prodEnd: 1980 },
  { brand: "Aurora", model: "Outrider", prodStart: 1990, prodEnd: 2000 },
  { brand: "Cargo Wise", model: "P2", prodStart: 1982, prodEnd: 1989 },
  { brand: "Cargo Wise", model: "P3", prodStart: 1998, prodEnd: 2010 },
  { brand: "Cargo Wise", model: "P4", prodStart: 1994, prodEnd: 2010 },
  { brand: "Cavallaro", model: "280G", prodStart: 1980, prodEnd: 1990 },
  { brand: "Harmonia Vehicles", model: "Allegretto", prodStart: 2000, prodEnd: 2010 },
  { brand: "Harmonia Vehicles", model: "Andante", prodStart: 1995, prodEnd: 2005 },
  { brand: "Harmonia Vehicles", model: "Largo", prodStart: 2000, prodEnd: 2010 },
  { brand: "NGD", model: "Pulse", prodStart: 1992, prodEnd: 2002 },
  { brand: "Off Rider", model: "Boulder", prodStart: 1985, prodEnd: 1995 },
  { brand: "Off Rider", model: "Canyon", prodStart: 1986, prodEnd: 1995 },
  { brand: "Off Rider", model: "Ridge", prodStart: 1980, prodEnd: 1986 },
  { brand: "Off Rider", model: "Trail", prodStart: 1980, prodEnd: 1986 },
  { brand: "Phantom", model: "Cortega", prodStart: 1975, prodEnd: 1979 },
  { brand: "Phantom", model: "Gale", prodStart: 1980, prodEnd: 1990 },
  { brand: "Phantom", model: "Thunder", prodStart: 1995, prodEnd: 2000 },
  { brand: "Phantom", model: "ThunderX", prodStart: 2000, prodEnd: 2010 },
  { brand: "Phantom", model: "Voyager", prodStart: 1982, prodEnd: 1991 },
  { brand: "UMX", model: "600C", prodStart: 1980, prodEnd: 1989 },
  { brand: "UMX", model: "700R", prodStart: 1995, prodEnd: 2005 },
  { brand: "UMX", model: "800C", prodStart: 2000, prodEnd: 2010 },
  { brand: "Zen Motors", model: "Ascend", prodStart: 2000, prodEnd: 2010 },
  { brand: "Zen Motors", model: "Journey", prodStart: 1998, prodEnd: 2006 },
];

const allBrands = [...new Set(cars.map((c) => c.brand))];
const allModels = cars.map((c) => c.model);
const modelToBrand = new Map(cars.map((c) => [c.model, c.brand]));
const modelToProdYears = new Map(cars.map((c) => [c.model, { prodStart: c.prodStart, prodEnd: c.prodEnd }]));
const carWithName = cars.map((c) => ({ ...c, name: `${c.brand} ${c.model}` }));

const E_CarBrand = {
  NewEnumerator0: "Apex Motors",
  NewEnumerator1: "UMX",
  NewEnumerator2: "Off Rider",
  NewEnumerator3: "Phantom",
  NewEnumerator7: "Harmonia Vehicles",
  NewEnumerator8: "NGD",
  NewEnumerator9: "Zen Motors",
  NewEnumerator10: "Cargo Wise",
  NewEnumerator12: "Cavallaro",
  NewEnumerator14: "Ardena",
  NewEnumerator15: "Aurora",
};

const E_CarModel = {
  NewEnumerator0: "Striker",
  NewEnumerator1: "Vanguard",
  NewEnumerator2: "600C",
  NewEnumerator3: "Boulder",
  NewEnumerator4: "Canyon",
  NewEnumerator5: "Andante",
  NewEnumerator6: "Pulse",
  NewEnumerator7: "Largo",
  NewEnumerator8: "Allegretto",
  NewEnumerator9: "Journey",
  NewEnumerator10: "Thunder",
  NewEnumerator11: "P3",
  NewEnumerator12: "P4",
  NewEnumerator14: "280G",
  NewEnumerator15: "Gale",
  NewEnumerator16: "Cortega",
  NewEnumerator17: "Voyager",
  NewEnumerator18: "P2",
  NewEnumerator19: "Ignis",
  NewEnumerator20: "Ridge",
  NewEnumerator21: "ThunderX",
  NewEnumerator23: "Outrider",
  NewEnumerator24: "800C",
  NewEnumerator25: "700R",
  NewEnumerator27: "Trail",
  NewEnumerator29: "Ascend",
  NewEnumerator30: "Ventus",
};

const E_VehiclePaintColor = {
  NewEnumerator0: "Black",
  NewEnumerator1: "Silver",
  NewEnumerator2: "Red",
  NewEnumerator3: "Blue",
  NewEnumerator4: "Purple",
  NewEnumerator5: "NavyBlue",
  NewEnumerator7: "White",
  NewEnumerator8: "Gray",
  NewEnumerator9: "Gold",
  NewEnumerator10: "Green",
  NewEnumerator11: "Brown",
  NewEnumerator12: "Orange",
  NewEnumerator13: "Yellow",
  NewEnumerator14: "Graphite",
  NewEnumerator15: "Light-Blue",
  NewEnumerator16: "Light-Green",
};

const E_VehiclePaintColorHumanReadable = {
  NewEnumerator0: "Black",
  NewEnumerator1: "Silver",
  NewEnumerator2: "Red",
  NewEnumerator3: "Blue",
  NewEnumerator4: "Purple",
  NewEnumerator5: "Navy Blue",
  NewEnumerator7: "White",
  NewEnumerator8: "Gray",
  NewEnumerator9: "Gold",
  NewEnumerator10: "Green",
  NewEnumerator11: "Brown",
  NewEnumerator12: "Orange",
  NewEnumerator13: "Yellow",
  NewEnumerator14: "Graphite",
  NewEnumerator15: "Light Blue",
  NewEnumerator16: "Light Green",
};

const E_TrophyType = {
  NewEnumerator0: "Common",
  NewEnumerator1: "Silver",
  NewEnumerator2: "Gold",
  NewEnumerator3: "Diamond",
  NewEnumerator4: "Rust",
};

const typePriority = { diamond: 5, gold: 4, silver: 3, rust: 2, common: 1 };

const COLOR_LOOKUP = {
  Common: "rgb(255, 255, 255)",
  Silver: "rgb(192, 192, 192)",
  Gold: "#9F834C",
  Diamond: "#CCE6FE",
  Rust: "#AA8070",
};

const colorValues = Object.values(E_VehiclePaintColor);
const typeValues = Object.values(E_TrophyType);

const brandLookup = Object.fromEntries(allBrands.map((b) => [b.toLowerCase().replace(/\s+/g, "_"), b]));
const modelLookup = Object.fromEntries(allModels.map((m) => [m.toLowerCase().replace(/\s+/g, "_"), m]));
const typeLookup = { common: "Common", rust: "Rust", silver: "Silver", gold: "Gold", diamond: "Diamond" };
const colorLookup = Object.fromEntries(colorValues.map((c) => [c.toLowerCase().replace(/\s+/g, "_"), c]));

const wordDatabase = {
  brand: [...allBrands],
  model: [...allModels],
  type: typeValues.map((t) => t.toLowerCase()),
  color: [...colorValues],
};

const carIdToModel = Object.fromEntries(
  Object.entries(E_CarModel).map(([key, model]) => [parseInt(key.replace("NewEnumerator", ""), 10), model])
);

export {
  cars,
  carWithName,
  allBrands,
  allModels,
  modelToBrand,
  modelToProdYears,
  E_CarBrand,
  E_CarModel,
  E_VehiclePaintColor,
  E_VehiclePaintColorHumanReadable,
  E_TrophyType,
  typePriority,
  COLOR_LOOKUP,
  colorValues,
  typeValues,
  brandLookup,
  modelLookup,
  typeLookup,
  colorLookup,
  wordDatabase,
  carIdToModel,
};
