/**
 * Initializes and returns a SQL.js database instance from the provided file.
 * @param {File} file - The file object representing the SQLite database.
 * @returns {Promise<SQL.Database|null>} - A promise that resolves to the SQL.js Database instance or null if an error occurs.
 */

const getDatabase = async (file) => {
    const SQL = await initSqlJs({
        locateFile: (f) => `../libs/sqljs/${f}`,
    });

    const buffer = await file.arrayBuffer();

    const db = await new SQL.Database(new Uint8Array(buffer));
    if (!db) {
        console.error("Failed to open the database.");
        return null;
    }
    return db;
};
export { getDatabase };
