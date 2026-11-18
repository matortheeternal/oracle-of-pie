import KeywordRegistry from './KeywordRegistry.js';
import KeywordActionDefinition from './KeywordActionDefinition.js';
import TokenRegistry from './TokenRegistry.js';
import { DEFAULT_DEFINITIONS } from './defaultDefinitions.js';

export default class RulesDefinitions {
    static withDefaults(custom = {}) {
        return new RulesDefinitions().addAll(DEFAULT_DEFINITIONS).addAll(custom);
    }

    constructor() {
        this.keywords = new KeywordRegistry();
        this.actions = new KeywordRegistry(KeywordActionDefinition);
        this.tokens = new TokenRegistry();
    }

    addAll({ keywords = [], actions = [], tokens = [] }) {
        this.keywords.addAll(keywords);
        this.actions.addAll(actions);
        this.tokens.addAll(tokens);
        return this;
    }
}
