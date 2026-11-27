import Query from '../evaluators/Query.js';
import PieException from './PieException.js';
import ColorTiers from './ColorTiers.js';
import { TIERS_BY_NAME } from './ColorTier.js';
import Citation from './Citation.js';
import { CANON_TIERS } from './canonTierTable.js';

const CANON = 'canon';
const HAND_FLOOR = 'floor';
const PROJECT = 'project';

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

function overriddenTiers(tiers, overrides = {}) {
    const named = Object.entries(overrides)
        .map(([color, name]) => [color, TIERS_BY_NAME[name]]);
    return tiers.withOverrides(Object.fromEntries(named), PROJECT);
}

function defaultTiers(spec, citation) {
    const loosen = (tiers, floor) => tiers.loosenedBy(floor);
    return floorsOf(spec, citation).reduce(loosen, canonTiersOf(spec.id));
}

function tiersOf(spec, citation) {
    const tiers = spec.tiers ?? defaultTiers(spec, citation);
    return overriddenTiers(tiers, spec.tierOverrides);
}

const PRESENTATION_DEFAULTS = {
    subgroup: null, keyword: null, canonCount: null, cards: null, scryfall: null,
    example: null
};

function pickPresentation(spec) {
    const keys = Object.keys(PRESENTATION_DEFAULTS)
        .filter(key => spec[key] !== undefined);
    return Object.fromEntries(keys.map(key => [key, spec[key]]));
}

export default class PieInspection {
    constructor(spec) {
        const { id, title, group, description = '', exceptions = [] } = spec;
        Object.assign(this, PRESENTATION_DEFAULTS, pickPresentation(spec));
        this.id = id;
        this.title = title;
        this.group = group;
        this.mentions = spec.mentions?.toLowerCase() ?? null;
        this.usesCanonTiers = !spec.tiers;
        this.citation = Citation.of(spec.cites);
        this.tiers = tiersOf(spec, this.citation);
        this.description = description;
        this.exceptions = exceptions.map(PieException.from).filter(Boolean);
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
