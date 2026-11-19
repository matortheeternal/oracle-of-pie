import KeywordActionDefinition from './KeywordActionDefinition.js';

export default class KeywordActionFamilyDefinition extends KeywordActionDefinition {
    constructor({ pattern, ...spec }) {
        super(spec);
        this.pattern = new RegExp(`^(?:${pattern.source})$`, 'i');
        this.source = pattern.source;
    }

    get patternSource() {
        return this.source;
    }

    matchesName(wording) {
        return this.pattern.test(wording);
    }

    valuesFor(effect) {
        const captured = effect.actionText.match(this.pattern).groups;
        return { ...super.valuesFor(effect), ...captured };
    }
}
