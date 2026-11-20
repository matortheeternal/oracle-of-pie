import ObjectEffect from './ObjectEffect.js';

const PUT = /^puts? /i;
const DESTINATION_ALTERNATIVES = [
    'onto the battlefield',
    'into (?:your|its owner\'s|their owner\'s|their) hands?',
    'into (?:your|its owner\'s|their owner\'s|their) graveyards?',
    'on the bottom of [^,.]+',
    'on top of [^,.]+',
    'on top\\b',
    'into (?:your|their|its owner\'s) library [^,.]+'
];
const DESTINATION = new RegExp(
    '^(?:(?<source>from [^,.]+?) )?'
    + `(?<destination>${DESTINATION_ALTERNATIVES.join('|')})`, 'i'
);
const PUT_TAIL_ALTERNATIVES = [
    'tapped', 'and attacking', 'under your control', 'transformed', 'attacking',
    'face down'
];
const PUT_TAIL = new RegExp(`^(${PUT_TAIL_ALTERNATIVES.join('|')})`, 'i');
const REST_ALTERNATIVES = [
    'the rest', 'the others?', 'all other cards revealed this way', 'the remaining cards'
];
const REST = new RegExp(`^,? ?and (?:${REST_ALTERNATIVES.join('|')}) `, 'i');
const ORDER = /^in (?:a random|any) order/i;
const MILLED_SOURCE = /^from among (?:the milled cards|the cards milled this way)$/i;

export default class PutEffect extends ObjectEffect {
    static get pattern() {
        return PUT;
    }

    parseArguments(match) {
        super.parseArguments(match);
        const destination = this.consumeText(DESTINATION)?.groups;
        this.source = destination?.source?.toLowerCase() ?? null;
        this.destination = destination?.destination.toLowerCase() ?? null;
        while (this.consumeText(PUT_TAIL)) continue;
        this.restDestination = this.consumeRest();
    }

    consumeRest() {
        const start = this.remainingStr;
        if (!this.consumeText(REST)) return null;
        const destination = this.consumeText(DESTINATION);
        if (!destination) this.remainingStr = start;
        this.consumeText(ORDER);
        return destination?.groups.destination.toLowerCase() ?? null;
    }

    get isComplete() {
        return super.isComplete && Boolean(this.destination);
    }

    get toBattlefield() {
        return this.destination === 'onto the battlefield';
    }

    get removesPermanently() {
        return Boolean(this.destination?.includes('library'));
    }

    get sendsRestToGraveyard() {
        return Boolean(this.restDestination?.includes('graveyard'));
    }

    get selectsMilledCards() {
        return MILLED_SOURCE.test(this.source ?? '');
    }

    get toHand() {
        return Boolean(this.destination?.includes('hand'));
    }
}
