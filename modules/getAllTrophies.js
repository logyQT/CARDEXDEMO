import { getMatchingItemsInInventory, parseTrophyString } from "./index.js";
import { TROPHY_PRODUCT_ID } from "../utils/constants.js";

/**
 *
 * @param {import("./types.js").SaveObjectRoot} SaveObject
 * @returns
 */
const getAllTrophies = (SaveObject) => {
  let trophyInventory = [];
  let items = [];
  // Player owned vehicles loaded in the world
  let playerOwnedVehicles = SaveObject.VehicleSystem.VehicleInfo.filter((v) => v.playerOwned && "Vehicle" in v);
  playerOwnedVehicles.forEach((v) => {
    getMatchingItemsInInventory(v.Vehicle, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));
  });
  // Garage Vehicles
  const garageVehicles = SaveObject.AdditionalGameData.UndergroundGarageCarStorage.VehicleInfo;
  garageVehicles.forEach((v) => {
    getMatchingItemsInInventory(v.garageVehicleJsonData, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));
  });
  // Player Inventory
  getMatchingItemsInInventory({ ItemContainer: SaveObject.Inventory }, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));
  // Player Storage
  getMatchingItemsInInventory({ ItemContainer: SaveObject.PlayerStorage }, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));
  // Trophy Shelf
  getMatchingItemsInInventory(SaveObject.AdditionalGameData.TrophyShelf, TROPHY_PRODUCT_ID).forEach((trophy) => items.push(trophy));
  // Placed Trophies in the world
  for (const object_id in SaveObject.RuntimeObjects) {
    const runtimeObject = SaveObject.RuntimeObjects[object_id];
    if (typeof runtimeObject !== "object" || runtimeObject === undefined) continue;
    if (runtimeObject.ActorClass !== "BP_Trophy_BASE_C") continue;

    trophyInventory.push(parseTrophyString(runtimeObject.customData));
  }

  for (const item_id in items) {
    trophyInventory.push(parseTrophyString(items[item_id].json.customData));
  }
  console.info(`Found ${trophyInventory.length} trophies in save file.`);
  return trophyInventory;
};

export { getAllTrophies };
