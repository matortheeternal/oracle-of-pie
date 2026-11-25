import Phrase from '../../phrases/Phrase.js';

const PLAYER = [
    'one or more of your opponents', 'one of your opponents', 'a player',
    'the player with the most life(?: or tied for most life)?',
    'the player who has the initiative', 'different players',
    'an opponent', 'you'
].join('|');
const WALKER = '(?:a )?(?<alternative>planeswalker)';
const WALKER_CONTROLLER = '(?: (?<theirController>you control|they control))?';
const PLAYER_OR_WALKER = `(?<player>${PLAYER})(?: or ${WALKER}${WALKER_CONTROLLER})?`;
const OBJECT = '(?<object>a battle|a planeswalker(?: (?<objectController>you control))?)';
const RECIPIENT = new RegExp(`^(?:${PLAYER_OR_WALKER}|${OBJECT})\\b`, 'i');
const OPPONENT = /opponents?\b/i;
const PLANESWALKER = /planeswalker\b/i;

export default class AttackRecipient extends Phrase {
    static match(scribe, str) {
        return str.match(RECIPIENT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { player, alternative, object } = match.groups;
        const { theirController, objectController } = match.groups;
        this.player = player?.toLowerCase() ?? null;
        this.objectType = this.readObjectType(alternative ?? object);
        const controller = theirController ?? objectController;
        this.objectController = controller?.toLowerCase() ?? null;
    }

    readObjectType(object) {
        if (!object) return null;
        return PLANESWALKER.test(object) ? 'planeswalker' : 'battle';
    }

    get isAntecedentCandidate() {
        return false;
    }

    get isPlayer() {
        return Boolean(this.player && !this.objectType);
    }

    get isYou() {
        return this.isPlayer && this.includesYou;
    }

    get includesYou() {
        return this.player === 'you';
    }

    get canBeOpponent() {
        return Boolean(this.player && !this.includesYou);
    }

    get isOpponent() {
        return OPPONENT.test(this.player ?? '');
    }

    hasType(type) {
        if (type === 'player') return Boolean(this.player);
        return type === this.objectType;
    }
}
