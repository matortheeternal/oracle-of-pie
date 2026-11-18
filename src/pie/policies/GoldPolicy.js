import ColorPolicy from './ColorPolicy.js';

export default class GoldPolicy extends ColorPolicy {
    static get id() {
        return 'gold';
    }

    static appliesTo(cardColors) {
        return cardColors.isGold;
    }

    static offendingColors(cardColors, profile) {
        const rare = this.rareColors(cardColors, profile, null);
        return rare.length === cardColors.colors.length ? rare : [];
    }
}
