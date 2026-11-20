import ActionEvent from './ActionEvent.js';
import ActivatedAbilityPhrase from './objects/ActivatedAbilityPhrase.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const ACTIVATES = /^(?<subject>.+?)(?<next> next)? activates? (?=(?:an?|one or more) )/i;

export default class ActivatesEvent extends ActionEvent {
    static get pattern() {
        return ACTIVATES;
    }

    static get objectParsers() {
        return [ActivatedAbilityPhrase];
    }

    static get qualifierParsers() {
        return [TurnWindow];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isNext = Boolean(match.groups.next);
    }

    get ability() {
        return this.objectPhrase;
    }
}
