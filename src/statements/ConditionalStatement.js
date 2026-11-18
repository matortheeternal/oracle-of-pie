import Statement from './Statement.js';

const CONDITION_ALTERNATIVES = [
    'if',
    'as long as',
    'unless',
    'when you do(?:, for each [^,]+)?',
    'if you do',
    'if you don\'t',
    'otherwise',
    'during your turn',
    'during each of your turns',
    'for each [^,]+',
    'until end of turn',
    'until your next turn',
    'until the end of your next turn',
    'this turn',
    'at the beginning of [^,]+',
    'as ~ enters',
    'as this [a-z]+ enters',
    'once each turn',
    'once during each of your turns',
    'for as long as [^,]+',
    'as an additional cost to cast this spell',
    'as long as [^,]+'
];
const SPENT_COLOR = /\{([WUBRG])\}(?:\{\1\})* was spent to cast/;
const KICKED = /\bwas kicked\b/i;
const DURATION = /^until /i;
const IF_YOU_DO = /^if you do$|^if you [a-z]+ [^,]* this way$/i;
const INTERVENING_IF = /^if (?!you do\b|you don't\b)/i;
const ADDITIONAL_COST = /^as an additional cost to cast this spell/i;
const CONDITION = new RegExp(
    `^(${CONDITION_ALTERNATIVES.join('|')})\\b([^,]*), `, 'i'
);

export default class ConditionalStatement extends Statement {
    static match(scribe, str) {
        return str.match(CONDITION);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.condition = `${match[1]}${match[2]}`.trim();
        this.clauses = this.consumeClauses();
    }

    get spentColors() {
        const color = this.condition.match(SPENT_COLOR)?.[1];
        return color ? [color] : [];
    }

    get isInterveningIf() {
        return INTERVENING_IF.test(this.condition);
    }

    get isConditional() {
        return !this.isDuration;
    }

    get isDuration() {
        return DURATION.test(this.condition);
    }

    get isIfYouDo() {
        return IF_YOU_DO.test(this.condition);
    }

    get isAdditionalCost() {
        return ADDITIONAL_COST.test(this.condition);
    }

    get requiresKicker() {
        return KICKED.test(this.condition);
    }

    get children() {
        return [this.clauses].filter(Boolean);
    }

    childContext(context) {
        return { ...context, condition: this };
    }
}
