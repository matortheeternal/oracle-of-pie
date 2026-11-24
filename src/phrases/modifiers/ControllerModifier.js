import Modifier from './Modifier.js';

const CONTROLLER_ALTERNATIVES = [
    'you control',
    'you don\'t control',
    'you both own and control',
    'you own',
    'an opponent controls',
    'your opponents control',
    'target (?:player|opponent) controls',
    'that player controls',
    'defending player controls',
    'each player controls',
    'they control',
    'its controller controls',
    'that opponent controls',
    'you own but don\'t control',
    'you control but don\'t own',
    'you cast(?: each turn)?',
    'your opponents cast(?: each turn)?',
    'opponents cast(?: each turn)?'
];
const CONTROLLER = new RegExp(
    `^(${CONTROLLER_ALTERNATIVES.join('|')})\\b`, 'i'
);
const YOURS = /^you (?:control|own|both|cast)/i;

export default class ControllerModifier extends Modifier {
    static match(scribe, str) {
        return str.match(CONTROLLER);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.controller = match[1].toLowerCase();
    }

    get controlledByYou() {
        return YOURS.test(this.controller) && !this.controller.includes(`don't`);
    }

    get controlledByOpponent() {
        return !this.controlledByYou && this.controller !== 'each player controls';
    }
}
