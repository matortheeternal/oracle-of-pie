import ObjectEffect from './ObjectEffect.js';

const PUT = /^puts? /i;
const DESTINATION_ALTERNATIVES = [
    'onto the battlefield',
    'into (?:your|its owner\'s|their owner\'s|their owners\'|their) hands?',
    'into (?:your|its owner\'s|their owner\'s|their owners\'|their) graveyards?',
    'on (?:their|its owner\'s) choice of the top or bottom of [^,.]+',
    'on the bottom of [^,.]+',
    '(?:back )?on top of [^,.]+',
    'on top\\b',
    'on the bottom\\b',
    'into (?:your|their|its owner\'s) library [^,.]+'
];
const DESTINATION = new RegExp(
    '^(?:(?<source>from [^,.]+?) )?'
    + `(?<destination>${DESTINATION_ALTERNATIVES.join('|')})`, 'i'
);
const PUT_TAIL_ALTERNATIVES = [
    'tapped', 'and attacking', 'under (?:your|their|its owner\'s) control',
    'transformed', 'attacking', 'attached to [^,.]+',
    'under (?:an opponent\'s|that player\'s) control',
    'face down', 'in (?:a random|any) order',
    'with (?:an? |\\w+ )(?:additional )?[^,.]*counters? on (?:it|them)'
];
const PUT_TAIL = new RegExp(`^(${PUT_TAIL_ALTERNATIVES.join('|')})`, 'i');
const REST_ALTERNATIVES = [
    'the rest', 'the others?', 'all other cards revealed this way', 'the remaining cards'
];
const REST = new RegExp(`^,? ?and (?:${REST_ALTERNATIVES.join('|')}) `, 'i');
const OPPONENT_CONTROL = /^under (?:their|an opponent's|that player's) control$/i;
const ORDER = /^in (?:a random|any) order/i;
const ALTERNATE_ZONE = /^or (?:graveyard|hand|exile)\b/i;
const MILLED_SOURCE = /^from among (?:the milled cards|the cards milled this way)$/i;

export default class PutEffect extends ObjectEffect {
    static get pattern() {
        return PUT;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.alternativeZone = this.consumeText(ALTERNATE_ZONE)?.[0].slice(3) ?? null;
        const destination = this.consumeText(DESTINATION)?.groups;
        this.source = destination?.source?.toLowerCase() ?? null;
        this.destination = destination?.destination.toLowerCase() ?? null;
        this.manners = this.consumeManners();
        this.restDestination = this.consumeRest();
    }

    consumeManners() {
        const manners = [];
        let tail = this.consumeText(PUT_TAIL);
        while (tail) {
            manners.push(tail[0].toLowerCase());
            tail = this.consumeText(PUT_TAIL);
        }
        return manners;
    }

    get placesUnderAnotherPlayersControl() {
        return this.manners.some(manner => OPPONENT_CONTROL.test(manner));
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
