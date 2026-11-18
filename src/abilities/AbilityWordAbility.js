import Ability from './Ability.js';

const ABILITY_WORD = /^([A-Z][A-Za-z'’-]*(?: [A-Za-z'’-]+){0,4}) (?:—|-) (?=\S)/;
const NOT_ABILITY_WORD = /^(?:choose|exhaust)\b/i;

export default class AbilityWordAbility extends Ability {
    static match(scribe, str) {
        const match = str.match(ABILITY_WORD);
        return match && !NOT_ABILITY_WORD.test(match[1]) ? match : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.abilityWord = match[1];
        this.inner = this.consume(scribe.innerAbilityParsers);
        if (this.inner) this.inner.reminders = this.reminders;
    }

    get parts() {
        return [this.inner].filter(Boolean);
    }

    addMode(mode) {
        this.inner?.addMode(mode);
    }
}
