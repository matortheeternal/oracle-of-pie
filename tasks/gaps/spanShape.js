const QUOTED = /"[^"]*"/g;
const MANA = /(?:\{[^}]+\})+/g;
const NUMBER = /\b(?:\d+|x|one|two|three|four|five|six|seven|eight|nine|ten|twice)\b/g;
const SPACE = /\s+/g;
const FAMILY_WORDS = 2;

export function spanShape(span) {
    return span.toLowerCase()
        .replace(QUOTED, '"…"')
        .replace(MANA, '{M}')
        .replace(NUMBER, 'N')
        .replace(SPACE, ' ')
        .trim();
}

export function shapeFamily(shape) {
    return shape.split(' ').slice(0, FAMILY_WORDS).join(' ');
}
