import TriggerEvent from './TriggerEvent.js';
import ZoneOrigin from './qualifiers/ZoneOrigin.js';

const CAUSES_EXILE = new RegExp(
    '^(?<subject>.+?) causes? (?<affected>[^,.]+?) to be exiled\\b', 'i'
);

export default class ForcedExileEvent extends TriggerEvent {
    static get pattern() {
        return CAUSES_EXILE;
    }

    static get qualifierParsers() {
        return [ZoneOrigin];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.affected = match.groups.affected;
    }

    get objectText() {
        return this.affected;
    }

    get isRecognized() {
        return Boolean(this.objectPhrase?.isRecognized)
            && !this.objectPhrase.remainingStr && super.isRecognized;
    }
}
