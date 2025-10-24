class AutoUpdate {
  constructor() {
    this.file = null;
    this.changes = false;
  }
  async push(file) {
    this.file = file;
    this.changes = true;
  }
  async pull() {
    this.changes = false;
    return this.file;
  }
  hasChanges() {
    return this.changes;
  }
}
export const autoUpdate = new AutoUpdate();
