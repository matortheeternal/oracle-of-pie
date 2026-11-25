import TriggerEvent from './TriggerEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import DamageSource from './subjects/DamageSource.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';
import PhraseList from '../phrases/PhraseList.js';

const AMOUNT = '(?:(?:exactly )?' + NUMBER_PATTERN + '(?: or more)?|excess)';
const DEALS = new RegExp('^(?<subject>.+?) deals? (?:(?<amount>' + AMOUNT
    + ') )?(?:(?:non)?combat )?damage\\b', 'i');
const COMBAT = /\bcombat damage\b/i;
const NONCOMBAT = /\bnoncombat damage\b/i;
const TO = /^to /i;

export default class DealsDamageEvent extends TriggerEvent {
    static get pattern() {
        return DEALS;
    }

    static get subjectParsers() {
        return [DamageSource, ...super.subjectParsers];
    }

    static get qualifierParsers() {
        return [TurnWindow];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.amount = match.groups.amount?.toLowerCase() ?? null;
        this.additionalRecipients = [];
    }

    parseObjectPhrase() {
        const recipient = this.remainingStr.match(TO);
        if (!recipient) return null;
        const text = this.remainingStr.slice(recipient[0].length);
        const recipients = this.parseNext(text, [PhraseList]);
        if (recipients) this.remainingStr = recipients.remainingStr;
        this.additionalRecipients = recipients?.children.slice(1) ?? [];
        return recipients?.children[0] ?? null;
    }

    get objectParticipants() {
        return [...super.objectParticipants, ...this.additionalRecipients];
    }

    get recipient() {
        return this.objectPhrase;
    }

    get isNoncombat() {
        return NONCOMBAT.test(this.raw);
    }

    get isCombat() {
        return COMBAT.test(this.raw);
    }
}
