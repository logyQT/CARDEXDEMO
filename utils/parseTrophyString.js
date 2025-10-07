import { normalizeTrophyData } from "./index.js";
const parseTrophyString = (str) => {
    const inside = str.match(/\((.*)\)/)?.[1];
    if (!inside) {
        console.warn("Invalid trophy string format:", str);
        return;
    }

    const entries = inside.split(",");

    const obj = {};
    for (const entry of entries) {
        const [rawKey, value] = entry.split("=");
        if (!rawKey || !value) continue;

        const cleanKey = rawKey.split("_")[0];

        const key = cleanKey.charAt(0).toLowerCase() + cleanKey.slice(1);

        obj[key] = value;
    }

    return normalizeTrophyData(obj);
};
export { parseTrophyString };
