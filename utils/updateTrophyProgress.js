import { matchTrophy, updateProgressBar, generateAllTrophySlots } from "./index.js";
import { carData } from "../carData.js";

const updateTrophyProgress = (carDex, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR) => {
    const slots = generateAllTrophySlots(mode, carData);
    let owned = 0;

    carDex[mode].forEach((trophy) => {
        slots.forEach((slot) => {
            if (matchTrophy(slot, trophy, mode)) {
                slot.owned = true;
                slot.color = trophy.color;
                slot.type = trophy.type;
                slot.year = trophy.year;
            }
        });
    });

    owned = slots.filter((slot) => slot.owned).length;
    const total = slots.length;

    updateProgressBar(owned, total, PROGRESS_BAR_TEXT, PROGRESS_BAR);
};

export { updateTrophyProgress };
