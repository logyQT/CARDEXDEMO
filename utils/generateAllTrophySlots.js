import { E_VehiclePaintColor, E_TrophyType } from "./mappings.js";
const generateAllTrophySlots = (mode, carData) => {
    const slots = [];
    carData.forEach((car) => {
        if (mode === "model") {
            slots.push({
                name: car.name,
                year: null,
                color: null,
                type: null,
                owned: false,
                brand: car.brand,
                model: car.model,
            });
        } else if (mode === "year") {
            for (let year = car.prodStart; year <= car.prodEnd; year++) {
                slots.push({
                    name: car.name,
                    year,
                    color: null,
                    type: null,
                    owned: false,
                    brand: car.brand,
                    model: car.model,
                });
            }
        } else if (mode === "color") {
            Object.keys(E_VehiclePaintColor).forEach((color) => {
                slots.push({
                    name: car.name,
                    year: null,
                    color: E_VehiclePaintColor[color],
                    type: null,
                    owned: false,
                    brand: car.brand,
                    model: car.model,
                });
            });
        } else if (mode === "type") {
            Object.keys(E_TrophyType).forEach((type) => {
                slots.push({
                    name: car.name,
                    year: null,
                    color: null,
                    type: E_TrophyType[type],
                    owned: false,
                    brand: car.brand,
                    model: car.model,
                });
            });
        }
    });
    return slots;
};

export { generateAllTrophySlots };
