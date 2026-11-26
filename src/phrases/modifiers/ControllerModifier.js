import Modifier from './Modifier.js';

const CONTROLLER_ALTERNATIVES = [
    'each player casts during each of their turns',
    'you activate this turn when you activate it',
    'you own exiled this way',
    'you own and control',
    'you cast from exile this turn',
    'you cast from anywhere other than your hand each turn',
    'you cast from your graveyard or from exile',
    'you cast with \\{X\\} in its mana cost each turn',
    'you cast each turn that mana from a Treasure was spent to cast',
    'you foretell each turn',
    'your opponents activate',
    'its owner controls',
    'you cast that target(?:s)? (?:an? (?:creature|artifact|permanent)'
        + '|enchanted (?:creature|player))',
    'your opponents cast (?:from graveyards or from exile|during your turn)',
    'your opponents cast that target '
        + '(?:this creature|one or more commanders you control|an? [a-z-]+ you control)',
    'you activate during (?:your turn|each of your turns)',
    'you cast during each of your turns',
    'you cast from exile(?: each turn)?',
    'enchanted player casts',
    'a player casts',
    'controlled by a player who was dealt combat damage by (?:three|3) or more '
        + 'Pirates this turn',
    'they cast this turn',
    'enchanted player controls',
    'your opponents control that are able to block',
    'their opponents control',
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
    'they don\'t control',
    'an opponent owns',
    'they own',
    'you don\'t own',
    'you controlled',
    'their controller controls',
    'its controller controls',
    'that opponent controls',
    'your team controls',
    'you cast but don\'t own',
    'you cast(?: (?:(?:each|this) turn|during your turn))?',
    'your opponents cast(?: each turn)?',
    'opponents cast(?: each turn)?'
];
const CONTROLLER = new RegExp(
    `^(${CONTROLLER_ALTERNATIVES.join('|')})\\b`, 'i'
);
const EXCLUDED_OWNERSHIP = /\byou (?:control|cast) but don't own$/i;
const YOURS = /^you (?:control|own|both|cast|activate)/i;
const TARGETING = /\bcast that targets?\b/i;

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

    get restrictsTargeting() {
        return TARGETING.test(this.controller);
    }

    get controlledByYou() {
        return YOURS.test(this.controller) && !this.controller.endsWith(`don't control`);
    }

    get controlledByOpponent() {
        return !this.controlledByYou && this.controller !== 'each player controls';
    }
}
