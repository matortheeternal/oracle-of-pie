import KeywordDefinition from './KeywordDefinition.js';

export default class KeywordActionDefinition extends KeywordDefinition {
    valuesFor(effect) {
        return { parameter: effect.amountText ?? '' };
    }
}
