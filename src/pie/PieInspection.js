import Query from '../evaluators/Query.js';
import PieException from './PieException.js';
import ColorTiers from './ColorTiers.js';
import { CANON_TIERS } from './canonTierTable.js';

function canonTiersOf(id) {
    return ColorTiers.fromNames(CANON_TIERS[id] ?? {});
}

function defaultTiers(id, allowedWherever) {
    const own = canonTiersOf(id);
    if (!allowedWherever) return own;
    return own.loosenedBy(canonTiersOf(allowedWherever));
}

export default class PieInspection {
    constructor(spec) {
        const { id, title, group, tiers, description = '', exceptions = [] } = spec;
        this.id = id;
        this.title = title;
        this.group = group;
        this.tiers = tiers ?? defaultTiers(id, spec.allowedWherever);
        this.description = description;
        this.exceptions = exceptions.map(exception => new PieException(exception));
        this.query = Query.compile(spec.match);
    }

    exceptionFor(node, context) {
        const applies = exception => exception.matches(node, context);
        return this.exceptions.find(applies) ?? null;
    }

    matches(node, context) {
        return this.query.test(node, context);
    }
}
