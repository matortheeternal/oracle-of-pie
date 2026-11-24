import ObjectEffect from './ObjectEffect.js';

const EXILE = /^exiles? /i;
const EXILE_TAIL_ALTERNATIVES = [
    'face down',
    'instead of putting [^,.]+',
    'instead',
    'at random',
    'until ~ leaves the battlefield',
    'until [^,.]+ leaves the battlefield',
    'from the top of (?:your|their|its owner\'s|that player\'s) library until [^,.]+',
    'with [^,.]*counters? on (?:it|them)',
    'at (?:end of combat|the beginning of [^,.]+)',
    'from (?:your|its owner\'s|their) graveyard'
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
        this.manners = this.consumeManners();
        this.manner = this.manners[0] ?? null;
    }

    consumeManners() {
        const manners = [];
        let tail = this.consumeText(EXILE_TAIL);
        while (tail) {
            manners.push(tail[1].toLowerCase());
            tail = this.consumeText(EXILE_TAIL);
        }
        return manners;
    }

    get isExile() {
        return true;
    }

    get removesPermanently() {
        return !this.isTemporary;
    }

    get isTemporary() {
        return this.phrases.some(isReturnedToBattlefield);
    }

    get isUntilLeaves() {
        return Boolean(this.manner?.endsWith('leaves the battlefield'));
    }
}
