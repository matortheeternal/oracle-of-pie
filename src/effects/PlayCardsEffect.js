import ObjectEffect from './ObjectEffect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const PLAY_VERB = '(?<verb>play|cast)';
const EXTRA_LANDS = NUMBER_PATTERN + ' additional lands?';
const PLAY_CARDS = new RegExp(
    `^(?<look>look at and )?${PLAY_VERB} (?!${EXTRA_LANDS})`, 'i'
);
const WITHOUT_PAYING = /^without paying (?:its|their) mana costs?/i;
const AS_THOUGH_FLASH = /^as though (?:it|they) had flash/i;
const ANY_TYPE = 'mana of any type (?:can be spent )?to cast [^,.]+';
const ANY_TYPE_MANA = new RegExp(`^,? and (?:you may spend )?${ANY_TYPE}`, 'i');
const SOURCE = /^from [^,.]+?(?= without paying\b| as though\b|[,.]|$)/i;
const BY_PAYING = /^by [a-z]+ing [^,.]+? rather than paying (?:its|their) mana costs?/i;
const USES_ALTERNATIVE_COST = /^using (?:its|their) [a-z-]+ (?:cost|ability)\b/i;
const ALTERNATIVE_CAST_COST = /^for (?:its|their) [a-z-]+ cost\b/i;
const PAYS_EXTRA_COST = /^by [a-z]+ing [^,.]+? in addition to (?:paying )?[^,.]+/i;
const ADVENTURE = /^as an adventure\b/i;
const TOP_REVEALED = /^with the top card of your library revealed\b/i;
const REVEALED_TOP = /^play with the top card of your library revealed\b/i;
const PAYMENT_OPTION = /^,? and you may spend mana from snow sources as though [^,.]+/i;
const ALTERNATE_SOURCE = /^or from (?:your graveyard|exile|your hand)\b/i;
const PLAY_TAILS = [
    WITHOUT_PAYING, AS_THOUGH_FLASH, ANY_TYPE_MANA, SOURCE, BY_PAYING,
    USES_ALTERNATIVE_COST, ALTERNATIVE_CAST_COST, PAYS_EXTRA_COST, ADVENTURE,
    TOP_REVEALED, PAYMENT_OPTION, ALTERNATE_SOURCE
];

export default class PlayCardsEffect extends ObjectEffect {
    static get pattern() {
        return PLAY_CARDS;
    }

    static match(scribe, str) {
        return str.match(REVEALED_TOP) ?? super.match(scribe, str);
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.revealsTopCard = Boolean(!match.groups);
        this.verb = match.groups?.verb.toLowerCase() ?? 'play';
        this.allowsLooking = Boolean(match.groups?.look);
        this.tails = [];
        while (this.consumeTail()) continue;
    }

    get isComplete() {
        return this.revealsTopCard || super.isComplete;
    }

    consumeTail() {
        const tail = PLAY_TAILS.find(pattern => this.consumeText(pattern));
        if (tail) this.tails.push(tail);
        return Boolean(tail) || this.consumePlayDuration();
    }

    consumePlayDuration() {
        if (this.duration) return false;
        this.duration = this.consumeDuration();
        return Boolean(this.duration);
    }

    consumeDuration() {
        return this.duration ?? super.consumeDuration();
    }

    get isFree() {
        return this.tails.includes(WITHOUT_PAYING);
    }

    get grantsFlash() {
        return this.tails.includes(AS_THOUGH_FLASH);
    }

    get allowsLands() {
        return this.verb === 'play';
    }
}
