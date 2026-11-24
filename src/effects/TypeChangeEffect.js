import Effect from './Effect.js';

const ADDITIONAL_TYPES = '(?:(?:,(?: and)? \\w+)+(?=\\.|$))?';
const TYPE_ALTERNATIVES = [
    `(?:also )?an? (?:"[^"]*"|[^,."])+${ADDITIONAL_TYPES}`,
    'every (?:basic land|creature) type(?: in addition to their other types)?',
    'all creature types', '\\w+(?: \\w+)? in addition to their other types',
    'all colors', 'legendary', 'colorless', 'the chosen [^,.]+'
];
const NEW_TYPE = `(${TYPE_ALTERNATIVES.join('|')})`;
const SUBJECT_VERB = '(?:it\'s|it is|is|are|they\'re|they are)';
const TYPE_CHANGE = new RegExp(`^${SUBJECT_VERB} ${NEW_TYPE}`, 'i');
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
