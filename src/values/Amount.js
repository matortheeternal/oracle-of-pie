import Node from '../core/Node.js';
import { NUMBER_PATTERN, numberValue } from './numberWords.js';

const COUNT = `(${NUMBER_PATTERN}|that many|half|twice)`;
const AMOUNT = new RegExp(`^(up to |at least )?${COUNT}\\b`, 'i');
const SPECIAL = { 'that many': 'previous', half: 'half', twice: 'double' };

export default class Amount extends Node {
    static match(scribe, str) {
        return str.match(AMOUNT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const word = match[2].toLowerCase();
        this.value = SPECIAL[word] ?? numberValue(word);
        this.isUpTo = Boolean(match[1]?.startsWith('up'));
    }
}
