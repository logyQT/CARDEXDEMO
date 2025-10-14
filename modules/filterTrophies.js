/**
 * Filters trophies based on the given criteria.
 * @param {*} trophies trophies to filter
 * @param {*} criteria criteria to match
 * @returns {[]} filtered trophies
 */

const filterTrophies = (trophies, criteria) => {
    return trophies.filter((trophy) => {
        return Object.entries(criteria).every(([key, value]) => trophy[key] === value);
    });
};

export { filterTrophies };
