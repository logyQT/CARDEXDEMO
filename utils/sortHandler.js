class SortHandler {
  #sortMap = new Map();

  handlePress(property) {
    const currentOrder = this.#sortMap.get(property);

    if (!currentOrder) {
      this.#sortMap.set(property, "asc");
    } else if (currentOrder === "asc") {
      this.#sortMap.set(property, "desc");
    } else {
      this.#sortMap.delete(property);
    }

    if (this.#sortMap.has(property)) {
      const tempValue = this.#sortMap.get(property);
      this.#sortMap.delete(property);
      this.#sortMap.set(property, tempValue);
    }
  }

  getSortParams() {
    return Array.from(this.#sortMap.entries());
  }

  clearSort() {
    this.#sortMap.clear();
  }
}

export const sortHandler = new SortHandler();
