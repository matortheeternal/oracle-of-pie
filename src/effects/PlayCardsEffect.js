import ObjectEffect from './ObjectEffect.js';

const PLAY_VERB = '(?<verb>play|cast)';
const EXTRA_LANDS = 'an additional land|two additional lands';
const PLAY_CARDS = new RegExp(
    `^(?<look>look at and )?${PLAY_VERB} (?!${EXTRA_LANDS})`, 'i'
);
const WITHOUT_PAYING = /^without paying (?:its|their) mana costs?/i;
const AS_THOUGH_FLASH = /^as though (?:it|they) had flash/i;
const ANY_TYPE = 'mana of any type (?:can be spent )?to cast [^,.]+';
const ANY_TYPE_MANA = new RegExp(`^,? and (?:you may spend )?${ANY_TYPE}`, 'i');
const SOURCE = /^from [^,.]+?(?= without paying\b| as though\b|[,.]|$)/i;
const BY_PAYING = /^by [a-z]+ing [^,.]+? rather than paying (?:its|their) mana costs?/i;
const PLAY_TAILS = [WITHOUT_PAYING, AS_THOUGH_FLASH, ANY_TYPE_MANA, SOURCE, BY_PAYING];

export default class PlayCardsEffect extends ObjectEffect {
    static get pattern() {
        return PLAY_CARDS;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.verb = match.groups.verb.toLowerCase();
        this.allowsLooking = Boolean(match.groups.look);
        this.tails = [];
        while (this.consumeTail()) continue;
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
