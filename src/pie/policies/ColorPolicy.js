import { NotImplementedError } from '../../core/customErrors.js';

export default class ColorPolicy {
    static get id() {
        throw new NotImplementedError('id');
    }

    static appliesTo(cardColors) {
        throw new NotImplementedError('appliesTo');
    }

    static judge(cardColors, tiers) {
        throw new NotImplementedError('judge');
    }

    static verdict(offending, tier) {
        return offending.length ? { offending, tier } : null;
    }
}
