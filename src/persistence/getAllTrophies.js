import { parseTrophyString } from "../core/trophyParsing.js";
import { TROPHY_PRODUCT_ID } from "../constants.js";

const getMatchingItemsInInventory = (inventorySource, productId) =>
  (inventorySource?.ItemContainer?.Items?.itemsJsons || []).filter((item) => item.productId === productId);

const getAllTrophies = (SaveObject) => {
  let trophyInventory = [];
  let items = [];
  let itemOrigins = [];

  const playerOwnedVehicles = SaveObject.VehicleSystem.VehicleInfo.filter((v) => v.playerOwned && "Vehicle" in v);
  playerOwnedVehicles.forEach((v) => {
    const matchedTrophies = getMatchingItemsInInventory(v.Vehicle, TROPHY_PRODUCT_ID);
    if (matchedTrophies.length > 0) itemOrigins.push(`Found ${matchedTrophies.length} trophies in player owned vehicle id:${v.carId}`);
    items.push(...matchedTrophies);
  });

  const garageVehicles = SaveObject.AdditionalGameData.UndergroundGarageCarStorage.VehicleInfo;
  garageVehicles.forEach((v) => {
    const matchedTrophies = getMatchingItemsInInventory(v.garageVehicleJsonData, TROPHY_PRODUCT_ID);
    if (matchedTrophies.length > 0) itemOrigins.push(`Found ${matchedTrophies.length} trophies in garage vehicle id:${v.carId}`);
    items.push(...matchedTrophies);
  });

  const collect = (source, label) => {
    const matchedTrophies = getMatchingItemsInInventory(source, TROPHY_PRODUCT_ID);
    if (matchedTrophies.length > 0) itemOrigins.push(`Found ${matchedTrophies.length} trophies in ${label}`);
    items.push(...matchedTrophies);
  };
  collect({ ItemContainer: SaveObject.Inventory }, "player inventory");
  collect({ ItemContainer: SaveObject.PlayerStorage }, "player storage");
  collect(SaveObject.AdditionalGameData.TrophyShelf, "trophy shelf");

  for (const object_id in SaveObject.RuntimeObjects) {
    const runtimeObject = SaveObject.RuntimeObjects[object_id];
    if (typeof runtimeObject !== "object" || runtimeObject === undefined) continue;
    if (!runtimeObject.ActorClass.includes("BP_Trophy_BASE_C")) continue;
    if (!("customData" in runtimeObject)) continue;
    trophyInventory.push(parseTrophyString(runtimeObject.customData));
  }

  for (const item of items) {
    trophyInventory.push(parseTrophyString(item.json.customData));
  }

  trophyInventory = Array.from(new Map(trophyInventory.map((t) => [JSON.stringify(t), t])).values());
  console.info(`Found ${trophyInventory.length} unique trophies in save file.`);
  return trophyInventory;
};

export { getAllTrophies };
