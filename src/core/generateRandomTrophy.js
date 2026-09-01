import { E_VehiclePaintColor, allModels, modelToBrand, modelToProdYears } from "../data/index.js";

const generateRandomTrophy = () => {
  const rmodel = allModels[Math.floor(Math.random() * allModels.length)];
  const rbrand = modelToBrand.get(rmodel);
  const colors = Object.values(E_VehiclePaintColor);
  const rcolor = colors[Math.floor(Math.random() * colors.length)];
  const rand = Math.random();
  let rtype;
  if (rand < 1 / 99) rtype = "Rust";
  else if (rand < 1 / 51) rtype = "Diamond";
  else if (rand < 1 / 26) rtype = "Gold";
  else if (rand < 1 / 11) rtype = "Silver";
  else rtype = "Common";
  const prodYears = modelToProdYears.get(rmodel);
  const ryear = prodYears ? Math.floor(Math.random() * (prodYears.prodEnd - prodYears.prodStart + 1)) + prodYears.prodStart : 0;
  return { brand: rbrand, model: rmodel, color: rcolor, type: rtype, year: ryear, name: `${rbrand} ${rmodel}`, owned: true };
};

export { generateRandomTrophy };
