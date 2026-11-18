import TriggerEvent from './TriggerEvent.js';

const CAST = /^(?<subject>.+?) casts? (?<spell>.+)$/i;
const THIS_SPELL = /^(?:this spell|~)\b/i;
const SPELL_HEAD = /^.*?\bspells?\b/i;

export default class CastEvent extends TriggerEvent {
    static get pattern() {
        return CAST;
    }

    constructor(text, match) {
        super(text, match);
        this.spell = match.groups.spell;
    }

    get isRepeatable() {
        return !this.castsSelf;
    }

    get objectPhrase() {
        if (this.castsSelf) return null;
        const verb = this.isYou ? 'control' : 'controls';
        const head = this.spell.match(SPELL_HEAD)?.[0] ?? this.spell;
        return `${head} ${this.subject} ${verb}`;
    }

    get castsSelf() {
        return THIS_SPELL.test(this.spell);
    }
}
