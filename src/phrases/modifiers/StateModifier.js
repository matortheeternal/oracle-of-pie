import Modifier from './Modifier.js';

const UNPLACED_REVEALED
    = 'that (?:weren\'t|were not) put (?:onto the battlefield|into your hand)';
const STATE_ALTERNATIVES = [
    'that (?:was|were) discarded or put there from a library this turn',
    'that entered the battlefield under your control this turn',
    'that(?:\'s| is| are) (?:a|an) (?:Cleric|artifact), (?:Rogue|creature), '
        + '(?:Warrior, and/or Wizard|or enchantment)',
    'that (?:isn\'t|is not) exactly two colors',
    'that (?:isn\'t|is not) (?:a Dragon|a Dinosaur|a commander)',
    'that doesn\'t have (?:a \\+1/\\+1 counter on it'
        + '|the same name as another permanent you control)',
    'that wasn\'t cast(?: from its owner\'s hand)?',
    'that was attached to (?:~|this [a-z]+)',
    'that was exiled this way',
    'that was put onto the battlefield with ~',
    'played this way',
    'tapped to pay this spell\'s additional cost',
    'created this way',
    'crewed by ~ this turn',
    'with (?:a finality|a collection|a takeover) counter on (?:it|him|her)',
    'with four or more card types among them',
    'with a different name than that spell',
    'with the least power among creatures they control',
    'whose controller was dealt combat damage by (?:this [a-z]+|~) this turn',
    'controlled by the player to their right',
    'other than that (?:creature|permanent)(?: or this Equipment)?',
    'from among permanents your opponents control',
    'that(?:\'s| is) exactly that many colors plus one',
    'that had (?:an?|one or more) counters? put on (?:it|them) this way',
    'that was turned face up this turn',
    'that was put there from (?:their|your|its owner\'s) library this turn',
    'that(?:\'s| is) not in your commander\'s color identity',
    'with the cycled card',
    'the opponent to your left controls',
    'that player milled this way',
    'whose coin comes up tails',
    'assimilated with (?:this [a-z]+|~)',
    'attached to you',
    '(?:that was |were )?destroyed this way',
    'with (?:two|three) or more card types',
    'except for creatures you control with flying',
    'or could produce \\{[WUBRGC]\\}',
    'while (?:it\'s|this [a-z]+ is) exiled',
    'from (?:each player\'s|each opponent\'s) graveyard',
    'of that player\'s choice(?: that one of your opponents controls)?',
    'that (?:was|were) (?:milled|put there) this turn',
    'that (?:wasn\'t|weren\'t) put there this way',
    'that had a \\+1/\\+1 counter put on it this way',
    'that (?:didn\'t|did not) attack or enter this turn',
    'that (?:became|becomes?) a creature this way',
    'that doesn\'t have the same name as a token you control',
    'that don\'t share a creature type with the chosen creature they control',
    'of a type you noted for cards named ~',
    'that hasn\'t been noted for ~\'s Journal',
    'that (?:is|are) already attached to it',
    'of a card in your graveyard',
    'from (?:an enchantment|a colorless|a noncreature) source',
    'with a legendary Equipment attached to it',
    'with the same mana value',
    '(?:he|she|they) (?:find|choose)',
    'that targets? (?:only )?(?:a permanent you control|a spell|one or more targets)',
    'that(?:\'s| is) (?:exactly one|one or more) colors',
    'that (?:doesn\'t|don\'t) have (?:first strike, double strike, vigilance, or haste)',
    'that (?:didn\'t|did not) enter this turn',
    'that (?:was|were) cast this way',
    'that (?:is|are) attacking (?:that player|you|an opponent)',
    'that (?:was|were) put into (?:your|their|a) graveyard this way',
    'that (?:is|are) (?:Crewed|saddled) this turn',
    'that (?:has|have) (?:a|one) \\+1/\\+1 counter on (?:it|them)',
    'they (?:protect|own)',
    'that player (?:owns|protects)(?: exiled this way)?',
    'that creature is attacking',
    'it\'s attacking',
    'on the stack',
    'of (?:the chosen type|the chosen color|their choice)',
    'with mana value (?:of that quality|of the chosen number)',
    'that (?:was|were) dealt damage by (?:it|~|this [a-z]+) this turn',
    'that (?:was|were) put there from anywhere',
    'in each (?:graveyard|library)',
    'in all graveyards',
    'by an opponent this way',
    'used to craft ~',
    'from (?:the command zone and from your graveyard|outside the game)',
    'with the same controller',
    'that (?:wasn\'t|weren\'t) put there (?:this combat|this turn)',
    'put into (?:a graveyard|graveyards|your graveyard) this way',
    'you (?:revealed|put into your graveyard) this way',
    'they (?:revealed|exiled|milled)(?: this way)?',
    'you (?:revealed|milled)(?= (?:into|onto|on) )',
    'that you (?:cycled or discarded|discarded|cycled) this turn',
    'that (?:was|were) attached to (?:it|them|~|this [a-z]+)',
    'that spell could target',
    'that(?:\'s| is) not historic',
    'that (?:has|have) a cycling ability',
    'discarded this way',
    'from among (?:cards exiled with (?:~|this [a-z]+)|the milled cards)',
    'from among the cards milled this way',
    'of (?:each permanent type|the other type)',
    'of that quality',
    'owned by the voter',
    'with exactly (?:two|three) colors',
    'with the same (?:mana value|power|toughness) as (?:that|the chosen) [a-z]+',
    'with equal or lesser (?:power|toughness)',
    'that each have a different mana value (?:X|\\d+) or less',
    'of the creature type of your choice',
    'that is enchanted by (?:an?|one or more) Auras? you control',
    'that (?:are|is) enchanted by Auras you control',
    'that has been exiled with (?:this [a-z]+|~)',
    'that convoked this spell',
    'with a name chosen for (?:this [a-z]+|~)',
    'that (?:has|have) (?:(?:an?|one or more|\\d+) )?'
        + '(?:[+−-]\\d+/[+−-]\\d+|[a-z]+(?: [a-z]+)?) counters? on (?:it|them)',
    'that (?:was|were) (?:put there|returned|exiled) from (?:anywhere|the battlefield)'
        + '(?: this turn)?',
    'that (?:was|were) blocked by (?:that creature|this creature|~) '
        + '(?:this combat|this turn)',
    'that (?:blocked|was blocked by|blocked or was blocked by) '
        + '(?:an?|that) [^,.]+? this turn',
    'that dealt (?:combat )?damage to (?:you|that player) this turn',
    'that (?:was|were) activated this turn',
    'that (?:is|are|isn\'t|aren\'t) all colors',
    'that(?:\'s| is| are) (?:one or more|exactly (?:two|three)|exactly those) colors',
    'that(?:\'s| is| are) (?:white|blue|black|red|green|colorless)'
        + '(?:,? (?:or|and|and/or) (?:white|blue|black|red|green|colorless))+',
    'that(?:\'s| is| are) (?:attacking|blocking) (?:that player|one of your opponents)',
    'that (?:have|has) (?:a basic land type|different names)',
    'that each (?:have a basic land type|have different names)',
    'which have the same name as (?:the|that) (?:chosen )?land',
    'that (?:doesn\'t|don\'t) (?:share a land type with a land you control'
        + '|have the same name as a Room you control|have suspend)',
    'that (?:is|are|was|were) (?:enchanted|equipped) by an? [a-z]+ you control',
    'that (?:isn\'t|aren\'t) (?:legendary|an? (?!mana'
        + ' ability)[A-Z][a-z]+(?:, (?!or |and )[A-Z][a-z]+)*'
        + '(?:,? or [A-Z][a-z]+)?)',
    'except (?:for )?(?:artifacts, lands, and Phyrexians|commanders'
        + '|creatures chosen this way)',
    'of (?:each card type|that color|the creature type of your choice)',
    'with (?:different controllers|that power|equal toughness|lesser power'
        + '|no mana abilities|the chosen card type)',
    'without mana abilities',
    'controlled by (?:the same player|the same opponent)',
    'from among the nonland permanents they control',
    'not chosen by any player this way',
    'other than (?:the chosen (?:creature|permanent)|a basic land card)',
    'in any zone other than the battlefield or the stack',
    'with a name you noted for cards named ~',
    'that you\'ve put one or more \\+1/\\+1 counters on this turn',
    'that hasn\'t been noted for (?:it|this [a-z]+)',
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
    'attacking (?:the same player or planeswalker|that player|a player)',
    'that opponent is attacking',
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
const EVENT_SCOPE = new RegExp(
    '\\b(?:put there|exiled|discarded|cycled|milled) .*(?:this'
        + ' (?:turn|way)|therefrom)$'
);
const ANTI_HISTORIC = /^that(?:'s| is) not historic$/;
const CHOSEN_THIS_WAY = /^chosen this way$/;
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

    get relatesToObject() {
        return CHOSEN_THIS_WAY.test(this.state);
    }

    get limitsToPastEvent() {
        return EVENT_SCOPE.test(this.state);
    }

    get excludesArtifacts() {
        return ANTI_HISTORIC.test(this.state);
    }
}
