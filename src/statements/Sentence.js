import Parser from '../core/Parser.js';
import { STATEMENT_PARSERS } from './index.js';

const SENTENCE = /^((?:"[^"]*"|[^."]|\.(?=\d))+)(?:\.|$)/;
const THEN = /^then,? /i;
const X_FROM_CREATURE_STATS = /\bwhere X is [^.]*\b(?:power|toughness)\b/i;

export default class Sentence extends Parser {
    static match(scribe, str) {
        return str.match(SENTENCE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const text = match[1].trim();
        this.followsPrevious = THEN.test(text);
        this.statement = this.parseNext(text.replace(THEN, ''), STATEMENT_PARSERS);
    }

    get children() {
        return [this.statement].filter(Boolean);
    }

    link(previous, next) {
        this.previous = previous ?? null;
        this.next = next ?? null;
    }

    get definesXByCreatureStats() {
        return X_FROM_CREATURE_STATS.test(this.raw);
    }

    get dependsOnPrevious() {
        return Boolean(this.statement?.isIfYouDo && this.previous);
    }

    get effects() {
        return this.statement?.effects ?? [];
    }

    get linkedEffects() {
        const previous = this.dependsOnPrevious ? this.previous.effects : [];
        const next = this.next?.dependsOnPrevious ? this.next.effects : [];
        return [...previous, ...this.effects, ...next];
    }

    childContext(context) {
        return { ...context, sentence: this };
    }
}
