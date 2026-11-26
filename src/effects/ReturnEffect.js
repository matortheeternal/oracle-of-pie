import ObjectEffect from './ObjectEffect.js';
import ZoneModifier from '../phrases/modifiers/ZoneModifier.js';
import readPlacementContinuation from './readPlacementContinuation.js';

const SPELL_OR_CARD_REFERENCE = /^this (?:spell|card)$/i;

function isBattlefieldSource(phrase) {
    const source = phrase.resolved;
    return source.refersToSelf && !source.isCardInZone && !source.hasLeftBattlefield
        && !SPELL_OR_CARD_REFERENCE.test(source.raw);
}

const RETURN = /^returns? /i;
const PASSIVE_RETURN = /^(?:is|are) returned (?:from the battlefield )?(?=to )/i;
const OWNER = '(?:its|his|her|their) owner\'s|their owners\'';
const DESTINATION_ALTERNATIVES = [
    `(?<hand>(?:${OWNER}|their|your|its) hands?)`,
    'the (?<publicZone>battlefield|command zone)',
    `(?<graveyard>(?:${OWNER}|your|their) graveyards?)`,
    '(?:the )?(?:top|bottom) of (?:its owner\'s|their owners\'|your) librar(?:y|ies)'
];
const DESTINATION = new RegExp(
    `^to (?:${DESTINATION_ALTERNATIVES.join('|')})\\b`, 'i'
);
const FROM_GRAVEYARD = /^from (?:your|a|their|each|its owner's) graveyards?\b/i;
const RANDOM = /^at random\b/i;
const TAPPED = /^tapped\b/i;
const RESULT_FILTER = new RegExp(
    '^each with (?:mana value [^,.]+?|different mana values)(?= from )', 'i'
);
const OR_FROM_EXILE = /^or (?=from exile\b)/i;
const RETURN_TAIL_ALTERNATIVES = [
    'tapped',
    'and tapped',
    'and attacking',
    '(?:and )?(?:transformed|converted)',
    'face down',
    `under (?:your|${OWNER}) control`,
    'attached to [^,.]+',
    'under (?:their|that player\'s|an opponent\'s) control',
    'under the control of that card\'s owner',
    'with (?:an? |N |\\w+ )(?:additional )?[^,.]*counters? on (?:it|them|him|her)'
        + '(?: equal to (?:that|the (?:chosen|other)) result)?',
    'at the beginning of [^,.]+',
    'at end of combat',
    'except for (?:Giants, Wizards, and lands|Merfolk, Krakens,'
        + ' Leviathans, Octopuses, and Serpents)'
];
const RETURN_TAIL = new RegExp(
    `^(${RETURN_TAIL_ALTERNATIVES.join('|')})`, 'i'
);
const BATTLEFIELD_CONTROL = /^under /i;

export default class ReturnEffect extends ObjectEffect {
    static get pattern() {
        return RETURN;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(PASSIVE_RETURN);
    }

    parseArguments(match) {
        this.isPassive = PASSIVE_RETURN.test(match[0]);
        const leadingSource = this.consumeText(FROM_GRAVEYARD);
        const leadingDestination = this.consumeText(DESTINATION);
        const leadingManner = leadingDestination && this.consumeText(TAPPED);
        super.parseArguments(match);
        this.atRandom = Boolean(this.consumeText(RANDOM));
        this.resultFilter = this.consumeText(RESULT_FILTER)?.[0] ?? null;
        const source = leadingSource ?? this.consumeText(FROM_GRAVEYARD);
        this.source = source ? 'graveyard' : null;
        this.alternativeSource = this.consumeAlternativeSource();
        const destination = leadingDestination ?? this.consumeText(DESTINATION);
        this.destination = this.destinationOf(destination);
        this.readManner(leadingManner);
        this.additionalReturn = this.readAdditionalReturn();
    }

    readAdditionalReturn() {
        if (!this.destination || !this.objects) return null;
        return readPlacementContinuation(this, ReturnEffect, 'return');
    }

    readManner(leadingManner) {
        this.manner = leadingManner ? [leadingManner[0].toLowerCase()] : [];
        while (this.consumeTail()) continue;
        if (this.destination) return;
        const underControl = this.manner.some(manner => BATTLEFIELD_CONTROL.test(manner));
        if (underControl) this.destination = 'battlefield';
    }

    consumeAlternativeSource() {
        if (!this.fromGraveyard || !this.consumeText(OR_FROM_EXILE)) return null;
        return this.consume([ZoneModifier]);
    }

    get parts() {
        return [...super.parts, this.alternativeSource, this.additionalReturn]
            .filter(Boolean);
    }

    destinationOf(match) {
        if (!match) return null;
        const { publicZone, hand, graveyard } = match.groups;
        if (publicZone) return publicZone.toLowerCase();
        if (hand) return 'hand';
        if (graveyard) return 'graveyard';
        return 'library';
    }

    consumeTail() {
        const tail = this.consumeText(RETURN_TAIL);
        if (tail) this.manner.push(tail[1].toLowerCase());
        return Boolean(tail);
    }

    get isComplete() {
        return Boolean(this.destination && (this.isPassive || super.isComplete));
    }

    get phrases() {
        return this.isPassive ? [this.subject].filter(Boolean) : super.phrases;
    }

    get isBounce() {
        return this.destination === 'hand' && !this.fromGraveyard;
    }

    get bouncesSource() {
        return this.isBounce && this.phrases.some(isBattlefieldSource);
    }

    get removesPermanently() {
        return this.isBounce;
    }

    get consumesSource() {
        return this.fromGraveyard && this.phrases.some(phrase => phrase.refersToSelf);
    }

    get returnsToBattlefield() {
        return this.destination === 'battlefield';
    }

    get fromGraveyard() {
        if (this.source === 'graveyard') return true;
        return this.phrases.some(phrase => phrase.zone === 'graveyard');
    }
}
