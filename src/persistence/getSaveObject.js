import { walkObjectParseJson } from "../utils/walkObjectParseJson.js";

const getSaveObject = (db) => {
  let SaveObject = {};
  db.each(`SELECT * FROM table_additional_systems`, (row) => {
    SaveObject[row.system_id] = walkObjectParseJson(row.json_content);
  });
  SaveObject["RuntimeObjects"] = {};
  db.each(`SELECT * FROM table_runtime_objects`, (row) => {
    SaveObject["RuntimeObjects"][row.object_id] = walkObjectParseJson(row.json_content);
  });
  return SaveObject;
};

export { getSaveObject };
