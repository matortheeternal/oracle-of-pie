import Phrase from './Phrase.js';

const PLAYER_ALTERNATIVES = [
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
    'any opponent',
    'defending player',
    'they',
    'that opponent',
    'the chosen player',
    'that (?:creature|spell|permanent)\'s controller',
    'its owner',
    'your opponents',
    'you and target opponent each'
];
const PLAYER = new RegExp(
    `^(${PLAYER_ALTERNATIVES.join('|')})\\b`, 'i'
);
const YOU = /^you\b/i;
const OPPOSING = /opponent|defending|controller|its owner/i;
const OPPONENT = /opponent|defending player/i;

export default class PlayerPhrase extends Phrase {
    static match(scribe, str) {
        return str.match(PLAYER);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.player = match[1].toLowerCase();
    }

    get isPlayer() {
        return true;
    }

    get isYou() {
        return YOU.test(this.player) && !this.player.includes('opponent');
    }

    get canBeOpponent() {
        return !this.isYou || OPPOSING.test(this.player);
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
