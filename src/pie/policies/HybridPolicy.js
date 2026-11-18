import ColorPolicy from './ColorPolicy.js';

export default class HybridPolicy extends ColorPolicy {
    static get id() {
        return 'hybrid';
    }

    static appliesTo(cardColors) {
        return cardColors.isHybrid;
    }

    static offendingColors(cardColors, profile) {
        return this.rareColors(cardColors, profile, null);
    }
}
