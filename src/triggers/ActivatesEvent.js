import ActionEvent from './ActionEvent.js';
import ActivatedAbilityPhrase from './objects/ActivatedAbilityPhrase.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import ActivationPayment from './qualifiers/ActivationPayment.js';

const ACTIVATES = /^(?<subject>.+?)(?<next> next)? activates? (?=(?:an?|one or more) )/i;
const PASSIVE = /^(?<object>an? ability of [^,.]+?) (?:is|are) activated\b/i;

export default class ActivatesEvent extends ActionEvent {
    static get pattern() {
        return ACTIVATES;
    }

    static match(scribe, str) {
        return str.match(ACTIVATES) ?? str.match(PASSIVE);
    }

    static get objectParsers() {
        return [ActivatedAbilityPhrase];
    }

    static get qualifierParsers() {
        return [TurnWindow, ActivationPayment];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isNext = Boolean(match.groups.next);
        this.passiveAbility = match.groups.object ?? null;
    }

    parseObjectPhrase() {
        if (!this.passiveAbility) return super.parseObjectPhrase();
        return this.parseNext(this.passiveAbility, this.constructor.objectParsers);
    }

    get ability() {
        return this.objectPhrase;
    }
}
