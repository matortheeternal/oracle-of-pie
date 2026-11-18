import ObjectEffect from './ObjectEffect.js';

const EXILE = /^exiles? /i;
const EXILE_TAIL_ALTERNATIVES = [
    'face down',
    'instead',
    'at random',
    'until ~ leaves the battlefield',
    'until [^,.]+ leaves the battlefield'
];
const EXILE_TAIL = new RegExp(
    `^(${EXILE_TAIL_ALTERNATIVES.join('|')})`, 'i'
);

function isReturnedToBattlefield(phrase) {
    return phrase.references.some(reference => reference.owner?.returnsToBattlefield);
}

export default class ExileEffect extends ObjectEffect {
    static get pattern() {
        return EXILE;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.manner = this.consumeText(EXILE_TAIL)?.[1].toLowerCase() ?? null;
    }

    get isExile() {
        return true;
    }

    get isTemporary() {
        return this.phrases.some(isReturnedToBattlefield);
    }

    get isUntilLeaves() {
        return Boolean(this.manner?.endsWith('leaves the battlefield'));
    }
}
