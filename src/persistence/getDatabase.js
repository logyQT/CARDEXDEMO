const getDatabase = async (file) => {
  const SQL = await initSqlJs({
    locateFile: () => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/sql-wasm.wasm`,
  });
  const buffer = await file.arrayBuffer();
  try {
    const db = await new SQL.Database(new Uint8Array(buffer));
    if (!db) {
      console.error("Failed to open the database.");
      return null;
    }
    return db;
  } catch (error) {
    console.error("Error opening database:", error);
    return null;
  }
};

export { getDatabase };
