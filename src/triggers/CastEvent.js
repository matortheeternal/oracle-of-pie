import TriggerEvent from './TriggerEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import ZoneModifier from '../phrases/modifiers/ZoneModifier.js';
import WithModifier from '../phrases/modifiers/WithModifier.js';

const CAST = /^(?<subject>.+?) casts? (?<spell>this spell|~|.*?\bspells?\b)/i;
const THIS_SPELL = /^(?:this spell|~)$/i;

export default class CastEvent extends TriggerEvent {
    static get pattern() {
        return CAST;
    }

    static get qualifierParsers() {
        return [ZoneModifier, WithModifier, TurnWindow];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.spell = match.groups.spell;
    }

    get isRepeatable() {
        return !this.castsSelf;
    }

    get objectText() {
        if (this.castsSelf) return null;
        const verb = this.isYou ? 'control' : 'controls';
        return `${this.spell} ${this.subject} ${verb}`;
    }

    get castsSelf() {
        return THIS_SPELL.test(this.spell);
    }
}
