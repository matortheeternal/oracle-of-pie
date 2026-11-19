import Evaluator from './Evaluator.js';
import KeywordFamilyEvaluator from './KeywordFamilyEvaluator.js';
import { DEFAULT_TAG_SPECS } from '../tags/index.js';
import { QueryError } from '../core/customErrors.js';

const EVALUATOR_CLASSES = [KeywordFamilyEvaluator, Evaluator];

function toEvaluator(spec) {
    if (spec instanceof Evaluator) return spec;
    const EvaluatorClass = EVALUATOR_CLASSES.find(candidate => candidate.matches(spec));
    return new EvaluatorClass(spec);
}

export default class TagLibrary {
    static withDefaults(custom = []) {
        return new TagLibrary([...DEFAULT_TAG_SPECS, ...custom]);
    }

    constructor(specs) {
        this.byTag = new Map();
        for (const evaluator of specs.map(toEvaluator))
            this.byTag.set(evaluator.tag, evaluator);
        this.evaluators = [...this.byTag.values()];
        this.resolved = new Map();
        this.tagCache = new WeakMap();
    }

    get(tag) {
        if (!this.resolved.has(tag)) this.resolved.set(tag, this.resolve(tag));
        return this.resolved.get(tag);
    }

    resolve(tag) {
        const evaluator = this.byTag.get(tag) ?? this.familyOwning(tag);
        if (!evaluator) throw new QueryError(`Unknown tag "${tag}"`);
        return evaluator;
    }

    hasTag(tag, node, context) {
        return this.tagsFor(this.get(tag), node, context).includes(tag);
    }

    tagsFor(evaluator, node, context) {
        const cached = this.cachedTags(node, context);
        if (cached.has(evaluator)) return cached.get(evaluator);
        cached.set(evaluator, evaluator.tagsFor(node, context));
        return cached.get(evaluator);
    }

    cachedTags(node, context) {
        if (!this.tagCache.has(node)) this.tagCache.set(node, new WeakMap());
        const byContext = this.tagCache.get(node);
        if (!byContext.has(context)) byContext.set(context, new Map());
        return byContext.get(context);
    }

    familyOwning(tag) {
        return this.evaluators.find(evaluator => evaluator.ownsTag(tag));
    }
}
