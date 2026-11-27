export function tally(counts, value) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
}

export function mostCommon(counts) {
    let best = null;
    for (const [value, count] of counts) {
        if (best && counts.get(best) >= count) continue;
        best = value;
    }
    return best;
}
