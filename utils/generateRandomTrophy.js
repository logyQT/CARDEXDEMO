import { E_VehiclePaintColor } from "./mappings.js";
import { allCarModels, modelToBrandMap, modelToProdYearsMap } from "../carData.js";

const generateRandomTrophy = () =>{
    const rmodel = allCarModels[Math.floor(Math.random()*allCarModels.length)];
    const rbrand = modelToBrandMap.get(rmodel);
    const rcolor = E_VehiclePaintColor[Object.keys(E_VehiclePaintColor)[Math.floor(Math.random()*Object.keys(E_VehiclePaintColor).length)]];
    let rtype;
    const rand = Math.random();
    if (rand < 1 / 99) {
        rtype = "Rust";
    } else if (rand < 1 / 51) {
        rtype = "Diamond";
    } else if (rand < 1 / 26) {
        rtype = "Gold";
    } else if (rand < 1 / 11) {
        rtype = "Silver";
    } else {
        rtype = "Common";
    }
    const prodYears = modelToProdYearsMap.get(rmodel);
    const ryear = prodYears ? Math.floor(Math.random()*(prodYears.prodEnd - prodYears.prodStart + 1)) + prodYears.prodStart : 0;

    return {
        brand: rbrand,
        model: rmodel,
        color: rcolor,
        type: rtype,
        year: ryear,
    };
}

export { generateRandomTrophy };