import { RulesScribe, DEFAULT_TAG_SPECS } from '../../rules-scribe/src/index.js';

const STRUCTURAL_KEYWORDS = ['Enchant', 'Equip'];

export const EVALUATED_TAGS = DEFAULT_TAG_SPECS.map(spec => spec.tag);

export function createCorpusScribe(corpus, definitions = {}) {
    const keywords = new Set(corpus.flatMap(card => card.keywords ?? []));
    const allKeywords = [...keywords, ...STRUCTURAL_KEYWORDS];
    return new RulesScribe({ keywords: allKeywords, definitions });
}

export function cardKey(card) {
    return card.oracle_id || card.name;
}
