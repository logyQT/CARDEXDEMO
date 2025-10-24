import { autoUpdate } from "./autoUpdate.js";

let counter = 0;
const folderWatchdog = async (dirHandle) => {
  const prevFiles = new Map();

  const watchFiles = async () => {
    const files = [];
    const changed = [];

    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file") {
        const file = await entry.getFile();
        if (!file.name.includes(".json")) continue;
        files.push({
          name: entry.name,
          handle: entry,
          lastModified: file.lastModified,
          size: file.size,
        });
      }
    }

    files.forEach((f) => {
      if (counter === 0) return;
      const prev = prevFiles.get(f.name);
      if (!prev) {
        changed.push(f);
      } else {
        if (f.lastModified !== prev.lastModified || f.size !== prev.size) {
          changed.push(f);
        }
      }
    });
    if (changed.length > 0) {
      const newestFile = changed
        .map((file) => ({
          file,
          mtime: file.lastModified,
        }))
        .sort((a, b) => b.mtime - a.mtime)[0].file;

      autoUpdate.push(newestFile);
    }
    prevFiles.clear();
    files.forEach((f) => {
      prevFiles.set(f.name, { lastModified: f.lastModified, size: f.size });
    });
    counter++;
  };

  await watchFiles();
  setInterval(watchFiles, 1000);
};

export { folderWatchdog };
