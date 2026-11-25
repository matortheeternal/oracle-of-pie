import Parser from '../../core/Parser.js';

const TURN_OWNERS = [
    'your', 'an opponent\'s', 'each opponent\'s', 'their', 'each of your'
];
const PHASES = 'combat|(?:your )?(?:main phase|declare attackers step|draw step)';
const TURN_WINDOW = new RegExp(
    `^(?:(each|this) turn|during (${TURN_OWNERS.join('|')}) turns?|this (combat)`
        + `|(?<oneTurn>in a turn)|during (?:the )?(?<phase>${PHASES}))\\b`, 'i'
);
const OPPONENT = /opponent/i;
const YOURS = /your/i;

export default class TurnWindow extends Parser {
    static match(scribe, str) {
        return str.match(TURN_WINDOW);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.span = match[1]?.toLowerCase() ?? match[3]?.toLowerCase() ?? null;
        this.turnOwner = match[2]?.toLowerCase() ?? null;
        this.phase = match.groups.phase?.toLowerCase() ?? null;
        this.isSingleTurn = Boolean(match.groups.oneTurn);
    }

    get isEachTurn() {
        return this.span === 'each';
    }

    get isThisTurn() {
        return this.span === 'this';
    }

    get isYourTurn() {
        return YOURS.test(this.turnOwner ?? '');
    }

    get isOpponentsTurn() {
        return OPPONENT.test(this.turnOwner ?? '');
    }
}
