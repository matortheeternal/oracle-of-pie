import Modifier from './Modifier.js';

const STATE_ALTERNATIVES = [
    'that (?:was|were) dealt damage this turn',
    'that entered (?:the battlefield )?this turn',
    'that attacked this turn',
    'blocking or blocked by ~',
    'blocking ~',
    'blocked by ~',
    'attacking you',
    'tapped this way',
    'cast this way',
    'exiled with ~',
    'that (?:share|shares) a [a-z ]+',
    'of the chosen type',
    'of the chosen color',
    'other than ~',
    'that\'s? (?:attacking|blocking)(?: (?:it|~|this creature))?',
    'that\'s enchanted or equipped',
    'an opponent cast',
    'of (?:their|your|its controller\'s) choice',
    'that (?:are|is) [a-z]+',
    'named (?:~|[A-Z][^,.]*)',
    'chosen at random',
    'using mana (?:produced by|from) [^,.]+',
    'that targets? (?:~|it|you|this [a-z]+)'
];
const NAMED = /^named\b/;
const TARGETING = /^that targets?\b/;
const STATE = new RegExp(
    `^(${STATE_ALTERNATIVES.join('|')})(?!\\w)`, 'i'
);

export default class StateModifier extends Modifier {
    static match(scribe, str) {
        return str.match(STATE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.state = match[1].toLowerCase();
    }

    get restrictsTargeting() {
        return TARGETING.test(this.state);
    }

    get restrictsName() {
        return NAMED.test(this.state);
    }
}
