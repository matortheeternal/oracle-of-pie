import ObjectEffect from './ObjectEffect.js';
import ZoneModifier from '../phrases/modifiers/ZoneModifier.js';

const LEAVE = /^leave (?=[^,.]+ in (?:your|their|its owner's) graveyard)/i;

export default class LeaveInZoneEffect extends ObjectEffect {
    static get pattern() {
        return LEAVE;
    }

    get retainedZone() {
        return this.primaryObject?.modifiers.find(
            modifier => modifier instanceof ZoneModifier
        );
    }

    get isComplete() {
        return Boolean(this.retainedZone);
    }
}
