import { E_VehiclePaintColor, E_TrophyType } from "./mappings.js";
import { carData } from "../carData.js";
import { generateID } from "./generateID.js";
const generateAllTrophySlots = (mode, trophyInventory = []) => {
    const slots = {};
    carData.forEach((car) => {
        if (mode === "model") {
            let slot = { mode: mode, name: car.name, year: null, color: null, type: null, owned: false, brand: car.brand, model: car.model };
            const slotID = generateID(mode, slot);
            slots[slotID] = slot;
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
                    mode: mode,
                };
                const slotID = generateID(mode, slot);
                slots[slotID] = slot;
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
                    mode: mode,
                };
                const slotID = generateID(mode, slot);
                slots[slotID] = slot;
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
                    mode: mode,
                };
                const slotID = generateID(mode, slot);
                slots[slotID] = slot;
            });
        }
    });
    if (mode === "inventory") {
        if (trophyInventory.length === 0) return;
        trophyInventory.forEach((trophy) => {
            let slot = {
                name: trophy.name,
                year: trophy.year,
                color: trophy.color,
                type: trophy.type,
                owned: true,
                brand: trophy.brand,
                model: trophy.model,
                mode: mode,
            };
            const slotID = generateID(mode, slot);
            slots[slotID] = slot;
        });
    }
    return slots;
};

export { generateAllTrophySlots };
