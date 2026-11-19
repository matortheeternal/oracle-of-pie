import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

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
const UNBLOCKABLE = /^can't be blocked(?! by)(?![^.]*\bexcept\b)/i;
const NEXT_UNTAP = /^untap during [^,.]*\bnext\b/;
const EXCEPT_BY = /\bexcept by ([^,.]+)/i;
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
        this.exceptionText = match[0].match(EXCEPT_BY)?.[1] ?? null;
        this.excepted = this.parseExcepted();
    }

    parseExcepted() {
        if (!this.exceptionText || !PhraseList.match(this.scribe, this.exceptionText))
            return null;
        const list = PhraseList.parse(this.scribe, [''], this.exceptionText);
        return list.remainingStr.trim() ? null : list;
    }

    get parts() {
        return [this.excepted].filter(Boolean);
    }

    get exceptedBy() {
        return this.excepted?.phrases ?? [];
    }

    get makesUnblockable() {
        return UNBLOCKABLE.test(this.raw);
    }

    get preventsNextUntap() {
        return NEXT_UNTAP.test(this.restriction);
    }
}
