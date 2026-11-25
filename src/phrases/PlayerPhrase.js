import Phrase from './Phrase.js';

const CONTROLLERS = 'the controller of (?:those creatures|that creature)';
const PLAYER_ALTERNATIVES = [
    'target opponent whose turn it is',
    'the player with the most life(?: or tied for most life)?',
    'each of its controller\'s opponents',
    'that source\'s controller',
    'that spell\'s owner',
    'the controller of (?:that creature|that permanent|~)',
    '(?:his|her) controller',
    'you and (?:target|each|an|another) opponent(?: each)?',
    'that player who controls more lands than you',
    'each player who controls the (?:fewest|most) (?:land|creature|artifact)s',
    'each opponent who (?:lost|has lost) [0-9]+ or more life this turn',
    'each player who owns a spell you cast this way',
    'that player or a planeswalker they control',
    'one of your opponents',
    `you and (?:those players|${CONTROLLERS})(?: each)?`,
    'each of those players',
    'each (?:friend|foe)',
    'players',
    'the player (?:to your (?:left|right)|whose turn it is|who has the initiative)',
    'enchanted (?:player|opponent)',
    'the monarch',
    'that (?:creature|card|land|token|permanent)\'s owner',
    'target (?:creature|permanent)\'s owner',
    '(?:that|this|enchanted) (?:creature|land|card|artifact|Vehicle)\'s controller',
    'the owners? of (?:those|the|each) cards?(?: exiled with (?:~|this [a-z]+))?',
    'you and (?:target opponent|target player|that player|each opponent)(?: each)?',
    'you',
    'target player',
    'target opponent',
    'each player',
    'each opponent',
    'each other player',
    'that player who (?:controls|owns|lost) [^,]+?(?= (?:casts?|creates?|draws?|puts?) )',
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
const OPPOSING = /opponent|defending|controller|owner|foe/i;
const OPPONENT = /opponent|defending player/i;
const EVERY_PLAYER = /^(?:each|players|your opponents)\b/i;
const EACH_PLAYER = /^(?:each player|players)$/i;
const CHOSEN_PLAYER = /^(?:target|that|the chosen) player$/i;

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

    get canBeYou() {
        return this.includesYou || CHOSEN_PLAYER.test(this.player);
    }

    get isMass() {
        return EVERY_PLAYER.test(this.player);
    }

    get isObjectOwner() {
        return this.player === 'its owner' || this.player.endsWith('\'s owner');
    }

    get isObjectController() {
        return this.player === 'its controller' || this.player.endsWith('\'s controller');
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
