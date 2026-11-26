import Effect from './Effect.js';
import consumeGrantedAbilities, {
    consumeTrailingAbilities
} from '../values/consumeGrantedAbilities.js';

const ADDITIONAL_TYPES = '(?:(?:,(?: and)? \\w+)+(?=\\.|$))?';
const TYPE_ALTERNATIVES = [
    'still an enchantment', 'snow', 'basic',
    'black Zombies in addition to their other colors and types',
    'Juggernauts in addition to their other creature types',
    'all basic land types',
    '(?:Food|Treasure|Clue) artifacts?(?: in addition to their other types)?',
    `(?:also )?an? (?:"[^"]*"|[^,."])+${ADDITIONAL_TYPES}`,
    '(?:[0-9]+|X)/(?:[0-9]+|X) (?:[a-z]+ )*creatures?'
        + '(?: in addition to (?:its|their) other types)?',
    'still (?:an? )?(?:[a-z]+ )?(?:lands?|creatures?|artifacts?)',
    'every (?:nonbasic land|land|basic land|creature) type'
        + '(?: in addition to their other types)?',
    'all creature types(?: in addition to their other types)?',
    '\\w+(?: \\w+)? in addition to their other types',
    '(?:Plains|Islands?|Swamps?|Mountains?|Forests?)',
    'all colors', 'legendary', 'colorless', 'the chosen [^,.]+'
];
const NEW_TYPE = `(${TYPE_ALTERNATIVES.join('|')})`;
const SUBJECT_VERB = '(?:it\'s|it is|is|are|they\'re|they are|he\'s|she\'s)';
const TYPE_CHANGE = new RegExp(`^${SUBJECT_VERB} ${NEW_TYPE}`, 'i');
const CREATURE = /\bcreatures?\b/i;
const SEPARATE_GRANT = / and (?:has|have|gains?) /i;
const WITH_ABILITY = /^with (?=["'])/i;

export default class TypeChangeEffect extends Effect {
    static get pattern() {
        return TYPE_CHANGE;
    }

    parseArguments(match) {
        this.description = match[1];
        this.separateFollowingGrant();
        const grants = this.consumeText(WITH_ABILITY)
            ? consumeGrantedAbilities(this) : consumeTrailingAbilities(this);
        Object.assign(this, grants);
    }

    separateFollowingGrant() {
        const index = this.description.search(SEPARATE_GRANT);
        if (index < 0) return;
        const tail = this.description.slice(index).trimStart();
        const separator = this.remainingStr.startsWith(',') ? '' : ' ';
        this.remainingStr = (tail + separator + this.remainingStr).trimEnd();
        this.description = this.description.slice(0, index);
    }

    get parts() {
        return [this.keywords, ...this.quotedAbilities].filter(Boolean);
    }

    get conferredKeywordNames() {
        return this.keywords?.names ?? [];
    }

    get addsCreatureType() {
        return CREATURE.test(this.description);
    }
}
