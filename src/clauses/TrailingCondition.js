import Node from '../core/Node.js';

const TRAILING_ALTERNATIVES = [
    'if',
    'unless',
    'where',
    'for each',
    'as long as',
    'only if',
    'rather than',
    'instead of',
    'this way',
    'at random',
    'this turn',
    'instead',
    'in addition to [^.]+',
    'at the beginning of [^.]+',
    'of (?:their|your) choice'
];
const TRAILING = new RegExp(
    `^(?:,? )?((?:${TRAILING_ALTERNATIVES.join('|')})\\b[^.]*)$`, 'i'
);

export default class TrailingCondition extends Node {
    static match(scribe, str) {
        return str.match(TRAILING);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.text = match[1];
    }
}
