import Effect from './Effect.js';

const MODE_COUNT_ALTERNATIVES = [
    'one or more', 'one or both', 'any number', 'up to \\w+',
    '\\w+ or both', '\\w+ or more',
    'one', 'two', 'three', 'four', 'five', 'both', 'all', 'x'
];
const MODE_COUNT = MODE_COUNT_ALTERNATIVES.join('|');
const NOT_CHOSEN = '(?: that hasn\'t been chosen(?: this turn)?)?';
const MODE_END = `${NOT_CHOSEN}(?:(?: [^—,.]*)? ?—| instead\\b|(?=\\.|$))`;
const CHOOSE_MODES = new RegExp(`^choose (${MODE_COUNT})${MODE_END}`, 'i');
const SINGLE_MODE = 'one';

export default class ChooseModesEffect extends Effect {
    static get pattern() {
        return CHOOSE_MODES;
    }

    parseArguments(match) {
        this.modeCount = match[1].toLowerCase();
    }

    get choosesMultipleModes() {
        return this.modeCount !== SINGLE_MODE;
    }
}
