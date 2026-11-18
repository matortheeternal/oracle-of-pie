import DefinitionRegistry from './DefinitionRegistry.js';
import TokenDefinition from './TokenDefinition.js';

export default class TokenRegistry extends DefinitionRegistry {
    constructor() {
        super(TokenDefinition);
    }

    definitionsNamedIn(description) {
        return this.definitions.filter(definition => definition.isNamedIn(description));
    }
}
