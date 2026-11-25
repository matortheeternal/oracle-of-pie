import Modifier from './Modifier.js';

const CONTROLLER_ALTERNATIVES = [
    'you control but don\'t own',
    'you own but don\'t control',
    'you control',
    'you don\'t control',
    'you both own and control',
    'you own',
    'an opponent controls',
    'your opponents control',
    'target (?:player|opponent) controls',
    'that player controls',
    '(?:the )?defending player controls',
    'each player controls',
    'they control',
    'an opponent owns',
    'they own',
    'you don\'t own',
    'you controlled',
    'their controller controls',
    'its controller controls',
    'that opponent controls',
    'your team controls',
    'enchanted player controls',
    'you cast but don\'t own',
    'you cast(?: (?:each|this) turn)?',
    'your opponents cast(?: each turn)?',
    'opponents cast(?: each turn)?'
];
const CONTROLLER = new RegExp(
    `^(${CONTROLLER_ALTERNATIVES.join('|')})\\b`, 'i'
);
const EXCLUDED_OWNERSHIP = /\byou (?:control|cast) but don't own$/i;
const YOURS = /^you (?:control|own|both|cast)/i;

export default class ControllerModifier extends Modifier {
    static match(scribe, str) {
        return str.match(CONTROLLER);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.controller = match[1].toLowerCase();
    }

    get excludesOwnedByYou() {
        return EXCLUDED_OWNERSHIP.test(this.controller);
    }

    get controlledByYou() {
        return YOURS.test(this.controller) && !this.controller.endsWith(`don't control`);
    }

    get controlledByOpponent() {
        return !this.controlledByYou && this.controller !== 'each player controls';
    }
}
