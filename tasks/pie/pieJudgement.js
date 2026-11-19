const SEVERITY_WORDS = { 'warning': 'break', 'weak-warning': 'bend' };

export function severityWord(flag) {
    return SEVERITY_WORDS[flag.severity];
}

export function judgementOf(flag) {
    const offending = flag.offending.join('');
    return `${flag.colors} ${flag.policy}, ${severityWord(flag)} in ${offending}`;
}

export function judgementOfAll(flags) {
    if (flags.length === 0) return null;
    return [...new Set(flags.map(judgementOf))].sort().join('; ');
}
