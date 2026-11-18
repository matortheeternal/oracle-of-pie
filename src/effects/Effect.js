import Parser from '../core/Parser.js';
import Duration from '../values/Duration.js';
import PhraseList from '../phrases/PhraseList.js';
import { NotImplementedError } from '../core/customErrors.js';

const LEADING_SPACE = /^\s+/;

export default class Effect extends Parser {
    static get pattern() {
        throw new NotImplementedError('pattern');
    }

    static match(scribe, str) {
        return str.match(this.pattern);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.subject = null;
        this.isOptional = false;
        this.parseArguments(match);
        this.duration = this.consumeDuration();
    }

    parseArguments(match) {
    }

    consumeDuration() {
        const start = this.remainingStr;
        this.consumeText(LEADING_SPACE);
        const duration = this.consume([Duration]);
        if (!duration) this.remainingStr = start;
        return duration;
    }

    consumeObjects() {
        return this.consume([PhraseList]);
    }

    get parts() {
        return [];
    }

    get isComplete() {
        return true;
    }

    get children() {
        return [this.subject, ...this.parts, this.duration].filter(Boolean);
    }

    get isRecognized() {
        return this.isComplete && super.isRecognized;
    }

    get isOpaque() {
        return false;
    }

    get isExile() {
        return false;
    }

    get removesPermanently() {
        return false;
    }

    get returnsToBattlefield() {
        return false;
    }

    get subjectIsOpponent() {
        return Boolean(this.subject?.isPlayer && this.subject.canBeOpponent);
    }

    get affectsYou() {
        return !this.subject || Boolean(this.subject.includesYou);
    }

    get subjectIsYou() {
        return !this.subject || Boolean(this.subject.isPlayer && this.subject.isYou);
    }
}
