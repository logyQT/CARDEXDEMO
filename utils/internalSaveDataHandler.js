/**
 * Creates an internal save data object.
 * @param {*} versionNumber // self-explanatory
 * @param {*} carDex // Array of car objects
 * @param {*} trophyInventory // Array of trophy objects
 * @returns {Object} Internal save data object
 */

const createInternalSaveData = (versionNumber, carDex, trophyInventory) =>{
    return {
        version: versionNumber,
        timestamp: Date.now(),
        carDex: carDex,
        trophyInventory: trophyInventory
    };
};

const readInternalSaveData = (data) => {
    if (!data || typeof data !== "object") {
        console.error("Invalid data format");
        return null;
    }
    const { version, timestamp, carDex, trophyInventory } = data;
    if (typeof version !== "string" || typeof timestamp !== "number" || typeof carDex !== "object" || !Array.isArray(trophyInventory)) {
        console.error("Missing or invalid fields in data");
        return null;
    }
    return {
        version,
        timestamp,
        carDex,
        trophyInventory
    };
};

const validateInternalSaveData = (data, ver) => {
    if (!data || typeof data !== "object") {
        return false;
    }

    const { version, timestamp, carDex, trophyInventory } = data;
    if (
        typeof version !== "string" ||
        typeof timestamp !== "number" ||
        typeof carDex !== "object" ||
        !Array.isArray(trophyInventory)
    ) {
        return false;
    }

    return ver === version;
};

export { createInternalSaveData, readInternalSaveData, validateInternalSaveData };