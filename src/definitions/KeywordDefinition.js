import Definition from './Definition.js';

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

export default class KeywordDefinition extends Definition {
    get patternSource() {
        return this.name.replace(REGEX_SPECIAL, '\\$&');
    }

    matchesName(name) {
        return name.toLowerCase() === this.key;
    }

    valuesFor(keyword) {
        return { parameter: keyword.parameter ?? '' };
    }
}
