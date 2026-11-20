import TriggerEvent from './TriggerEvent.js';
import WithoutDying from './qualifiers/WithoutDying.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const BATTLEFIELD = 'battlefield';
const GRAVEYARD = 'graveyard';
const ZONE = '(?:the (?<battlefield>battlefield)|your (?<graveyard>graveyard))';
const LEAVES = new RegExp(`^(?<subject>.+?) leaves? ${ZONE}\\b`, 'i');

export default class LeavesEvent extends TriggerEvent {
    static get pattern() {
        return LEAVES;
    }

    static get qualifierParsers() {
        return [WithoutDying, TurnWindow];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.zone = match.groups.battlefield ? BATTLEFIELD : GRAVEYARD;
    }

    get isFromBattlefield() {
        return this.zone === BATTLEFIELD;
    }

    get isFromGraveyard() {
        return this.zone === GRAVEYARD;
    }

    get isWithoutDying() {
        return Boolean(this.qualifierOfKind(WithoutDying));
    }

    get isRepeatable() {
        return !this.isSelf && !this.subjectPhrase?.isEnchanted;
    }
}
