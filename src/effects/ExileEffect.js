import ObjectEffect from './ObjectEffect.js';

const EXILE = /^exiles? /i;
const HAND = /^(?:your|their) hand\b/i;
const EXILE_TAIL_ALTERNATIVES = [
    'and the rest in a face-up pile',
    'face up',
    'until an opponent becomes the monarch',
    'from each opponent\'s graveyard',
    'in a face-(?:down|up) pile',
    'from (?:your hand|their hands)',
    'when ~ leaves the battlefield',
    'from the bottom of (?:your|their|that player\'s) library',
    'and graveyards',
    'from the top(?: of (?:your|their|its owner\'s|(?:that|target) player\'s) library)?'
        + '(?: face down)?(?: equal to [^,.]+)?',
    'equal to [^,.]+?(?= from the top of )',
    'equal to [^,.]+',
    'from outside the game',
    'face down',
    'again',
    'from (?:each|all) graveyards?',
    'from (?:their|its owner\'s) (?:hand or graveyard|graveyard or hand)',
    'instead of putting [^,.]+',
    'instead',
    'at random',
    'until ~ leaves? the battlefield',
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
        this.exilesHand = Boolean(this.consumeText(HAND));
        if (!this.exilesHand) super.parseArguments(match);
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

    get isComplete() {
        return this.exilesHand || super.isComplete;
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
