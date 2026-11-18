import Effect from './Effect.js';

const CANT_ALTERNATIVES = [
    'attack or block',
    'attack',
    'block',
    'be blocked',
    'be countered',
    'be the targets? of [^,.]+',
    'untap during [^,.]+',
    'transform',
    'be sacrificed',
    'cast [^,.]+',
    'gain life',
    'lose the game',
    'win the game',
    'activate [^,.]+'
];
const CANT_QUALIFIERS = [
    'this turn',
    'alone',
    'except by [^,.]+',
    'by [^,.]+',
    'unless [^,.]+',
    'during [^,.]+',
    'more than [^,.]+'
];
const CANT = new RegExp(
    `^(?:can't|cannot|doesn't|don't) (${CANT_ALTERNATIVES.join('|')})`
        + `(?: (?:${CANT_QUALIFIERS.join('|')}))*`,
    'i'
);

export default class CantEffect extends Effect {
    static get pattern() {
        return CANT;
    }

    parseArguments(match) {
        this.restriction = match[1].toLowerCase();
    }
}
