import Evaluator from './Evaluator.js';
import { DEFAULT_TAG_SPECS } from '../tags/index.js';
import { QueryError } from '../core/customErrors.js';

function toEvaluator(spec) {
    return spec instanceof Evaluator ? spec : new Evaluator(spec);
}

export default class TagLibrary {
    static withDefaults(custom = []) {
        return new TagLibrary([...DEFAULT_TAG_SPECS, ...custom]);
    }

    constructor(specs) {
        this.byTag = new Map();
        for (const spec of specs) this.byTag.set(spec.tag, toEvaluator(spec));
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
