import Node from '../core/Node.js';

const TRAILING_ALTERNATIVES = [
    'at the end of combat',
    'at the beginning of the (?:next )?(?:upkeep|end step)',
    'after this step',
    'on your next turn',
    'this (?:combat|game)',
    'until you lose a flip',
    'while [^,]+ (?:is|are) on the stack',
    'except the first [^.]+',
    'as though they had haste',
    'using (?:its|their) [a-z-]+ (?:cost|ability)',
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
    'before the game begins',
    'from (?:your|their) opening hand',
    'while [^.]+ is (?:attacking|exiled|on the battlefield)',
    'for every [^.]+',
    'as you cast (?:it|them)',
    'without being played',
    'rounded (?:up|down)',
    'at end of combat',
    'any time (?:you could cast [^.]+|for its [^.]+)',
    'as though [^.]+',
    'as you draft it',
    'whichever is (?:greater|less)',
    'that many times',
    'any time',
    'each time',
    'even if',
    'if able',
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
