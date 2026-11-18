import {
    RulesScribe, DEFAULT_TAG_SPECS, KeywordFamilyEvaluator
} from '../../rules-scribe/src/index.js';

const STRUCTURAL_KEYWORDS = ['Enchant', 'Equip'];

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

function cardText(card) {
    return card.faces.map(face => face.oracle_text ?? '').join('\n');
}

function usedOutsideLabel(keyword, card) {
    const escaped = keyword.replace(REGEX_SPECIAL, '\\$&');
    const unlabeled = new RegExp(`(?<![\\w-])${escaped}(?![\\w-])(?! —| counter)`, 'i');
    return unlabeled.test(cardText(card));
}

function cardKeywords(card) {
    return (card.keywords ?? []).filter(keyword => usedOutsideLabel(keyword, card));
}

function corpusKeywords(corpus) {
    return new Set(corpus.flatMap(cardKeywords));
}

function familyTags(spec, keywords, tree) {
    const evaluator = new KeywordFamilyEvaluator(spec);
    const tags = [...keywords].map(keyword => evaluator.tagFor(keyword));
    return tags.filter(tag => tree.has(tag));
}

function specTags(spec, keywords, tree) {
    if (!KeywordFamilyEvaluator.matches(spec)) return [spec.tag];
    return familyTags(spec, keywords, tree);
}

export function evaluatedTags(corpus, tree) {
    const keywords = corpusKeywords(corpus);
    const tags = DEFAULT_TAG_SPECS.flatMap(spec => specTags(spec, keywords, tree));
    return [...new Set(tags)];
}

export function createCorpusScribe(corpus, definitions = {}) {
    const keywords = corpusKeywords(corpus);
    const allKeywords = [...keywords, ...STRUCTURAL_KEYWORDS];
    return new RulesScribe({ keywords: allKeywords, definitions });
}

export function cardKey(card) {
    return card.oracle_id || card.name;
}
