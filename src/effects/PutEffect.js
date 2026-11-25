import ObjectEffect from './ObjectEffect.js';
import PlayerPhrase from '../phrases/PlayerPhrase.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const PUT = /^puts? /i;
const DESTINATION_ALTERNATIVES = [
    'onto the battlefield',
    'into (?:your|its owner\'s|their owner\'s|their owners\'|their) hands?',
    'into (?:your|its owner\'s|their owner\'s|their owners\'|their) graveyards?',
    'into (?:her|his) owner\'s library third from the top',
    'back in any order',
    'into the command zone',
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
    'face down', 'in (?:a random|any) order', 'under their owners\' control',
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
const ALTERNATE_DESTINATION = /^or (?=(?:into|onto|on)\b)/i;
const LEADING_MANNER = /^(?:tapped )?under (?:your|their|its owner's) control\b/i;
const SECOND_SOURCE = /^and from (?:your graveyard|the command zone)\b/i;
const TRAILING_SOURCE = /^from the command zone\b/i;
const MILLED_SOURCE = /^from among (?:the milled cards|the cards milled this way)$/i;
const DISTRIBUTION = new RegExp(
    `^(?:, (?:and )?|and )(?<count>${NUMBER_PATTERN}) (?=(?:into|onto|on) )`, 'i'
);
const ATTACKING = /^(?:and )?attacking$/;

export default class PutEffect extends ObjectEffect {
    static get pattern() {
        return PUT;
    }

    parseArguments(match) {
        const initialDestination = this.consumeText(DESTINATION)?.groups;
        const initialManner = initialDestination && this.consumeText(LEADING_MANNER);
        super.parseArguments(match);
        this.alternativeZone = this.consumeText(ALTERNATE_ZONE)?.[0].slice(3) ?? null;
        this.additionalSource = this.consumeText(SECOND_SOURCE)?.[0] ?? null;
        this.readDestination(initialDestination);
        this.manners = this.consumeManners();
        if (initialManner) this.manners.unshift(initialManner[0].toLowerCase());
        this.attackRecipient = this.readAttackRecipient();
        this.alternativeDestination = this.consumeAlternativeDestination();
        this.restDestination = this.consumeRest();
        this.distribution = this.readDistribution();
    }

    readAttackRecipient() {
        if (!this.manners.some(manner => ATTACKING.test(manner))) return null;
        return this.consume([PlayerPhrase]);
    }

    readDistribution() {
        const placements = [];
        let next = this.consumePlacement();
        while (next) {
            placements.push(next);
            next = this.consumePlacement();
        }
        return placements;
    }

    consumePlacement() {
        const start = this.remainingStr;
        const prefix = this.consumeText(DISTRIBUTION);
        if (!prefix) return null;
        const destination = this.consumeText(DESTINATION)?.groups.destination;
        if (destination) return { count: numberValue(prefix.groups.count), destination };
        this.remainingStr = start;
        return null;
    }

    get parts() {
        return [...super.parts, this.attackRecipient].filter(Boolean);
    }

    readDestination(initialDestination) {
        const destination = initialDestination ?? this.consumeText(DESTINATION)?.groups;
        const trailingSource = destination && this.consumeText(TRAILING_SOURCE);
        this.source = (destination?.source ?? trailingSource?.[0])?.toLowerCase() ?? null;
        this.destination = destination?.destination.toLowerCase() ?? null;
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

    consumeAlternativeDestination() {
        const start = this.remainingStr;
        if (!this.consumeText(ALTERNATE_DESTINATION)) return null;
        const match = this.consumeText(DESTINATION);
        if (!match) this.remainingStr = start;
        return match?.groups.destination.toLowerCase() ?? null;
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
        return MILLED_SOURCE.test(this.source ?? '') || this.phrases.some(
            phrase => phrase.modifiers?.some(modifier => MILLED_SOURCE.test(modifier.raw))
        );
    }

    get toHand() {
        return Boolean(this.destination?.includes('hand'));
    }
}
