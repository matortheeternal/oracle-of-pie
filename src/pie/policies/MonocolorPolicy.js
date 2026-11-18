import ColorPolicy from './ColorPolicy.js';

export default class MonocolorPolicy extends ColorPolicy {
    static get id() {
        return 'monocolor';
    }

    static appliesTo(cardColors) {
        return cardColors.isMonocolored;
    }

    static offendingColors(cardColors, profile, excluded) {
        return this.rareColors(cardColors, profile, excluded);
    }
}
