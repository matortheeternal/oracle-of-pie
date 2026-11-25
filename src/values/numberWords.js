export const NUMBER_WORDS = {
    a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
    eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
    fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
    'one hundred': 100
};

const NUMBER_NAMES = Object.keys(NUMBER_WORDS).sort((a, b) => b.length - a.length);
export const NUMBER_PATTERN = `(?:${NUMBER_NAMES.join('|')}|\\d+|X)`;

export function numberValue(word) {
    const lower = word.toLowerCase();
    if (Object.hasOwn(NUMBER_WORDS, lower)) return NUMBER_WORDS[lower];
    if (lower === 'x') return 'X';
    return Number(lower);
}
