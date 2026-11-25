import ObjectEffect from './ObjectEffect.js';

const EXCHANGE = /^exchanges? (?<property>control|life totals) of /i;

export default class ExchangeEffect extends ObjectEffect {
    static get pattern() {
        return EXCHANGE;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.property = match.groups.property.toLowerCase();
    }
}
