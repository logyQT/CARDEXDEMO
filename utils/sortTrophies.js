const sortTrophies = (trophies, criterion) => {
    if (Array.isArray(criterion)) {
        const criteria = criterion;
        const compare = (a, b) => {
            for (let c of criteria) {
                let result = 0;
                switch (c) {
                    case 'type':
                        const typeOrder = { diamond: 0, gold: 1, silver: 2, rust: 3, common: 4 };
                        result = typeOrder[a.type.toLowerCase()] - typeOrder[b.type.toLowerCase()];
                        break;
                    case 'brand':
                        result = a.brand.localeCompare(b.brand);
                        break;
                    case 'model':
                        result = a.model.localeCompare(b.model);
                        break;
                    case 'year':
                        result = b.year - a.year;
                        break;
                    case 'color':
                        result = a.color.localeCompare(b.color);
                        break;
                }
                if (result !== 0) return result;
            }
            return 0;
        };
        return [...trophies].sort(compare);
    }
    const sorted = [...trophies];
    switch (criterion) {
        case 'type':
            const typeOrder = { diamond: 0, gold: 1, silver: 2, rust: 3, common: 4 };
            sorted.sort((a, b) => typeOrder[a.type.toLowerCase()] - typeOrder[b.type.toLowerCase()]);
            break;
        case 'brand':
            sorted.sort((a, b) => a.brand.localeCompare(b.brand));
            break;
        case 'model':
            sorted.sort((a, b) => a.model.localeCompare(b.model));
            break;
        case 'year':
            sorted.sort((a, b) => b.year - a.year);
            break;
    }
    return sorted;
};
export { sortTrophies };