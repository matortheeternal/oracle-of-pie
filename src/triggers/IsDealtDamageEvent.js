import TriggerEvent from './TriggerEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import ThisWay from './qualifiers/ThisWay.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const DAMAGE_KIND = '(?:(?<combat>combat) |(?<noncombat>noncombat) )?';
const AMOUNT = '(?:(?<amount>excess|(?:exactly )?' + NUMBER_PATTERN + '(?: or more)?) )?';
const IS_DEALT_DAMAGE = new RegExp(
    `^(?<subject>.+?) (?:is|are) dealt ${AMOUNT}${DAMAGE_KIND}damage\\b`, 'i'
);

export default class IsDealtDamageEvent extends TriggerEvent {
    static get pattern() {
        return IS_DEALT_DAMAGE;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow, ThisWay];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isCombat = Boolean(match.groups.combat);
        this.isNoncombat = Boolean(match.groups.noncombat);
        this.amount = match.groups.amount?.toLowerCase() ?? null;
    }
}
