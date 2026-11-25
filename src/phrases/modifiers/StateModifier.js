import Modifier from './Modifier.js';

const UNPLACED_REVEALED
    = 'that (?:weren\'t|were not) put (?:onto the battlefield|into your hand)';
const STATE_ALTERNATIVES = [
    'with that permanent',
    'from the command zone',
    'with the greatest power',
    'that(?:\'s| is) attacking alone',
    'that(?:\'s| is) (?:an? [A-Z][a-z]+)(?: or an? [A-Z][a-z]+)',
    'that (?:are|is) enchanted or equipped',
    'that (?:are|is) white and/or blue',
    'with activated abilities that aren\'t mana abilities',
    'that(?:\'s| is) an artifact or that has mana value [0-9]+ or less',
    'that dealt (?:combat )?damage this turn',
    'that hasn\'t been chosen',
    'exiled with (?:~|it|this [a-z]+)',
    'that (?:isn\'t|aren\'t) of the chosen type',
    'of the chosen kind',
    'with the top card of your library revealed',
    'used to cast (?:this creature|this spell|~)',
    'that\'s? all colors',
    'that\'s? enchanted by Auras you control',
    'that (?:was|were) put there from anywhere this turn',
    'not (?:cast|chosen) this way',
    'of the chosen (?:number|quality)',
    'with different powers',
    'used to cast (?:this spell|~)',
    'that fought this way',
    'with a study counter on it',
    'chosen this way',
    'that (?:isn\'t|aren\'t) on the battlefield',
    'that (?:wasn\'t|weren\'t|was not|were not) (?:cast|chosen|exiled) this way',
    'not cast this way',
    'milled this way',
    'that (?:was|were) exiled this way',
    'dealt (?:combat )?damage (?:by (?:~|this [a-z]+) this turn|this way)',
    'that blocked this turn',
    'that (?:crewed|saddled) (?:it|~|this [a-z]+) this turn',
    'that convoked it',
    'that\'s attacking alone',
    'that is attacking alone',
    'with no abilities',
    'with abilities',
    'of that type',
    'with a basic land type',
    'with different mana values',
    'controlled by different players',
    'they own',
    'enchanted by Auras you control',
    'attacking (?:your opponents|the last chosen player)'
        + '(?: and/or planeswalkers they control)?',
    'other than (?:this [a-z]+|enchanted [a-z]+)',
    'that would be tapped for mana',
    'used to craft this [a-z]+',
    'of (?:your|their) choice',
    'that (?:was|were) dealt damage this turn',
    'that (?:was|were) put there from (?:the battlefield|anywhere) this turn',
    'that entered (?:the battlefield )?this turn',
    'that attacked this turn',
    'blocking or blocked by ~',
    'blocking ~',
    'blocked by ~',
    'attacking you',
    'tapped this way',
    `revealed this way(?: ${UNPLACED_REVEALED})?`,
    'cast this way',
    'that shares? a (?:creature type|color|card type|permanent type|name)'
        + '(?: with (?:it|them|~|that [a-z]+|this [a-z]+|the (?:sacrificed|chosen) [a-z]+'
        + '|a legendary creature you control))?',
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
    'in (?:their|the|your) chosen pile',
    'using mana (?:produced by|from) [^,.]+',
    'that targets? (?:~|it|you|this [a-z]+)',
    'that each have mana value (?:\\d+|X)(?: or (?:less|greater))?'
];
const COMBAT_ROLE = /^that (?:crewed|saddled)\b/i;
const TYPAL = /^that(?:'s| is) an? [a-z]+ or an? [a-z]+$/i;
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

    get relatesToSourceCombatRole() {
        return COMBAT_ROLE.test(this.state);
    }

    get restrictsSubtype() {
        return TYPAL.test(this.state);
    }

    get restrictsName() {
        return NAMED.test(this.state);
    }
}
