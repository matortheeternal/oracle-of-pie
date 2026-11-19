import KeywordDefinition from './KeywordDefinition.js';

export default class KeywordActionDefinition extends KeywordDefinition {
    constructor({ name, reminder = null, findsRandomCard = false }) {
        super({ name, reminder });
        this.findsRandomCard = findsRandomCard;
    }

    valuesFor(effect) {
        return { parameter: effect.amountText ?? '' };
    }
}
