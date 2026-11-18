import Evaluator from './Evaluator.js';
import { DEFAULT_TAG_SPECS } from '../tags/index.js';

function toEvaluator(spec) {
    return spec instanceof Evaluator ? spec : new Evaluator(spec);
}

export default function createTagEvaluators(custom = []) {
    const byTag = new Map();
    for (const spec of [...DEFAULT_TAG_SPECS, ...custom]) byTag.set(spec.tag, spec);
    return [...byTag.values()].map(toEvaluator);
}
