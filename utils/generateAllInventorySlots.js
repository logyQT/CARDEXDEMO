const generateAllInventorySlots = (trophyInventory) => {
    const slots = [];
    trophyInventory.forEach((trophy) => {
        slots.push({
            name: `${trophy.brand} ${trophy.model}`,
            brand: trophy.brand,
            model: trophy.model,
            owned: "inventory",
            type: trophy.type,
            year: trophy.year,
            color: trophy.color,
        });
    });
    return slots;
};
export { generateAllInventorySlots };
