import KeywordDefinition from './KeywordDefinition.js';

export default class KeywordFamilyDefinition extends KeywordDefinition {
    constructor({ name, pattern, reminder }) {
        super({ name, reminder });
        this.pattern = new RegExp(`^(?:${pattern.source})$`, 'i');
        this.source = pattern.source;
    }

    get patternSource() {
        return this.source;
    }

    matchesName(name) {
        return this.pattern.test(name);
    }

    valuesFor(keyword) {
        const captured = keyword.name.match(this.pattern).groups;
        return { ...super.valuesFor(keyword), ...captured };
    }
}
