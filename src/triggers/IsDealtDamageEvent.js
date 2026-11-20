import TriggerEvent from './TriggerEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const DAMAGE_KIND = '(?:(?<combat>combat) |(?<noncombat>noncombat) )?';
const IS_DEALT_DAMAGE = new RegExp(
    `^(?<subject>.+?) (?:is|are) dealt ${DAMAGE_KIND}damage\\b`, 'i'
);

export default class IsDealtDamageEvent extends TriggerEvent {
    static get pattern() {
        return IS_DEALT_DAMAGE;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isCombat = Boolean(match.groups.combat);
        this.isNoncombat = Boolean(match.groups.noncombat);
    }
}
