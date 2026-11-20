import ObjectEffect from './ObjectEffect.js';
import ZoneModifier from '../phrases/modifiers/ZoneModifier.js';

const SPELL_OR_CARD_REFERENCE = /^this (?:spell|card)$/i;

function isBattlefieldSource(phrase) {
    const source = phrase.resolved;
    return source.refersToSelf && !source.isCardInZone && !source.hasLeftBattlefield
        && !SPELL_OR_CARD_REFERENCE.test(source.raw);
}

const RETURN = /^returns? /i;
const DESTINATION_ALTERNATIVES = [
    '(its owner\'s|their owners\'|their owner\'s|your|its) hands?',
    '(the battlefield)',
    '(?:the )?(?:top|bottom) of (?:its owner\'s|their owners\'|your) librar(?:y|ies)'
];
const DESTINATION = new RegExp(
    `^to (?:${DESTINATION_ALTERNATIVES.join('|')})`, 'i'
);
const FROM_GRAVEYARD = /^from (?:your|a|their|its owner's) graveyards? /i;
const OR_FROM_EXILE = /^or (?=from exile\b)/i;
const RETURN_TAIL_ALTERNATIVES = [
    'tapped',
    'and attacking',
    'transformed',
    'face down',
    'under (?:your|its owner\'s|their owners\'|their owner\'s) control',
    'attached to [^,.]+',
    'with (?:an? |N |\\w+ )[^,.]*counters? on (?:it|them)',
    'at the beginning of [^,.]+',
    'at end of combat'
];
const RETURN_TAIL = new RegExp(
    `^(${RETURN_TAIL_ALTERNATIVES.join('|')})`, 'i'
);

export default class ReturnEffect extends ObjectEffect {
    static get pattern() {
        return RETURN;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.source = this.consumeText(FROM_GRAVEYARD) ? 'graveyard' : null;
        this.alternativeSource = this.consumeAlternativeSource();
        const destination = this.consumeText(DESTINATION);
        this.destination = this.destinationOf(destination);
        this.manner = [];
        while (this.consumeTail()) continue;
    }

    consumeAlternativeSource() {
        if (!this.fromGraveyard || !this.consumeText(OR_FROM_EXILE)) return null;
        return this.consume([ZoneModifier]);
    }

    get parts() {
        return [...super.parts, this.alternativeSource].filter(Boolean);
    }

    destinationOf(match) {
        if (!match) return null;
        if (match[2]) return 'battlefield';
        if (match[1]) return 'hand';
        return 'library';
    }

    consumeTail() {
        const tail = this.consumeText(RETURN_TAIL);
        if (tail) this.manner.push(tail[1].toLowerCase());
        return Boolean(tail);
    }

    get isComplete() {
        return super.isComplete && Boolean(this.destination);
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
