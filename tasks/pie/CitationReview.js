import { COLORS, DEFAULT_PIE_INSPECTIONS, PieInspector } from '../../src/index.js';

function flagGroupKey(policy, inspection) {
    return JSON.stringify([policy, inspection]);
}

function inspectionWithoutCitation(spec) {
    return { ...spec, citationOmits: COLORS };
}

export default class CitationReview {
    constructor(inspector, disabled) {
        const inspections = DEFAULT_PIE_INSPECTIONS.filter(spec => spec.cites)
            .map(inspectionWithoutCitation);
        this.withoutCitation = new PieInspector({ inspections, disabled });
        this.effective = new Map(inspector.inspections.map(inspection => [
            inspection.id, inspection
        ]));
        this.flags = [];
    }

    add(card, faces, ordinaryFlags) {
        const ordinary = new Set(ordinaryFlags.map(flag =>
            flagGroupKey(flag.policy.id, flag.inspection.id)));
        for (const flag of this.withoutCitation.inspect(faces)) {
            const json = flag.toJSON();
            const key = flagGroupKey(json.policy, json.inspection);
            if (ordinary.has(key) || !json.citation) continue;
            const { colors, exceptions } = flag.attribution;
            const inspection = this.effective.get(json.inspection);
            const applyException = (tiers, exception) => exception.tiersOver(tiers);
            const effective = exceptions.reduce(applyException, inspection.tiers);
            this.flags.push({
                ...json,
                name: card.name,
                effectiveTiers: effective.reasonsFor(colors.colors)
            });
        }
    }
}
