import Effect from './Effect.js';

const LEGEND_RULE_EXEMPTION = /^the "legend rule" doesn't apply to ([^,.]+)/i;

export default class LegendRuleExemptionEffect extends Effect {
    static get pattern() {
        return LEGEND_RULE_EXEMPTION;
    }

    parseArguments(match) {
        this.exempted = match[1];
    }
}
