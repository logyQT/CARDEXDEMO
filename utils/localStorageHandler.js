const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
};

const loadFromLocalStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("Error loading from localStorage", e);
        return null;
    }
};

const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error("Error removing from localStorage", e);
    }
};

export { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage };
