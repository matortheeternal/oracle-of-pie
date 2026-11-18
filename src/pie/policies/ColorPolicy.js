import { NotImplementedError } from '../../core/customErrors.js';

export const RARE_SHARE = 0.03;
export const MIN_SUPPORT = 15;

export default class ColorPolicy {
    static get id() {
        throw new NotImplementedError('id');
    }

    static appliesTo(cardColors) {
        throw new NotImplementedError('appliesTo');
    }

    static offendingColors(cardColors, profile, excluded) {
        throw new NotImplementedError('offendingColors');
    }

    static rareColors(cardColors, profile, excluded) {
        if (profile.support(excluded) < MIN_SUPPORT) return [];
        const isRare = color => profile.share(color, excluded) <= RARE_SHARE;
        return cardColors.colors.filter(isRare);
    }
}
