import CostItem from './CostItem.js';

const TEXT_COST_ALTERNATIVES = [
    'discard (?:a|an|two|three|N|X|\\d+|your hand|this card)[^,:]*',
    'pay (?:\\d+|X|N|an amount of) [^,:]*life',
    'pay \\{[^,:]+',
    'remove [^,:]+ counters? from [^,:]+',
    'mill (?:a card|\\w+ cards)',
    'collect evidence \\d+',
    'forage',
    'exert [^,:]+',
    'reveal [^,:]+',
    'put [^,:]+ counters? on [^,:]+',
    '\\{E\\}+',
    'waterbend \\{[^,:]+',
    'tap (?:an?|\\w+) untapped [^,:]+'
];
const TEXT_COST = new RegExp(
    `^(${TEXT_COST_ALTERNATIVES.join('|')})`, 'i'
);

export default class TextCost extends CostItem {
    static match(scribe, str) {
        return str.match(TEXT_COST);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.text = match[1].toLowerCase();
    }

    get discards() {
        return this.text.startsWith('discard');
    }

    get discardsSelf() {
        return this.text === 'discard this card';
    }
}
