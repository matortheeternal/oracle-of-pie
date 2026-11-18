import TriggerEvent from './TriggerEvent.js';

const CAST = /^(?<subject>.+?) casts? (?<spell>.+)$/i;
const THIS_SPELL = /^(?:this spell|~)\b/i;

export default class CastEvent extends TriggerEvent {
    static get pattern() {
        return CAST;
    }

    constructor(text, match) {
        super(text, match);
        this.spell = match.groups.spell;
    }

    get castsSelf() {
        return THIS_SPELL.test(this.spell);
    }
}
