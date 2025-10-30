import { walkObjectParseJson } from "../../modules/index.js";

const cSaveObject = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  const content = await file.text();
  let res;
  try {
    res = JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
  }
  if (!res) {
    return null;
  }
  res = walkObjectParseJson(res);
  let SaveObject = { ...res.additional_systems, RuntimeObjects: {} };

  for (const key in res.runtime_objects) {
    SaveObject["RuntimeObjects"][res.runtime_objects[key].object_id] = res.runtime_objects[key].json_content;
  }

  return SaveObject;
};
export { cSaveObject };
