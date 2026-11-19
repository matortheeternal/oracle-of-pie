import Parser from '../core/Parser.js';
import { trimLeadingSpace } from '../core/Node.js';
import { NotImplementedError } from '../core/customErrors.js';
import ClauseReader from '../clauses/ClauseReader.js';

const SENTENCE = /^((?:"[^"]*"|[^."]|\.(?=\d))+)(?:\.|$)/;
const THEN = /^then,? /i;
const X_FROM_CREATURE_STATS = /\bwhere X is [^.]*\b(?:power|toughness)\b/i;

function sentenceMatch(sentence, text, statement) {
    const body = text.replace(THEN, '');
    return Object.assign([sentence], {
        statement,
        followsPrevious: THEN.test(text),
        rest: trimLeadingSpace(body.slice(statement[0].length))
    });
}

export default class Sentence extends Parser {
    static match(scribe, str) {
        const sentence = str.match(SENTENCE);
        if (!sentence) return null;
        const text = sentence[1].trim();
        const statement = this.matchStatement(scribe, text.replace(THEN, ''));
        return statement ? sentenceMatch(sentence[0], text, statement) : null;
    }

    static matchStatement(scribe, text) {
        throw new NotImplementedError('matchStatement');
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.followsPrevious = match.followsPrevious;
        this.clauseEffects = [];
        this.trailingCondition = null;
        this.unrecognized = null;
    }

    readClauses(text) {
        const reader = ClauseReader.read(this.scribe, text);
        this.clauseEffects = reader.clauseEffects;
        this.trailingCondition = reader.condition;
        this.unrecognized = reader.unrecognized;
    }

    link(previous, next) {
        this.previous = previous ?? null;
        this.next = next ?? null;
    }

    get children() {
        const children = [...this.effects, this.trailingCondition, this.unrecognized];
        return children.filter(Boolean);
    }

    get effects() {
        return this.clauseEffects.filter(Boolean);
    }

    get hasEffectlessClause() {
        return this.clauseEffects.includes(null);
    }

    get isRecognized() {
        return !this.hasEffectlessClause && super.isRecognized;
    }

    get definesXByCreatureStats() {
        return X_FROM_CREATURE_STATS.test(this.raw);
    }

    get dependsOnPrevious() {
        return Boolean(this.isIfYouDo && this.previous);
    }

    get antecedentEffects() {
        return this.previous?.effects ?? [];
    }

    get linkedEffects() {
        const previous = this.dependsOnPrevious ? this.antecedentEffects : [];
        const next = this.next?.dependsOnPrevious ? this.next.effects : [];
        return [...previous, ...this.effects, ...next];
    }

    get isInterveningIf() {
        return false;
    }

    get isAdditionalCost() {
        return false;
    }

    get isIfYouDo() {
        return false;
    }

    get limitsToOnce() {
        return false;
    }

    get limitsUses() {
        return false;
    }

    get isConditional() {
        return false;
    }

    childContext(context) {
        return { ...context, sentence: this };
    }
}
