import TriggerEvent from './TriggerEvent.js';
import ZoneOrigin from './qualifiers/ZoneOrigin.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const OWNER = '(?<owner>a|your|an opponent\'s)';
const OWNED_DESTINATION = `${OWNER} (?<ownedZone>graveyard|library)`;
const DESTINATION = `(?:${OWNED_DESTINATION}|(?<zone>exile|graveyards|the command zone))`;
const PUT_INTO = new RegExp(
    `^(?<subject>.+?) (?:is|are) put into ${DESTINATION}\\b`, 'i'
);
const PUT_ONTO = /^(?<subject>.+?) (?:is|are) put onto the (?<zone>battlefield)\b/i;
const ZONE_NAMES = { graveyards: 'graveyard', 'the command zone': 'command zone' };

function destinationName({ ownedZone, zone }) {
    const name = (ownedZone ?? zone).toLowerCase();
    return ZONE_NAMES[name] ?? name;
}

export default class PutIntoZoneEvent extends TriggerEvent {
    static get pattern() {
        return PUT_INTO;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(PUT_ONTO);
    }

    static get qualifierParsers() {
        return [ZoneOrigin, FirstTime, TurnWindow];
    }

    static read(scribe, match, str) {
        const event = super.read(scribe, match, str);
        if (event.subjectPhrase && event.mayLeaveBattlefield)
            event.subjectPhrase.hasLeftBattlefield = true;
        return event;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.destination = destinationName(match.groups);
        this.destinationOwner = match.groups.owner?.toLowerCase() ?? null;
    }

    get origin() {
        return this.qualifierOfKind(ZoneOrigin);
    }

    get isFromBattlefield() {
        return Boolean(this.origin?.isFromBattlefield);
    }

    get mayLeaveBattlefield() {
        if (this.destination === 'battlefield') return false;
        return this.origin?.includesBattlefield ?? true;
    }

    get isRepeatable() {
        return !this.isSelf && !this.subjectPhrase?.isEnchanted;
    }
}
