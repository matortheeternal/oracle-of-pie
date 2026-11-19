import TriggerEvent from './TriggerEvent.js';
import Alone from './qualifiers/Alone.js';
import WhileSaddled from './qualifiers/WhileSaddled.js';
import AttackingWith from './qualifiers/AttackingWith.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const ATTACKS = /^(?<subject>.+?) attacks?\b/i;

export default class AttacksEvent extends TriggerEvent {
    static get pattern() {
        return ATTACKS;
    }

    static get qualifierParsers() {
        return [Alone, WhileSaddled, AttackingWith, TurnWindow];
    }

    get isAlone() {
        return Boolean(this.qualifierOfKind(Alone));
    }

    get isWhileSaddled() {
        return Boolean(this.qualifierOfKind(WhileSaddled));
    }

    get attackingGroup() {
        return this.qualifierOfKind(AttackingWith)?.group ?? null;
    }
}
