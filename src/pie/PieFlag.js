export default class PieFlag {
    constructor(attribution, policy, offending, profile) {
        this.attribution = attribution;
        this.policy = policy;
        this.offending = offending;
        this.profile = profile;
    }

    get inspection() {
        return this.attribution.inspection;
    }

    toJSON() {
        const { inspection, evidence, colors } = this.attribution;
        return {
            inspection: inspection.id,
            title: inspection.title,
            colors: String(colors),
            policy: this.policy.id,
            offending: this.offending,
            evidence,
            shares: this.profile.shares(),
            examples: this.profile.examples
        };
    }
}
