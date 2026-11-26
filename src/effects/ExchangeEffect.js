import ObjectEffect from './ObjectEffect.js';

const EXCHANGE = /^exchanges? (?<property>control|life totals) (?<relation>of|with) /i;
const COMPARATIVE_EXCHANGE = new RegExp(
    '^(?:exchanges? (?<property>your hand and graveyard|[^,.]+?'
        + ' life total with [^,.]+? (?:power|toughness))|exchange life'
        + ' totals)\\b', 'i'
);
const TEXT_BOXES = new RegExp(
    '^exchanges? (?<first>his|her|its) text box and '
        + '(?<second>another creature)\'s(?=$|[,.])',
    'i'
);

export default class ExchangeEffect extends ObjectEffect {
    static get pattern() {
        return EXCHANGE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(COMPARATIVE_EXCHANGE)
            ?? str.match(TEXT_BOXES);
    }

    parseArguments(match) {
        const owners = match.groups?.first
            ? [match.groups.first, match.groups.second] : [];
        this.textBoxOwners = owners.map(owner => owner.toLowerCase());
        const defaultProperty = owners.length ? 'text box' : 'life totals';
        this.property = match.groups?.property?.toLowerCase() ?? defaultProperty;
        this.hasStatedObjects = Boolean(match.groups?.relation);
        if (this.hasStatedObjects) super.parseArguments(match);
    }

    get isComplete() {
        return !this.hasStatedObjects || super.isComplete;
    }
}
