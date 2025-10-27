import { openDB } from "https://cdn.jsdelivr.net/npm/idb@8/+esm";

const dbPromise = openDB("handles-db", 1, {
  upgrade(db) {
    db.createObjectStore("dir-handles");
  },
});
export const saveDirHandle = async (key, handle) => {
  const db = await dbPromise;
  await db.put("dir-handles", handle, key);
};
export const getDirHandle = async (key) => {
  const db = await dbPromise;
  return await db.get("dir-handles", key);
};
