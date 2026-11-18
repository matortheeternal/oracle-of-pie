import ColorPolicy from './ColorPolicy.js';

export default class HybridPolicy extends ColorPolicy {
    static get id() {
        return 'hybrid';
    }

    static appliesTo(cardColors) {
        return cardColors.isHybrid;
    }

    static judge(cardColors, tiers) {
        const offending = tiers.flaggedColors(cardColors.colors);
        return this.verdict(offending, tiers.worstOf(cardColors.colors));
    }
}
