/**
 * Get the file path for a trophy image based on its attributes.
 * @param {*} brand - The brand of the car.
 * @param {*} model - The model of the car.
 * @param {*} color - The color of the trophy.
 * @param {*} type - The type of the trophy.
 * @returns {string} The file path for the trophy image.
 */

const getTrophyImage = (brand, model, color, type) => {
    let file = "";
    const folder = (brand + model).replace(/\s+/g, "");
    if (type === "Common" && color !== null) {
        file = `${brand} ${model}`.replace(/\s+/g, "_") + `_Color_${color}.png`;
    } else {
        file = `${brand} ${model}`.replace(/\s+/g, "_") + `_Type_${type}.png`;
    }
    return `./Trophies/Textures/${folder}/${file}`;
};

export { getTrophyImage };
