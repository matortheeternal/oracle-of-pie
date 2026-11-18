import ColorPolicy from './ColorPolicy.js';

export default class GoldPolicy extends ColorPolicy {
    static get id() {
        return 'gold';
    }

    static appliesTo(cardColors) {
        return cardColors.isGold;
    }

    static judge(cardColors, tiers) {
        const offending = tiers.flaggedColors(cardColors.colors);
        if (offending.length < cardColors.colors.length) return null;
        return this.verdict(offending, tiers.mildestOf(cardColors.colors));
    }
}
