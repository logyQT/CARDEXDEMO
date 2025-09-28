/**
 * Recursively walks through an object and parses any JSON strings.
 * @param {*} obj - The object to walk through.
 * @returns {*} - The parsed object.
 */

const walkObjectParseJson = (obj) => {
    if (obj == null) return obj;

    if (typeof obj === "string") {
        if (obj.length && (obj[0] === "{" || obj[0] === "[")) {
            try {
                const parsed = JSON.parse(obj);
                return walkObjectParseJson(parsed);
            } catch {
                return obj;
            }
        }
        return obj;
    }

    if (typeof obj !== "object") return obj;

    const keys = Array.isArray(obj) ? obj.keys() : Object.keys(obj);
    for (const key of keys) {
        obj[key] = walkObjectParseJson(obj[key]);
    }

    return obj;
};
export { walkObjectParseJson };
