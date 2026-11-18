import ObjectEffect from './ObjectEffect.js';

const PUT = /^puts? /i;
const DESTINATION_ALTERNATIVES = [
    'onto the battlefield',
    'into (?:your|its owner\'s|their owner\'s|their) hands?',
    'into (?:your|its owner\'s|their owner\'s|their) graveyards?',
    'on the bottom of [^,.]+',
    'on top of [^,.]+',
    'into (?:your|their) library [^,.]+'
];
const DESTINATION = new RegExp(
    `^(?:from [^,.]+? )?(${DESTINATION_ALTERNATIVES.join('|')})`, 'i'
);
const PUT_TAIL = /^(tapped|under your control|transformed|attacking|face down)/i;

export default class PutEffect extends ObjectEffect {
    static get pattern() {
        return PUT;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.destination = this.consumeText(DESTINATION)?.[1].toLowerCase() ?? null;
        while (this.consumeText(PUT_TAIL)) continue;
    }

    get isComplete() {
        return super.isComplete && Boolean(this.destination);
    }

    get toBattlefield() {
        return this.destination === 'onto the battlefield';
    }

    get toHand() {
        return Boolean(this.destination?.includes('hand'));
    }
}
