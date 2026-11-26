import KeywordDefinition from './KeywordDefinition.js';

export default class KeywordActionDefinition extends KeywordDefinition {
    constructor({ findsRandomCard = false, ...spec }) {
        super(spec);
        this.findsRandomCard = findsRandomCard;
    }

    valuesFor(effect) {
        return { parameter: effect.amountText ?? '' };
    }
}
