const modeToNum = { model: 0, year: 1, color: 2, type: 3 };
const modelToNum = { striker: 0, vanguard: 1, ignis: 2, p2: 3, p3: 4, p4: 5, "280g": 6, allegretto: 7, andante: 8, largo: 9, pulse: 10, boulder: 11, canyon: 12, ridge: 13, cortega: 14, gale: 15, thunder: 16, thunderx: 17, voyager: 18, "600c": 19, journey: 20 };
const brandToNum = { "apex motors": 0, ardena: 1, "cargo wise": 2, cavallaro: 3, "harmonia vehicles": 4, ngd: 5, "off rider": 6, phantom: 7, umx: 8, "zen motors": 9 };
const colorToNum = { black: 0, silver: 1, red: 2, blue: 3, purple: 4, navyblue: 5, white: 6, gray: 7, gold: 8, green: 9, brown: 10, orange: 11, yellow: 12, graphite: 13, "light-blue": 14, "light-green": 15 };
const typeToNum = { common: 0, rust: 1, silver: 2, gold: 3, diamond: 4 };

export { modelToNum, brandToNum, modeToNum, colorToNum, typeToNum };

const numToMode = { 0: "model", 1: "year", 2: "color", 3: "type" };
const numToModel = { 0: "Striker", 1: "Vanguard", 2: "Ignis", 3: "P2", 4: "P3", 5: "P4", 6: "280G", 7: "Allegretto", 8: "Andante", 9: "Largo", 10: "Pulse", 11: "Boulder", 12: "Canyon", 13: "Ridge", 14: "Cortega", 15: "Gale", 16: "Thunder", 17: "ThunderX", 18: "Voyager", 19: "600C", 20: "Journey" };
const numToBrand = { 0: "Apex Motors", 1: "Ardena", 2: "Cargo Wise", 3: "Cavallaro", 4: "Harmonia Vehicles", 5: "NGD", 6: "Off Rider", 7: "Phantom", 8: "UMX", 9: "Zen Motors" };
const numToColor = { 0: "Black", 1: "Silver", 2: "Red", 3: "Blue", 4: "Purple", 5: "NavyBlue", 6: "White", 7: "Gray", 8: "Gold", 9: "Green", 10: "Brown", 11: "Orange", 12: "Yellow", 13: "Graphite", 14: "Light-Blue", 15: "Light-Green" };
const numToType = { 0: "Common", 1: "Rust", 2: "Silver", 3: "Gold", 4: "Diamond" };

export { numToModel, numToBrand, numToColor, numToType, numToMode };
