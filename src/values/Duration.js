import Node from '../core/Node.js';

const DURATION_ALTERNATIVES = [
    'until end of turn',
    'until end of combat',
    'until your next turn',
    'until the end of (?:your|their|that player\'s) next turn',
    'until (?:their|that player\'s|target player\'s) next turn',
    'during (?:your|their|that player\'s) next turn',
    'until your next end step',
    'until the next end step',
    'until (?:their|that player\'s) next end step',
    'until the end of (?:the )?defending player\'s next turn',
    'for the rest of (?:this|that) turn',
    'this turn',
    'for as long as [^,.]+',
    'for the rest of the game',
    'until ~ leaves the battlefield',
    'until [^,.]+ leaves the battlefield',
    'until [^,.]+ is cast from exile',
    'until the last is removed'
];
const DURATION = new RegExp(
    `^(${DURATION_ALTERNATIVES.join('|')})`, 'i'
);

const LASTING_ALTERNATIVES = [
    '^for as long as', '^for the rest of the game$', 'leaves the battlefield$',
    'is cast from exile$'
];
const LASTING = new RegExp(LASTING_ALTERNATIVES.join('|'));

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
