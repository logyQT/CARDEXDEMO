const lookup = {
  brand: {
    apex_motors: "Apex Motors",
    ardena: "Ardena",
    aurora: "Aurora",
    cargo_wise: "Cargo Wise",
    cavallaro: "Cavallaro",
    harmonia_vehicles: "Harmonia Vehicles",
    ngd: "NGD",
    off_rider: "Off Rider",
    phantom: "Phantom",
    umx: "UMX",
    zen_motors: "Zen Motors",
  },
  model: {
    striker: "Striker",
    vanguard: "Vanguard",
    "600c": "600C",
    "800c": "800C",
    andante: "Andante",
    boulder: "Boulder",
    canyon: "Canyon",
    cortega: "Cortega",
    gale: "Gale",
    ignis: "Ignis",
    journey: "Journey",
    largo: "Largo",
    outlander: "Outrider",
    p2: "P2",
    p3: "P3",
    p4: "P4",
    pulse: "Pulse",
    ridge: "Ridge",
    thunder: "Thunder",
    thunderx: "ThunderX",
    voyager: "Voyager",
    allegretto: "Allegretto",
    "280g": "280G",
  },
  type: {
    common: "Common",
    rust: "Rusty",
    silver: "Silver",
    gold: "Gold",
    diamond: "Diamond",
  },
  color: {
    black: "Black",
    silver: "Silver",
    red: "Red",
    blue: "Blue",
    purple: "Purple",
    navyblue: "Navy Blue",
    white: "White",
    gray: "Gray",
    gold: "Gold",
    green: "Green",
    brown: "Brown",
    orange: "Orange",
    yellow: "Yellow",
    graphite: "Graphite",
    "light-blue": "Light Blue",
    "light-green": "Light Green",
  },
};

const parseSlotID = (slotID) => {
  const parts = slotID.split("+");
  let [mode, brand, model, year, color, type] = parts;
  brand = lookup.brand[brand] || brand;
  model = lookup.model[model] || model;
  type = lookup.type[type] || type;
  color = lookup.color[color] || color;
  return [mode, brand, model, year, color, type];
};
export { parseSlotID };
