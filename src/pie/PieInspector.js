import PieInspection from './PieInspection.js';
import ColorProfile from './ColorProfile.js';
import Attribution from './Attribution.js';
import PieFlag from './PieFlag.js';
import findAttributableMatch from './findAttributableMatch.js';
import { COLOR_POLICIES } from './policies/index.js';
import { DEFAULT_PIE_INSPECTIONS } from './inspections/index.js';

function toInspection(spec) {
    return spec instanceof PieInspection ? spec : new PieInspection(spec);
}

function attributeFace(face, faceIndex, inspection) {
    if (!inspection.appliesTo(face)) return null;
    const match = findAttributableMatch(face, inspection);
    return match ? new Attribution(inspection, face, match, faceIndex) : null;
}

export default class PieInspector {
    static createInspections({ inspections = DEFAULT_PIE_INSPECTIONS, disabled = [] }) {
        const skipped = new Set(disabled);
        const all = inspections.map(toInspection);
        return all.filter(inspection => !skipped.has(inspection.id));
    }

    constructor({ profiles = {}, ...options } = {}) {
        this.inspections = PieInspector.createInspections(options);
        this.profiles = new Map(Object.entries(profiles)
            .map(([id, data]) => [id, new ColorProfile(data)]));
    }

    attribute(faces, inspection) {
        for (const [faceIndex, face] of faces.entries()) {
            const attribution = attributeFace(face, faceIndex, inspection);
            if (attribution) return attribution;
        }
        return null;
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

    inspect(faces) {
        return this.attributions(faces)
            .map(attribution => this.judge(attribution))
            .filter(Boolean);
    }
}
