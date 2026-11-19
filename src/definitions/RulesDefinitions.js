import KeywordRegistry from './KeywordRegistry.js';
import KeywordActionDefinition from './KeywordActionDefinition.js';
import KeywordActionFamilyDefinition from './KeywordActionFamilyDefinition.js';
import TokenRegistry from './TokenRegistry.js';
import { DEFAULT_DEFINITIONS } from './defaultDefinitions.js';

export default class RulesDefinitions {
    static withDefaults(custom = {}) {
        return new RulesDefinitions().addAll(DEFAULT_DEFINITIONS).addAll(custom);
    }

    constructor() {
        this.keywords = new KeywordRegistry();
        this.actions = new KeywordRegistry(
            KeywordActionDefinition, KeywordActionFamilyDefinition
        );
        this.tokens = new TokenRegistry();
        this.noncreatureSubtypes = new Set();
        this.batchWords = new Set();
    }

    addAll(definitions) {
        const { keywords = [], actions = [], tokens = [] } = definitions;
        const { noncreatureSubtypes = [], batchWords = [] } = definitions;
        this.keywords.addAll(keywords);
        this.actions.addAll(actions);
        this.tokens.addAll(tokens);
        for (const subtype of noncreatureSubtypes) this.noncreatureSubtypes.add(subtype);
        for (const word of batchWords) this.batchWords.add(word.toLowerCase());
        return this;
    }

    isNoncreatureSubtype(subtype) {
        return this.noncreatureSubtypes.has(subtype);
    }

    isBatchWord(word) {
        return this.batchWords.has(word);
    }
}
