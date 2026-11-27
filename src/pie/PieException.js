import Citation from './Citation.js';
import { PRIMARY } from './ColorTier.js';
import { conditionFor } from './conditions/index.js';

export default class PieException {
    static from(spec) {
        const condition = conditionFor(spec);
        if (condition) return new PieException(condition, spec);
        console.warn(`Unknown pie exception condition ${spec.condition}`);
        return null;
    }

    constructor(condition, spec) {
        this.condition = condition;
        this.id = condition.exceptionIdFor(spec);
        this.title = condition.titleFor(spec);
        this.colors = spec.colors;
        this.arguments = condition.argumentsOf(spec);
        this.citation = Citation.of(spec.cites);
        this.query = condition.queryFor(spec);
    }

    matches(node, context) {
        return this.query.test(node, context);
    }

    tiersOver(baseTiers) {
        const allowed = Object.fromEntries(this.colors.map(color => [color, PRIMARY]));
        return baseTiers.withOverrides(allowed, `exception ${this.id}`);
    }
}
