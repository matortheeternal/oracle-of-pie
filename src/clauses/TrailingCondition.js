import Parser from '../core/Parser.js';
import Phrase from '../phrases/Phrase.js';
import PhraseList from '../phrases/PhraseList.js';
import QuantityFormula from './QuantityFormula.js';
import TrailingPredicate from './TrailingPredicate.js';

const VARIABLE = /^where (?<variable>[A-Z]) is /i;
const PER_OBJECT = /^for (?:each|every) /i;
const IF = /^(?:only )?if /i;

function markConditionOnly(constraint) {
    for (const [node] of constraint.walk())
        if (node instanceof Phrase) node.markConditionOnly();
}

const CONDITION_FORMS = [
    { kind: 'variable', prefix: VARIABLE, parser: QuantityFormula },
    { kind: 'per-object', prefix: PER_OBJECT, parser: PhraseList },
    { kind: 'predicate', prefix: IF, parser: TrailingPredicate }
];

const TRAILING_ALTERNATIVES = [
    'by (?:it|them|~)',
    'in (?:its|their|your) (?:next combat|next main phase)',
    'until the end of your next turn',
    'until you exile another card with [^.]+',
    'with X counters on it',
    'from your graveyard instead',
    'if it has already attacked this turn',
    'if you could cast a sorcery',
    'each combat if able',
    'for the rest of this game',
    'in turn order',
    'by the result',
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

export default class TrailingCondition extends Parser {
    static match(scribe, str) {
        return str.match(TRAILING);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.text = match[1];
        this.readConstraint();
    }

    readConstraint() {
        for (const { kind, prefix, parser } of CONDITION_FORMS) {
            const lead = this.text.match(prefix);
            if (!lead) continue;
            const constraint = this.parseNext(this.text.slice(lead[0].length), [parser]);
            if (!constraint?.isRecognized || constraint.remainingStr) continue;
            markConditionOnly(constraint);
            this.constraintKind = kind;
            this.variable = lead.groups?.variable ?? null;
            this.constraint = constraint;
            return;
        }
    }

    get children() {
        return [this.constraint].filter(Boolean);
    }
}
