import StateCondition from './StateCondition.js';

const ZONE = '(?:in your (?<graveyard>graveyard)|on the battlefield)';
const SOURCE_ZONE = new RegExp(`^while (?:~|this [a-z]+) is ${ZONE}\\b`, 'i');

export default class SourceZoneCondition extends StateCondition {
    static get pattern() {
        return SOURCE_ZONE;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.zone = match.groups.graveyard ? 'graveyard' : 'battlefield';
    }
}
