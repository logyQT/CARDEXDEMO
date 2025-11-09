import { toastManager } from "../../utils/toastManager.js";
import { autoUpdate } from "./autoUpdate.js";

class FolderWatchdog {
  constructor() {
    this.dirHandle = null;
    this.prevFiles = new Map();
    this.watching = false;
    this.intervalID = null;
  }

  startWatching() {
    if (this.watching) return;
    this.watching = true;
    this.watchFiles();
    this.intervalID = setInterval(() => this.watchFiles(), 1000);
  }

  stopWatching() {
    this.watching = false;
    clearInterval(this.intervalID);
  }

  setDirectoryHandle(dirHandle) {
    this.dirHandle = dirHandle;
    this.prevFiles.clear();
  }

  async validDirectory() {
    try {
      let permissionStatus = await this.dirHandle.queryPermission();
      if (permissionStatus === "granted") return true;
      throw new Error("No permission");
    } catch (err) {
      throw new Error("Invalid directory");
    }
  }

  async watchFiles() {
    if (!this.watching || !this.dirHandle) return;
    try {
      await this.validDirectory();
    } catch (err) {
      toastManager.push("Folder access revoked or invalid. Auto-update stopped.", 6000, "error");
      this.stopWatching();
      return;
    }
    const files = [];
    const changed = [];

    for await (const entry of this.dirHandle.values()) {
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
      const prev = this.prevFiles.get(f.name);
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
    this.prevFiles.clear();
    files.forEach((f) => {
      this.prevFiles.set(f.name, { lastModified: f.lastModified, size: f.size });
    });
  }
}

export const folderWatchdog = new FolderWatchdog();
