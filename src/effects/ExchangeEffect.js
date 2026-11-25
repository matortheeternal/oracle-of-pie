import ObjectEffect from './ObjectEffect.js';

const EXCHANGE = /^exchanges? (?<property>control|life totals) of /i;
const COMPARATIVE_EXCHANGE = new RegExp(
    '^(?:exchanges? (?<property>your hand and graveyard|[^,.]+?'
        + ' life total with [^,.]+? (?:power|toughness))|exchange life'
        + ' totals)\\b', 'i'
);

export default class ExchangeEffect extends ObjectEffect {
    static get pattern() {
        return EXCHANGE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(COMPARATIVE_EXCHANGE);
    }

    parseArguments(match) {
        this.property = match.groups?.property?.toLowerCase() ?? 'life totals';
        this.hasStatedObjects = match[0].endsWith(' of ');
        if (this.hasStatedObjects) super.parseArguments(match);
    }

    get isComplete() {
        return !this.hasStatedObjects || super.isComplete;
    }
}
