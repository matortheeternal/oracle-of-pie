import Effect from './Effect.js';

const ASSIGNS = /^assigns? (?:its|their) combat damage /i;
const MODE = new RegExp(
    '^(?<mode>as though (?:it|they) (?:weren\'t|were not) blocked'
    + '|equal to (?:its|their) toughness rather than (?:its|their) power)\\b', 'i'
);

export default class SetCombatDamageEffect extends Effect {
    static get pattern() {
        return ASSIGNS;
    }

    parseArguments() {
        this.mode = this.consumeText(MODE)?.groups.mode.toLowerCase() ?? null;
    }

    get isComplete() {
        return Boolean(this.mode);
    }
}
