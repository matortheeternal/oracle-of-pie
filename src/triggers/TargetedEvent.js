import TriggerEvent from './TriggerEvent.js';
import TargetingSource from './objects/TargetingSource.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import EffectSubjectGroup from '../phrases/EffectSubjectGroup.js';

const OR_PERMANENT = /^or (?:a )?permanent (?:you|they) control\b/i;

const TARGETED = /^(?<subject>.+?) becomes? the target of\b/i;

export default class TargetedEvent extends TriggerEvent {
    static get pattern() {
        return TARGETED;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }

    static get subjectParsers() {
        return [TargetedSubject, ...super.subjectParsers];
    }

    parseObjectPhrase() {
        return this.consume([TargetingSource]);
    }
}

class TargetedSubject extends EffectSubjectGroup {
    static match(scribe, str) {
        const boundary = str.indexOf(' or ');
        if (boundary < 0) return null;
        const tail = str.slice(boundary + 1);
        return OR_PERMANENT.test(tail) ? super.match(scribe, str) : null;
    }
}
