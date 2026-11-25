import { ActivationCost } from 'mana-scribe';
import Sentence from './Sentence.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const CONDITION_ALTERNATIVES = [
    'as this [a-z]+ is turned face up',
    'as (?:an?|each) [^,]+ enters',
    'as you (?:draft [^,]+|create your deck|cast [^,]+)',
    'as an additional cost to cast [^,]+',
    'after that turn',
    'during combat',
    'during that turn',
    'as many times as you choose',
    'while (?:an opponent|you|they) (?:is |are )?searching [^,]+',
    'as this (?:permanent|creature) transforms',
    'during (?:each|any|that) player\'s [^,]+',
    'until (?:that player\'s|their) next end step',
    'until the end of defending player\'s next turn',
    'for any number of opponents',
    'as this [a-z]+ transforms into ~',
    'as this [a-z]+ becomes attached to [^,]+',
    'during (?:turns other than yours|any turn [^,]+|each opponent\'s [^,]+)',
    'during [^,]+(?: upkeep| end step| main phase)',
    'while voting',
    'starting with (?![^,]+, each player votes\\b)[^,]+',
    'until the end of (?:your|their|that player\'s) next turn',
    'until (?:their|that player\'s) next turn',
    'the first time [^,]+',
    'if',
    'as long as',
    'unless',
    'if you do',
    'if you don\'t',
    'otherwise',
    'during your turn',
    'during your next turn',
    'during each of your turns',
    'for each [^,]+',
    'until end of turn',
    'until your next turn',
    'until your next end step',
    'until end of combat',
    'until the end of your next turn',
    'this turn',
    'at the beginning of [^,]+',
    'as ~ enters',
    'as this [a-z]+ enters',
    'as it enters',
    'once each turn',
    'once during each of your turns',
    'for as long as [^,]+',
    'as an additional cost to cast this spell',
    'as long as [^,]+'
];
const CAST_FOR_ALTERNATIVE_COST = /\bcast (this spell|~) for its [a-z]+ cost\b/i;
const SPENT_COLOR = /\{([WUBRG])\}(?:\{\1\})* was spent to cast/;
const KICKED = /\bwas kicked\b/i;
const NAMED_KICKER = /\bkicked with its ((?:\{[^}]+\})+) kicker\b/i;
const THIRD_PERSON_NEXT = /^until (?:the end of )?(?:that player's|their) next turn$/i;
const DURATION = /^(?:until |during (?:your|their) next turn$)/i;
const FOR_EACH = /^for each /i;
const IF_YOU_DO = /^if you do$|^if you [a-z]+ [^,]* this way$/i;
const INTERVENING_IF = /^if (?!you do\b|you don't\b)/i;
const ADDITIONAL_COST = /^as an additional cost to cast this spell/i;
const CONDITION = new RegExp(
    `^(${CONDITION_ALTERNATIVES.join('|')})\\b([^,]*), `, 'i'
);
const POSSIBLE_CONTINUATION = /^(?:and |or |[A-Z][\w-]+(?:,| or ))/;
const COMMA = ', ';

function extendCondition(scribe, text, initial) {
    let stop = initial[0].length;
    const rest = text.slice(stop);
    if (!POSSIBLE_CONTINUATION.test(rest)) return initial;
    while (POSSIBLE_CONTINUATION.test(text.slice(stop))) {
        const next = text.indexOf(COMMA, stop);
        if (next < 0) break;
        stop = next + COMMA.length;
        if (scribe.startsClause(text.slice(stop)))
            return [text.slice(0, stop), initial[1], text.slice(initial[1].length, next)];
    }
    return initial;
}

export default class ConditionalSentence extends Sentence {
    static matchStatement(scribe, text) {
        const match = text.match(CONDITION);
        return match ? extendCondition(scribe, text, match) : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const [, opening, qualifier] = match.statement;
        this.condition = `${opening}${qualifier}`.trim();
        this.castObject = this.parseCastObject();
        this.readClauses(match.rest);
    }

    parseCastObject() {
        const phrase = this.condition.match(CAST_FOR_ALTERNATIVE_COST)?.[1];
        return phrase ? this.parseNext(phrase, PHRASE_PARSERS) : null;
    }

    get referenceSeeds() {
        return [this.castObject].filter(Boolean);
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

    get isThirdPersonNextTurn() {
        return THIRD_PERSON_NEXT.test(this.condition);
    }

    get isDuration() {
        return DURATION.test(this.condition);
    }

    get isForEach() {
        return FOR_EACH.test(this.condition);
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

    get namedKickerColors() {
        const cost = this.condition.match(NAMED_KICKER)?.[1];
        return cost ? ActivationCost.parse(cost).colors : null;
    }

    childContext(context) {
        return { ...super.childContext(context), condition: this };
    }
}
