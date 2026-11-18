export default class PieFlag {
    constructor(attribution, policy, { offending, tier }, profile = null) {
        this.attribution = attribution;
        this.policy = policy;
        this.offending = offending;
        this.tier = tier;
        this.profile = profile;
    }

    get inspection() {
        return this.attribution.inspection;
    }

    get severity() {
        return this.tier.severity;
    }

    toJSON() {
        const { inspection, evidence, colors } = this.attribution;
        return {
            inspection: inspection.id,
            exception: this.attribution.exception?.id ?? null,
            title: inspection.title,
            colors: String(colors),
            policy: this.policy.id,
            severity: this.severity,
            offending: this.offending,
            evidence,
            shares: this.profile?.shares() ?? null,
            examples: this.profile?.examples ?? null
        };
    }
}
