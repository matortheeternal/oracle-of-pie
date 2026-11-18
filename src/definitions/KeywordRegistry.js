import DefinitionRegistry from './DefinitionRegistry.js';
import KeywordDefinition from './KeywordDefinition.js';
import KeywordFamilyDefinition from './KeywordFamilyDefinition.js';

export default class KeywordRegistry extends DefinitionRegistry {
    constructor(
        definitionClass = KeywordDefinition,
        familyClass = KeywordFamilyDefinition
    ) {
        super(definitionClass, familyClass);
    }

    definitionFor(name) {
        return this.find(definition => definition.matchesName(name));
    }

    get patternSources() {
        return this.definitions.map(definition => definition.patternSource);
    }
}
