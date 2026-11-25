import Phrase from './Phrase.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const CONTROLLERS = 'the controller of (?:those creatures|that creature)';
const DESCRIBED_OBJECT = '(?:that|this|enchanted|equipped'
    + '|the (?:exiled|chosen|sacrificed)) '
    + '(?:creature|land|card|spell|artifact|Vehicle|permanent)';
const PLAYER_ALTERNATIVES = [
    '(?:an?|one|two|three|four) (?:target )?(?:other )?players?(?! or permanent\\b)',
    '(?:the|a) (?:second|third) player',
    'one of the chosen players',
    'the voter',
    'each of them(?= searches| draws| discards)',
    'their owners',
    'a random opponent',
    'each opponent attacking that player',
    'you and each opponent who voted for a choice you voted for',
    'each creature\'s controller',
    'that player and (?:their|its) opponents',
    'the player to your left',
    'any number of target players',
    '(?:the )?(?:first|second|third|active|voting|starting) player',
    '(?:exactly |up to )?(?:one|two|three|four|any number of) target players',
    '(?:one or more|any number) of your opponents',
    '(?:a|the) player of (?:your|their) choice',
    '(?:each|another|a different|the same) opponent',
    'your team',
    '(?:~|the spell)\'s (?:controller|owner)',
    DESCRIBED_OBJECT + '\'s (?:controller|owner)',
    'the (?:owners?|controllers?) of (?:up to one )?(?:other )?target '
        + '(?:nonland )?(?:creatures?|permanents?|artifacts?|spells?)',
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
const RELATIVES = [
    'who was dealt damage by (?:~|this [a-z]+) this turn',
    'other than (?:that player|you|its controller)',
    'with no cards in (?:their )?hand',
    'with fewer cards in hand than the player with the most cards in hand',
    'who (?:has|have) ' + NUMBER_PATTERN + ' or more poison counters',
    'who (?:lost|has lost) ' + NUMBER_PATTERN + ' or more life this turn',
    'who (?:voted for a choice you voted for|received no votes)',
    'who (?:sacrificed a permanent|discarded a card) this way',
    'who (?:lost life|was dealt combat damage by (?:~|this [a-z]+)) this turn',
    'who (?:owns|controls) (?:a|an|no) (?:multicolored |nonland )?'
        + '(?:creature|artifact|enchantment|land|permanent)(?: or (?:an? )?[a-z]+)?'
        + '(?: with (?:power|toughness) \\d+ or (?:greater|less))?'
        + '(?: named (?:~|[A-Z][a-z]+))?',
    'who shuffled a (?:nontoken )?creature into their library this way',
    'who discarded a card that shares a card type with the card you discarded',
    'who discarded (?:their|his|her) hand this way',
    'who controls more lands than you',
    'chosen at random',
    'who has more life than you',
    'dealt combat damage this game by a creature named ~',
    'this creature attacked this turn',
    'who (?:does(?:n\'t| not)?|can\'t|did(?:n\'t)?)'
];
const RELATIVE = new RegExp('^(?:' + RELATIVES.join('|') + ')(?![\\w\'-])', 'i');
const OPPOSING = /opponent|defending|controller|owner|foe/i;
const OPPONENT = /opponent|defending player/i;
const EVERY_PLAYER = /^(?:each|players|your opponents)\b/i;
const EACH_PLAYER = /^(?:each player|players)$/i;
const CHOSEN_PLAYER = /^(?:target|that|the chosen) player$/i;
const DISCARD_PREREQUISITE = /^who discarded .+ this way$/i;

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

    get discardedToQualify() {
        return DISCARD_PREREQUISITE.test(this.relative ?? '');
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
