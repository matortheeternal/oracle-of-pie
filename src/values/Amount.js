import Node from '../core/Node.js';
import { NUMBER_PATTERN, numberValue } from './numberWords.js';

const COUNT = `(a number of|that many|${NUMBER_PATTERN}|half|twice)`;
const AMOUNT = new RegExp(`^(up to |at least )?(twice |half )?${COUNT}\\b`, 'i');
const PREVIOUS = 'previous';
const SPECIAL = {
    'that many': PREVIOUS, 'a number of': 'variable', half: 'half', twice: 'double'
};
const MULTIPLIERS = { twice: 2, half: 0.5 };

export default class Amount extends Node {
    static match(scribe, str) {
        return str.match(AMOUNT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const word = match[3].toLowerCase();
        this.value = SPECIAL[word] ?? numberValue(word);
        this.multiplier = MULTIPLIERS[match[2]?.trim().toLowerCase()] ?? 1;
        this.isUpTo = Boolean(match[1]?.startsWith('up'));
    }

    get isPrevious() {
        return this.value === PREVIOUS;
    }
}
