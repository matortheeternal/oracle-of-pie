export const NUMBER_WORDS = {
    a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
    eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fifteen: 15,
    twenty: 20
};

export const NUMBER_PATTERN = `(?:${Object.keys(NUMBER_WORDS).join('|')}|\\d+|X)`;

export function numberValue(word) {
    const lower = word.toLowerCase();
    if (Object.hasOwn(NUMBER_WORDS, lower)) return NUMBER_WORDS[lower];
    if (lower === 'x') return 'X';
    return Number(lower);
}
