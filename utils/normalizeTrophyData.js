/**
 * Normalizes the trophy data by mapping its properties to the corresponding enums.
 * @param {*} trophy - The trophy data to normalize.
 * @returns {*} - The normalized trophy data.
 */
import { E_CarBrand, E_CarModel, E_TrophyType, E_VehiclePaintColor } from "./mappings.js";
const normalizeTrophyData = (trophy) => {
    return {
        brand: E_CarBrand[trophy.brand] || E_CarBrand["NewEnumerator0"],
        model: E_CarModel[trophy.model] || E_CarModel["NewEnumerator0"],
        color: E_VehiclePaintColor[trophy.paintColor] || E_VehiclePaintColor["NewEnumerator0"],
        type: E_TrophyType[trophy.trophyType] || E_TrophyType["NewEnumerator0"],
        year: parseInt(trophy.productionYear) || 0,
    };
};
export { normalizeTrophyData };
