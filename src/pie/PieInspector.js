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

function attributeFace(face, inspection) {
    const match = findAttributableMatch(face, inspection);
    return match ? new Attribution(inspection, face, match) : null;
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
        for (const face of faces) {
            const attribution = attributeFace(face, inspection);
            if (attribution) return attribution;
        }
        return null;
    }

    attributions(faces) {
        return this.inspections
            .map(inspection => this.attribute(faces, inspection))
            .filter(Boolean);
    }

    judge(attribution, excludeSelf) {
        const profile = this.profiles.get(attribution.inspection.id);
        const colors = attribution.colors;
        const policy = COLOR_POLICIES.find(candidate => candidate.appliesTo(colors));
        if (!profile || !policy) return null;
        const excluded = excludeSelf ? attribution.colors.soleColor : null;
        const offending = policy.offendingColors(attribution.colors, profile, excluded);
        if (!offending.length) return null;
        return new PieFlag(attribution, policy, offending, profile);
    }

    inspect(faces, { excludeSelf = false } = {}) {
        return this.attributions(faces)
            .map(attribution => this.judge(attribution, excludeSelf))
            .filter(Boolean);
    }
}
