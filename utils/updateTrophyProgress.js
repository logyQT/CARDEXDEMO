import { updateProgressBar, generateAllTrophySlots } from "./index.js";
import { carData } from "../carData.js";

const updateTrophyProgress = (carDex, mode, PROGRESS_BAR_TEXT, PROGRESS_BAR) => {
    const slots = generateAllTrophySlots(mode);
    let owned = carDex[mode].length;
    let total = slots.length;
    updateProgressBar(owned, total, PROGRESS_BAR_TEXT, PROGRESS_BAR);
};

const updateOverallTrophyProgress = (carDex, PROGRESS_BAR_TEXT, PROGRESS_BAR) => {
    let owned = 0;
    let total = 0;
    for (const mode in carDex) {
        const slots = generateAllTrophySlots(mode);
        owned += carDex[mode].length;
        total += slots.length;
    }
    updateProgressBar(owned, total, PROGRESS_BAR_TEXT, PROGRESS_BAR);
};

export { updateTrophyProgress, updateOverallTrophyProgress };
