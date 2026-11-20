import Phrase from './Phrase.js';

const PLAYER_ALTERNATIVES = [
    'you and (?:target opponent|target player|that player|each opponent)(?: each)?',
    'you',
    'target player',
    'target opponent',
    'each player',
    'each opponent',
    'each other player',
    'that player',
    'its controller',
    'its owner',
    'an opponent',
    'a player(?! or\\b)',
    'any opponent',
    'defending player',
    'they',
    'that opponent',
    'the chosen player',
    'that (?:creature|spell|permanent)\'s controller',
    'its owner',
    'your opponents',
    'one (?:or more )?of your opponents'
];
const PLAYER = new RegExp(
    `^(${PLAYER_ALTERNATIVES.join('|')})\\b`, 'i'
);
const YOU = /^you\b/i;
const COMPOUND = / and /i;
const RELATIVE = /^who (?:does(?:n't| not)?|can't|did(?:n't)?|lost life this turn)\b/i;
const OPPOSING = /opponent|defending|controller|its owner/i;
const OPPONENT = /opponent|defending player/i;
const EVERY_PLAYER = /^(?:each|your opponents)\b/i;
const EACH_PLAYER = /^each player$/i;

export default class PlayerPhrase extends Phrase {
    static match(scribe, str) {
        return str.match(PLAYER);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.player = match[1].toLowerCase();
        this.relative = this.consumeText(RELATIVE)?.[0] ?? null;
    }

    get isPlayer() {
        return true;
    }

    get isYou() {
        if (COMPOUND.test(this.player)) return false;
        return YOU.test(this.player) && !this.player.includes('opponent');
    }

    get canBeOpponent() {
        return !this.isYou || OPPOSING.test(this.player);
    }

    get includesYou() {
        return YOU.test(this.player) || EACH_PLAYER.test(this.player);
    }

    get isMass() {
        return EVERY_PLAYER.test(this.player);
    }

    get isOpponent() {
        return OPPONENT.test(this.player);
    }

    get controlledByYou() {
        return this.isYou;
    }

    hasType(type) {
        return type === 'player';
    }
}
