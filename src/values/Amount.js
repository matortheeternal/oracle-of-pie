import Node from '../core/Node.js';
import { NUMBER_PATTERN, numberValue } from './numberWords.js';

const PREVIOUS_COUNT = '(?:twice |half )?that many';
const COUNT = `(a number of|${PREVIOUS_COUNT}|twice X|${NUMBER_PATTERN}|half|twice)`;
const AMOUNT = new RegExp(`^(up to |at least )?${COUNT}\\b`, 'i');
const PREVIOUS = 'previous';
const SPECIAL = {
    'twice that many': PREVIOUS, 'half that many': PREVIOUS, 'twice x': 'X',
    'that many': PREVIOUS, 'a number of': 'variable', half: 'half', twice: 'double'
};

export default class Amount extends Node {
    static match(scribe, str) {
        return str.match(AMOUNT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const word = match[2].toLowerCase();
        this.value = SPECIAL[word] ?? numberValue(word);
        this.multiplier = word.startsWith('twice ') ? 2 : 1;
        if (word.startsWith('half ')) this.multiplier = 0.5;
        this.isUpTo = Boolean(match[1]?.startsWith('up'));
    }

    get isPrevious() {
        return this.value === PREVIOUS;
    }
}
