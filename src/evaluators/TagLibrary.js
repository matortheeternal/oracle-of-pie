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
    }

    get evaluators() {
        return [...this.byTag.values()];
    }

    get(tag) {
        const evaluator = this.byTag.get(tag);
        if (!evaluator) throw new QueryError(`Unknown tag "${tag}"`);
        return evaluator;
    }
}
