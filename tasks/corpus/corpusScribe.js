import { RulesScribe, TAG_RULES } from '../../rules-scribe/src/index.js';

const STRUCTURAL_KEYWORDS = ['Enchant', 'Equip'];

export const EVALUATED_TAGS = [...new Set(TAG_RULES.map(rule => rule.tag))];

export function createCorpusScribe(corpus) {
    const keywords = new Set(corpus.flatMap(card => card.keywords ?? []));
    return new RulesScribe({ keywords: [...keywords, ...STRUCTURAL_KEYWORDS] });
}

export function cardKey(card) {
    return card.oracle_id || card.name;
}
