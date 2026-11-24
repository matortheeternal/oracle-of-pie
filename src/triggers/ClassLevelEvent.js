import TriggerEvent from './TriggerEvent.js';

const CLASS_LEVEL = /^(?<subject>this class) becomes level (?<level>\d+)\b/i;

export default class ClassLevelEvent extends TriggerEvent {
    static get pattern() {
        return CLASS_LEVEL;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.level = Number(match.groups.level);
    }

    get isRepeatable() {
        return false;
    }
}
