import ColorPolicy from './ColorPolicy.js';

export default class MonocolorPolicy extends ColorPolicy {
    static get id() {
        return 'monocolor';
    }

    static appliesTo(cardColors) {
        return cardColors.isMonocolored;
    }

    static judge(cardColors, tiers) {
        const offending = tiers.flaggedColors(cardColors.colors);
        return this.verdict(offending, tiers.worstOf(cardColors.colors));
    }
}
