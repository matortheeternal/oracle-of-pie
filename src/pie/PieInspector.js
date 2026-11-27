import PieInspection from './PieInspection.js';
import ColorProfile from './ColorProfile.js';
import Attribution from './Attribution.js';
import PieFlag from './PieFlag.js';
import attributableMatches from './attributableMatches.js';
import { COLOR_POLICIES } from './policies/index.js';
import { DEFAULT_PIE_INSPECTIONS } from './inspections/index.js';

function configured(spec, override = {}) {
    const { tiers, exceptions = spec.exceptions } = override;
    return { ...spec, tierOverrides: tiers, exceptions };
}

function toInspection(spec, overrides) {
    if (spec instanceof PieInspection) return spec;
    return new PieInspection(configured(spec, overrides[spec.id]));
}

function isDisabled(spec, overrides) {
    return Boolean(overrides[spec.id]?.disabled);
}

function* attributeOccurrences(faces, inspection) {
    for (const [faceIndex, face] of faces.entries()) {
        if (!inspection.appliesTo(face)) continue;
        for (const match of attributableMatches(face, inspection))
            yield new Attribution(inspection, face, match, faceIndex);
    }
}

export default class PieInspector {
    static createInspections(options) {
        const { inspections = DEFAULT_PIE_INSPECTIONS, overrides = {} } = options;
        const { disabled = [] } = options;
        const skipped = new Set(disabled);
        const enabled = inspections.filter(spec => !isDisabled(spec, overrides));
        const all = enabled.map(spec => toInspection(spec, overrides));
        return all.filter(inspection => !skipped.has(inspection.id));
    }

    constructor({ profiles = {}, ...options } = {}) {
        this.inspections = PieInspector.createInspections(options);
        this.profiles = new Map(Object.entries(profiles)
            .map(([id, data]) => [id, new ColorProfile(data)]));
    }

    attribute(faces, inspection) {
        return attributeOccurrences(faces, inspection).next().value ?? null;
    }

    attributions(faces) {
        return this.inspections
            .map(inspection => this.attribute(faces, inspection))
            .filter(Boolean);
    }

    inspectionsUsedBy(cards) {
        const attributions = cards.flatMap(faces => this.attributions(faces));
        return new Set(attributions.map(attribution => attribution.inspection));
    }

    judge(attribution) {
        const colors = attribution.colors;
        const policy = COLOR_POLICIES.find(candidate => candidate.appliesTo(colors));
        const verdict = policy?.judge(colors, attribution.tiers);
        if (!verdict) return null;
        const profile = this.profiles.get(attribution.inspection.id) ?? null;
        return new PieFlag(attribution, policy, verdict, profile);
    }

    *judgedOccurrences(faces) {
        for (const inspection of this.inspections) {
            for (const attribution of attributeOccurrences(faces, inspection))
                yield this.judge(attribution);
        }
    }

    inspect(faces) {
        const flags = new Map();
        for (const flag of this.judgedOccurrences(faces)) {
            if (!flag || flags.has(flag.decisionKey)) continue;
            flags.set(flag.decisionKey, flag);
        }
        return [...flags.values()];
    }
}
