import Effect from './Effect.js';
import consumeGrantedAbilities from '../values/consumeGrantedAbilities.js';

const GAINS = /^(?:gains?|has|have) (?=["'a-z])/i;
const ALL_CHARACTERISTICS = new RegExp(
    '^all (?<property>creature types|names of nonlegendary'
        + ' creature cards)(?<additional> in addition to its(?:'
        + ' other)? (?:types|name))?', 'i'
);
const BORROWED_ABILITIES = new RegExp(
    '^all (?<kind>activated(?: and triggered)?) abilities of '
    + '(?<source>[^,.]+?)(?= and (?:gets|can)\\b| until\\b|$|[,.])', 'i'
);
const FOR_OBJECTS = new RegExp(
    '^for (?:artifacts|creatures|enchantments|instant and sorcery spells)\\b', 'i'
);
const CONDITION = /^(as long as [^,.]+|during your turn|for each (?:[^,.]|, (?=non))+)/i;

export default class GrantEffect extends Effect {
    static get pattern() {
        return GAINS;
    }

    parseArguments(match) {
        Object.assign(this, consumeGrantedAbilities(this));
        const borrowed = this.consumeText(BORROWED_ABILITIES)?.groups;
        this.borrowedAbilityKind = borrowed?.kind.toLowerCase() ?? null;
        this.borrowedAbilitySource = borrowed?.source ?? null;
        this.condition = this.consumeText(CONDITION)?.[1] ?? null;
        this.restrictedTo = this.consumeText(FOR_OBJECTS)?.[0] ?? null;
        this.characteristics = this.consumeText(ALL_CHARACTERISTICS)?.groups ?? null;
    }

    get parts() {
        return [this.keywords, ...this.quotedAbilities].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.keywords || this.quoted || this.borrowedAbilitySource
            || this.characteristics);
    }

    get grantsKeywords() {
        return Boolean(this.keywords);
    }

    get grantedKeywordNames() {
        return this.keywords?.names ?? [];
    }

    get conferredKeywordNames() {
        return this.grantedKeywordNames;
    }

    grantsKeyword(name) {
        return Boolean(this.keywords?.names.includes(name));
    }
}
