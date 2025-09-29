const matchBestTrophy = (slot, mode, trophies) => {
    const trophyPriority = ["Common", "Rust", "Silver", "Gold", "Diamond"];
    let bestTrophy = {};
    let bestTrophyId = null;
    for (const [id, trophy] of Object.entries(trophies)) {
        if (slot.brand === trophy.brand && slot.model === trophy.model) {
            if (!bestTrophy) {
                bestTrophy = trophy;
                bestTrophyId = id;
            } else {
                const currentTypeIdx = trophyPriority.indexOf(bestTrophy.type || "Common");
                const newTypeIdx = trophyPriority.indexOf(trophy.type || "Common");
                if (newTypeIdx > currentTypeIdx) {
                    bestTrophy = trophy;
                    bestTrophyId = id;
                }
            }
        }
    }
    return { bestTrophy, bestTrophyId };
};
