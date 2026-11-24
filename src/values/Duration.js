import Node from '../core/Node.js';

const DURATION_ALTERNATIVES = [
    'until end of turn',
    'until end of combat',
    'until your next turn',
    'until the end of your next turn',
    'until your next end step',
    'this turn',
    'for as long as [^,.]+',
    'for the rest of the game',
    'until ~ leaves the battlefield',
    'until [^,.]+ leaves the battlefield'
];
const DURATION = new RegExp(
    `^(${DURATION_ALTERNATIVES.join('|')})`, 'i'
);

const LASTING = /^for as long as|^for the rest of the game$|leaves the battlefield$/;

export default class Duration extends Node {
    static match(scribe, str) {
        return str.match(DURATION);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.text = match[1].toLowerCase();
    }

    get isTemporary() {
        return !LASTING.test(this.text);
    }

    get isUntilEndOfTurn() {
        return this.text === 'until end of turn' || this.text === 'this turn';
    }
}
