import Effect from './Effect.js';

const ASSIGNS = /^assigns? (?:its|their|his|her) combat damage /i;
const MODE = new RegExp(
    '^(?<mode>as though (?:it|they|he|she) (?:weren\'t|were not) blocked'
    + '|as though (?:its|his|her) power were positive'
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
