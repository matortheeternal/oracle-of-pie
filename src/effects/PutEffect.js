import ObjectEffect from './ObjectEffect.js';

const PUT = /^puts? /i;
const DESTINATION_ALTERNATIVES = [
    'onto the battlefield',
    'into (?:your|its owner\'s|their owner\'s|their) hands?',
    'into (?:your|its owner\'s|their owner\'s|their) graveyards?',
    'on the bottom of [^,.]+',
    'on top of [^,.]+',
    'on top\\b',
    'into (?:your|their) library [^,.]+'
];
const DESTINATION = new RegExp(
    `^(?:from [^,.]+? )?(${DESTINATION_ALTERNATIVES.join('|')})`, 'i'
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

export default class PutEffect extends ObjectEffect {
    static get pattern() {
        return PUT;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.destination = this.consumeText(DESTINATION)?.[1].toLowerCase() ?? null;
        while (this.consumeText(PUT_TAIL)) continue;
        this.restDestination = this.consumeRest();
    }

    consumeRest() {
        const start = this.remainingStr;
        if (!this.consumeText(REST)) return null;
        const destination = this.consumeText(DESTINATION);
        if (!destination) this.remainingStr = start;
        this.consumeText(ORDER);
        return destination?.[1].toLowerCase() ?? null;
    }

    get isComplete() {
        return super.isComplete && Boolean(this.destination);
    }

    get toBattlefield() {
        return this.destination === 'onto the battlefield';
    }

    get sendsRestToGraveyard() {
        return Boolean(this.restDestination?.includes('graveyard'));
    }

    get toHand() {
        return Boolean(this.destination?.includes('hand'));
    }
}
