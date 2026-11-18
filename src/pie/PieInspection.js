import Query from '../evaluators/Query.js';
import PieException from './PieException.js';
import ColorTiers from './ColorTiers.js';
import Citation from './Citation.js';
import { CANON_TIERS } from './canonTierTable.js';

function canonTiersOf(id) {
    return ColorTiers.fromNames(CANON_TIERS[id] ?? {});
}

function floorsOf(spec, citation) {
    return [
        citation?.tiers,
        spec.atLeast && ColorTiers.fromNames(spec.atLeast),
        spec.allowedWherever && canonTiersOf(spec.allowedWherever)
    ].filter(Boolean);
}

function defaultTiers(spec, citation) {
    const loosen = (tiers, floor) => tiers.loosenedBy(floor);
    return floorsOf(spec, citation).reduce(loosen, canonTiersOf(spec.id));
}

export default class PieInspection {
    constructor(spec) {
        const { id, title, group, tiers, description = '', exceptions = [] } = spec;
        this.id = id;
        this.title = title;
        this.group = group;
        this.citation = Citation.of(spec.cites);
        this.tiers = tiers ?? defaultTiers(spec, this.citation);
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
