/**
 * Matches a trophy with a slot based on the specified mode.
 * @param {*} slotID - The slot to match against.
 * @param {*} trophy - The trophy to match.
 * @returns {boolean} - True if the trophy matches the slot, false otherwise.
 */

const matchTrophy = (slotID, trophy) => {
    let [smode, sbrand, smodel, syear, scolor, stype] = slotID.replace(/_/g, " ").split("+"); // Assuming slotID format is "mode-brand-model-year-color-type"
    let { brand, model, year, color, type } = trophy;
    brand = brand.toLowerCase();
    model = model.toLowerCase();
    year = year.toString();
    color = color.toLowerCase();
    type = type.toLowerCase();
    if (smode === "model") {
        return sbrand === brand && smodel === model;
    } else if (smode === "year") {
        return sbrand === brand && smodel === model && syear === year;
    } else if (smode === "color") {
        return sbrand === brand && smodel === model && scolor === color && type === "common";
    } else if (smode === "type") {
        return sbrand === brand && smodel === model && stype === type;
    }
    return false;
};

export { matchTrophy };
