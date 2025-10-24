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
  let itemOrigins = [];
  // Player owned vehicles loaded in the world
  let playerOwnedVehicles = SaveObject.VehicleSystem.VehicleInfo.filter((v) => v.playerOwned && "Vehicle" in v);
  playerOwnedVehicles.forEach((v) => {
    const matchedTrophies = getMatchingItemsInInventory(v.Vehicle, TROPHY_PRODUCT_ID);
    if (matchedTrophies.length > 0) itemOrigins.push(`Found ${matchedTrophies.length} trophies in player owned vehicle id:${v.carId}`);
    matchedTrophies.forEach((trophy) => items.push(trophy));
  });
  // Garage Vehicles
  const garageVehicles = SaveObject.AdditionalGameData.UndergroundGarageCarStorage.VehicleInfo;
  garageVehicles.forEach((v) => {
    const matchedTrophies = getMatchingItemsInInventory(v.garageVehicleJsonData, TROPHY_PRODUCT_ID);
    if (matchedTrophies.length > 0) itemOrigins.push(`Found ${matchedTrophies.length} trophies in garage vehicle id:${v.carId}`);
    matchedTrophies.forEach((trophy) => items.push(trophy));
  });
  // Player Inventory
  const matchedInventoryTrophies = getMatchingItemsInInventory({ ItemContainer: SaveObject.Inventory }, TROPHY_PRODUCT_ID);
  if (matchedInventoryTrophies.length > 0) itemOrigins.push(`Found ${matchedInventoryTrophies.length} trophies in player inventory`);
  matchedInventoryTrophies.forEach((trophy) => items.push(trophy));
  // Player Storage
  const matchedStorageTrophies = getMatchingItemsInInventory({ ItemContainer: SaveObject.PlayerStorage }, TROPHY_PRODUCT_ID);
  if (matchedStorageTrophies.length > 0) itemOrigins.push(`Found ${matchedStorageTrophies.length} trophies in player storage`);
  matchedStorageTrophies.forEach((trophy) => items.push(trophy));
  // Trophy Shelf
  const matchedShelfTrophies = getMatchingItemsInInventory(SaveObject.AdditionalGameData.TrophyShelf, TROPHY_PRODUCT_ID);
  if (matchedShelfTrophies.length > 0) itemOrigins.push(`Found ${matchedShelfTrophies.length} trophies in trophy shelf`);
  matchedShelfTrophies.forEach((trophy) => items.push(trophy));
  // Placed Trophies in the world
  let matchedWorldTrophies = [];
  for (const object_id in SaveObject.RuntimeObjects) {
    const runtimeObject = SaveObject.RuntimeObjects[object_id];
    if (typeof runtimeObject !== "object" || runtimeObject === undefined) continue;
    if (!runtimeObject.ActorClass.includes("BP_Trophy_BASE_C")) continue;
    if (!("customData" in runtimeObject)) continue;

    matchedWorldTrophies.push(parseTrophyString(runtimeObject.customData));
  }
  if (matchedWorldTrophies.length > 0) itemOrigins.push(`Found ${matchedWorldTrophies.length} trophies placed in the world`);
  matchedWorldTrophies.forEach((trophy) => trophyInventory.push(trophy));

  for (const item_id in items) {
    trophyInventory.push(parseTrophyString(items[item_id].json.customData));
  }

  trophyInventory = Array.from(new Map(trophyInventory.map((t) => [JSON.stringify(t), t])).values());

  console.info(`Found ${trophyInventory.length} unique trophies in save file.`);
  return trophyInventory;
};

export { getAllTrophies };
