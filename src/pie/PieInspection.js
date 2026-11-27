import Query from '../evaluators/Query.js';
import PieException from './PieException.js';
import ColorTiers from './ColorTiers.js';
import Citation from './Citation.js';
import { CANON_TIERS } from './canonTierTable.js';

const CANON = 'canon';
const HAND_FLOOR = 'floor';

function canonTiersOf(id, source = CANON) {
    return ColorTiers.fromNames(CANON_TIERS[id] ?? {}, source);
}

function floorsOf(spec, citation) {
    const { atLeast, allowedWherever, citationOmits = [] } = spec;
    return [
        citation?.tiersOmitting(citationOmits),
        atLeast && ColorTiers.fromNames(atLeast, HAND_FLOOR),
        allowedWherever && canonTiersOf(allowedWherever, `canon ${allowedWherever}`)
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
        this.subgroup = spec.subgroup ?? null;
        this.keyword = spec.keyword ?? null;
        this.canonCount = spec.canonCount ?? null;
        this.mentions = spec.mentions?.toLowerCase() ?? null;
        this.usesCanonTiers = !tiers;
        this.citation = Citation.of(spec.cites);
        this.tiers = tiers ?? defaultTiers(spec, this.citation);
        this.description = description;
        this.exceptions = exceptions.map(exception => new PieException(exception));
        this.query = Query.compile(spec.match);
    }

    exceptionsFor(node, context) {
        return this.exceptions.filter(exception => exception.matches(node, context));
    }

    appliesTo(face) {
        return !this.mentions || face.parsed.mentions(this.mentions);
    }

    matches(node, context) {
        return this.query.test(node, context);
    }
}
