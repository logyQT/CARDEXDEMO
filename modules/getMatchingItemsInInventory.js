/**
 * @param {*} inventorySource // The object containing inventory data. Must have the structure { ItemContainer: '{"Items":{"itemsJsons":[{"productId":"exampleId","json":"{}"}]}}' }
 * @param {*} productId // The productId to match
 * @returns
 */

const getMatchingItemsInInventory = (inventorySource, productId) => {
  let items = inventorySource?.ItemContainer?.Items?.itemsJsons || [];
  items = items.filter((item) => item.productId === productId);
  return items;
};
export { getMatchingItemsInInventory };
