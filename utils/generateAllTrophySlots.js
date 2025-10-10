import { E_VehiclePaintColor, E_TrophyType } from "./mappings.js";
import { carData } from "../carData.js";
import { generateID } from "./generateID.js";
const generateAllTrophySlots = (mode) => {
    const slots = [];
    carData.forEach((car) => {
        if (mode === "model") {
            let slot = { name: car.name, year: null, color: null, type: null, owned: false, brand: car.brand, model: car.model };
            slot.slotID = generateID(mode, slot);
            slots.push(slot);
        } else if (mode === "year") {
            for (let year = car.prodStart; year <= car.prodEnd; year++) {
                let slot = {
                    name: car.name,
                    year,
                    color: null,
                    type: null,
                    owned: false,
                    brand: car.brand,
                    model: car.model,
                };
                slot.slotID = generateID(mode, slot);
                slots.push(slot);
            }
        } else if (mode === "color") {
            Object.keys(E_VehiclePaintColor).forEach((color) => {
                let slot = {
                    name: car.name,
                    year: null,
                    color: E_VehiclePaintColor[color],
                    type: null,
                    owned: false,
                    brand: car.brand,
                    model: car.model,
                };
                slot.slotID = generateID(mode, slot);
                slots.push(slot);
            });
        } else if (mode === "type") {
            Object.keys(E_TrophyType).forEach((type) => {
                let slot = {
                    name: car.name,
                    year: null,
                    color: null,
                    type: E_TrophyType[type],
                    owned: false,
                    brand: car.brand,
                    model: car.model,
                };
                slot.slotID = generateID(mode, slot);
                slots.push(slot);
            });
        }
    });
    return slots;
};

export { generateAllTrophySlots };
