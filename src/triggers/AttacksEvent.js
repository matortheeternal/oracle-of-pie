import TriggerEvent from './TriggerEvent.js';
import AttackRecipient from './objects/AttackRecipient.js';
import Alone from './qualifiers/Alone.js';
import WhileSaddled from './qualifiers/WhileSaddled.js';
import AttackingWith from './qualifiers/AttackingWith.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import FirstTime from './qualifiers/FirstTime.js';
import Unblocked from './qualifiers/Unblocked.js';
import CoordinatedSubject from './subjects/CoordinatedSubject.js';
import AttackCondition from './qualifiers/AttackCondition.js';

const ATTACKS = /^(?<subject>.+?)(?<next> next)? attacks?\b/i;

export default class AttacksEvent extends TriggerEvent {
    static get pattern() {
        return ATTACKS;
    }

    static get subjectParsers() {
        return [CoordinatedSubject, ...super.subjectParsers];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isNext = Boolean(match.groups.next);
    }

    static get qualifierParsers() {
        return [
            Alone, WhileSaddled, AttackCondition, AttackingWith, Unblocked,
            FirstTime, TurnWindow
        ];
    }

    parseObjectPhrase() {
        return this.consume([AttackRecipient]);
    }

    get isAlone() {
        return Boolean(this.qualifierOfKind(Alone));
    }

    get isWhileSaddled() {
        return Boolean(this.qualifierOfKind(WhileSaddled));
    }

    get isUnblocked() {
        return Boolean(this.qualifierOfKind(Unblocked));
    }

    get attackingGroup() {
        return this.qualifierOfKind(AttackingWith)?.group ?? null;
    }
}
