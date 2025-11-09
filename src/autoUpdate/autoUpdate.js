class AutoUpdate {
  constructor() {
    this.file = null;
    this.changes = false;
    this.subscribers = [];
  }
  isSubscribed(callback) {
    return this.subscribers.includes(callback);
  }
  subscribe(callback) {
    if (this.isSubscribed(callback)) return;
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((subscriber) => subscriber !== callback);
    };
  }
  notify() {
    this.subscribers.forEach((callback) => callback(this.file));
  }
  push(file) {
    this.file = file;
    this.notify();
  }
}

export const autoUpdate = new AutoUpdate();
