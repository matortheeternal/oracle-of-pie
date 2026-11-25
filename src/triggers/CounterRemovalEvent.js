import TriggerEvent from './TriggerEvent.js';
import PlacedCounters from './subjects/PlacedCounters.js';
import ThisWay from './qualifiers/ThisWay.js';
import SourceZoneCondition from './conditions/SourceZoneCondition.js';
import StateModifier from '../phrases/modifiers/StateModifier.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const REMOVE = /^(?<counters>.+?) (?:is|are) removed from /i;
const ACTIVE = new RegExp(
    '^(?<subject>you) remove (?<counters>a time counter|a'
        + ' counter)(?: from )?', 'i'
);

export default class CounterRemovalEvent extends TriggerEvent {
    static match(scribe, str) {
        return str.match(REMOVE) ?? str.match(ACTIVE);
    }

    static get qualifierParsers() {
        return [ThisWay, SourceZoneCondition, StateModifier];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.counters = this.parseNext(match.groups.counters, [PlacedCounters]);
        this.counterText = match.groups.counters;
    }

    parseObjectPhrase() {
        return this.consume(PHRASE_PARSERS);
    }

    get children() {
        return [this.counters, ...super.children].filter(Boolean);
    }
}
