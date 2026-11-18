import Effect from './Effect.js';

const ANY_MANA = 'as though it were mana of any (color|type)';
const SPEND_MANA = new RegExp(`^spend mana ${ANY_MANA}(?: to [^,.]+)?`, 'i');

export default class SpendManaEffect extends Effect {
    static get pattern() {
        return SPEND_MANA;
    }

    parseArguments(match) {
        this.flexibility = match[1].toLowerCase();
    }
}
