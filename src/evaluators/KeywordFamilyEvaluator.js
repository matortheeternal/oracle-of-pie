import Evaluator from './Evaluator.js';

const SPACES = /\s+/g;
const KEYWORD_PLACEHOLDER = '{keyword}';

export default class KeywordFamilyEvaluator extends Evaluator {
    static matches(spec) {
        return Boolean(spec.family);
    }

    static slug(keyword) {
        return keyword.toLowerCase().replace(SPACES, '-');
    }

    constructor({ family, keywords, ...spec }) {
        super({ ...spec, tag: family });
        this.family = family;
        this.keywordsKey = keywords;
    }

    ownsTag(tag) {
        const [prefix, suffix] = this.family.split(KEYWORD_PLACEHOLDER);
        return tag.length > prefix.length + suffix.length
            && tag.startsWith(prefix) && tag.endsWith(suffix);
    }

    tagFor(keyword) {
        const slug = KeywordFamilyEvaluator.slug(keyword);
        return this.family.replace(KEYWORD_PLACEHOLDER, slug);
    }

    tagsFor(node, context) {
        if (!this.matches(node, context)) return [];
        return node[this.keywordsKey].map(keyword => this.tagFor(keyword));
    }
}
