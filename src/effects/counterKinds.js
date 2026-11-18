const MINUS_TOUGHNESS = /\/-\d/;
const PLUS_ONE = '+1/+1';

export function normalizeCounterKind(kind) {
    return kind?.replace('−', '-') ?? null;
}

export function isPlusOneKind(kind) {
    return kind === PLUS_ONE;
}

export function lowersToughness(kind) {
    return MINUS_TOUGHNESS.test(kind ?? '');
}
