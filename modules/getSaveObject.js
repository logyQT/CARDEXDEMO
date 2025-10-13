import { walkObjectParseJson } from "./index.js";

/**
 * @param {*} db // SQLite Database Object
 * @description Reads all rows from table_additional_systems and parses the json_content field into a JavaScript object.
 * The resulting object is structured with system_id as keys and parsed JSON content as values.
 * IMPORTANT: Remember to close the database connection after using this function to prevent memory leaks.
 * @returns {import("./types.js").SaveObjectRoot} - The structured object containing parsed JSON content.
 */
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
