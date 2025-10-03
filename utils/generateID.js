const generateID = (mode, trophy) => {
    if (!trophy || typeof trophy !== 'object') return '';

    if (mode === "model" && trophy.model && trophy.brand) {
        return `model-${trophy.brand}-${trophy.model}`.replace(/\s+/g, '').toLowerCase();
    } else if (mode === "year" && trophy.year && trophy.model && trophy.brand) {
        return `year-${trophy.brand}-${trophy.model}-${trophy.year}`.replace(/\s+/g, '').toLowerCase();
    } else if (mode === "color" && trophy.color && trophy.model && trophy.brand) {
        return `color-${trophy.brand}-${trophy.model}-${trophy.color}`.replace(/\s+/g, '').toLowerCase();
    } else if (mode === "type" && trophy.type && trophy.model && trophy.brand) {
        return `type-${trophy.brand}-${trophy.model}-${trophy.type}`.replace(/\s+/g, '').toLowerCase();
    }
    console.warn("Invalid mode or missing trophy properties");
    return null;
}

export { generateID };
