const wordDatabase = {
    brand: ["Apex Motors", "Ardena", "Cargo Wise", "Cavallaro", "Harmonia Vehicles", "NGD", "Off Rider", "Phantom", "UMX", "Zen Motors"],
    model: ["Striker", "Vanguard", "Ignis", "P2", "P3", "P4", "280G", "Allegretto", "Andante", "Largo", "Pulse", "Boulder", "Canyon", "Ridge", "Cortega", "Gale", "Thunder", "ThunderX", "Voyager", "600C", "Journey"],
    type: ["common", "rust", "silver", "gold", "diamond"],
    color: ["Black", "Silver", "Red", "Blue", "Purple", "NavyBlue", "White", "Gray", "Gold", "Green", "Brown", "Orange", "Yellow", "Graphite", "Light-Blue", "Light-Green"],
};

const parseSearchString = (searchString) => {
    const regex = /"([^"]+)"|(\S+)/g;
    const tokens = [];
    let match;
    while ((match = regex.exec(searchString)) !== null) {
        tokens.push((match[1] || match[2]).toLowerCase());
    }
    return tokens;
};

const matchTokenToDatabase = (token, db) => {
    for (const [key, values] of Object.entries(db)) {
        const match = values.find((v) => v.toLowerCase().includes(token));
        if (match) return [key, match];
    }
    if (["owned", "have", "mine"].includes(token)) return ["owned", true];
    if (["unowned", "missing", "need"].includes(token)) return ["owned", false];
    return null;
};

const parseYearExpression = (token) => {
    const rangeRegex = /(\d{4})\s*[-–.]{1,2}\s*(\d{4})/;
    const compareRegex = /^(>=|<=|>|<)\s*(\d{4})$/;
    const exactRegex = /^\d{4}$/;
    if (rangeRegex.test(token)) {
        const [, start, end] = token.match(rangeRegex);
        return { type: "range", start: +start, end: +end };
    }
    if (compareRegex.test(token)) {
        const [, op, year] = token.match(compareRegex);
        return { type: "compare", op, year: +year };
    }
    if (exactRegex.test(token)) {
        return { type: "exact", year: +token };
    }
    return null;
};

const buildCriteria = (tokens, db) => {
    const criteria = {};
    for (const token of tokens) {
        const yearExpr = parseYearExpression(token);
        if (yearExpr) {
            (criteria.year ??= []).push(yearExpr);
            continue;
        }
        const match = matchTokenToDatabase(token, db);
        if (match) {
            const [key, value] = match;
            (criteria[key] ??= []).push(value);
            continue;
        }
        (criteria.name ??= []).push(token);
    }
    return criteria;
};

const matchesYear = (trophy, yearExprs) => {
    const year = trophy.year;
    if (year == null) return false;
    return yearExprs.some((expr) => {
        switch (expr.type) {
            case "exact":
                return year === expr.year;
            case "range":
                return year >= expr.start && year <= expr.end;
            case "compare":
                if (expr.op === ">") return year > expr.year;
                if (expr.op === "<") return year < expr.year;
                if (expr.op === ">=") return year >= expr.year;
                if (expr.op === "<=") return year <= expr.year;
                return false;
            default:
                return false;
        }
    });
};

const filterTrophies = (trophies, criteria) => {
    return trophies.filter((trophy) =>
        Object.entries(criteria).every(([key, values]) => {
            if (key === "year") return matchesYear(trophy, values);
            if (key === "owned") return values.includes(trophy.owned);

            const field = trophy[key];
            if (field == null) return false;
            return values.some((val) => String(field).toLowerCase().includes(String(val).toLowerCase()));
        })
    );
};

const smartSearch = (searchString, trophies, db = wordDatabase) => {
    const tokens = parseSearchString(searchString);
    const criteria = buildCriteria(tokens, db);

    const dataArray = Array.isArray(trophies) ? trophies : Object.values(trophies);

    return filterTrophies(dataArray, criteria);
};

export { smartSearch };
