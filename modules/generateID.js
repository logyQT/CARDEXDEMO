const generateID = (mode, trophy) => {
    if (!trophy || typeof trophy !== "object") return "";
    return `${mode}+${trophy.brand}+${trophy.model}+${trophy.year}+${trophy.color}+${trophy.type}`.replace(/\s+/g, "_").toLowerCase();
};
export { generateID };
