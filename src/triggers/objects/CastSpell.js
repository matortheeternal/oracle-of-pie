import NounPhrase from '../../phrases/NounPhrase.js';
import ZoneModifier from '../../phrases/modifiers/ZoneModifier.js';
import WithModifier from '../../phrases/modifiers/WithModifier.js';
import KeywordModifier from '../../phrases/modifiers/KeywordModifier.js';
import StateModifier from '../../phrases/modifiers/StateModifier.js';
import AdventureModifier from './AdventureModifier.js';

const ORDINALS = { first: 1, second: 2, third: 3, fourth: 4 };
const ORDINAL_PREFIX = new RegExp(
    `^(your|their) (${Object.keys(ORDINALS).join('|')}) `, 'i'
);
const SPELL_MODIFIERS = [
    ZoneModifier, KeywordModifier, WithModifier, StateModifier, AdventureModifier
];

export default class CastSpell extends NounPhrase {
    static match(scribe, str) {
        const prefix = str.match(ORDINAL_PREFIX);
        if (!prefix) return super.match(scribe, str);
        const match = super.match(scribe, str.slice(prefix[0].length));
        if (!match) return null;
        const [, possessor, ordinal] = prefix;
        match[0] = prefix[0] + match[0];
        match.possessor = possessor.toLowerCase();
        match.ordinal = ORDINALS[ordinal.toLowerCase()];
        return match;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.possessor = match.possessor ?? null;
        this.ordinal = match.ordinal ?? null;
        Object.defineProperty(this, 'caster', { value: null, writable: true });
    }

    readModifiers(source, remainingStr) {
        this.remainingStr = remainingStr;
        this.consumeAll(SPELL_MODIFIERS, this.modifiers);
        this.claimSpan(source);
    }

    get controlledByYou() {
        return Boolean(this.caster?.isYou);
    }

    get controlledByOpponent() {
        return Boolean(this.caster?.isOpponent);
    }
}
