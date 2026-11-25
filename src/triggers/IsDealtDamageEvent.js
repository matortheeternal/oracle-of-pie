import TriggerEvent from './TriggerEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import ThisWay from './qualifiers/ThisWay.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const DAMAGE_KIND = '(?:(?<combat>combat) |(?<noncombat>noncombat) )?';
const AMOUNT = '(?:(?<amount>excess|(?:exactly )?' + NUMBER_PATTERN + '(?: or more)?) )?';
const RECIPIENT = '(?:(?<subject>.+?) (?:is|are)|(?<you>you)\'re)';
const IS_DEALT_DAMAGE = new RegExp(
    `^${RECIPIENT} dealt ${AMOUNT}${DAMAGE_KIND}damage\\b`, 'i'
);
const PASSIVE_DAMAGE = new RegExp(
    '^(?<amount>excess )?' + DAMAGE_KIND + 'damage is dealt to (?<subject>.+)$', 'i'
);

export default class IsDealtDamageEvent extends TriggerEvent {
    static get pattern() {
        return IS_DEALT_DAMAGE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(PASSIVE_DAMAGE);
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow, ThisWay];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isCombat = Boolean(match.groups.combat);
        this.isNoncombat = Boolean(match.groups.noncombat);
        this.amount = match.groups.amount?.trim().toLowerCase() ?? null;
        this.subject ||= match.groups.you ?? '';
    }
}
