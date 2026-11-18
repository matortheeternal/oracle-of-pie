import Effect from './Effect.js';

const NEW_TYPE = '(an? [^,.]+|all colors|legendary|colorless|the chosen [^,.]+)';
const TYPE_CHANGE = new RegExp(`^(?:it's|it is|is|are) ${NEW_TYPE}`, 'i');
const CREATURE = /\bcreatures?\b/i;

export default class TypeChangeEffect extends Effect {
    static get pattern() {
        return TYPE_CHANGE;
    }

    parseArguments(match) {
        this.description = match[1];
    }

    get addsCreatureType() {
        return CREATURE.test(this.description);
    }
}
