import Ability from './Ability.js';

const WORD_LABEL = '[A-Z~∞][\\w~.,?\'’!-]*(?: [\\w~.,?\'’!-]+){0,7}';
const NUMBERED_LABEL = '[0-9][0-9,]*(?:-| )[A-Z][A-Za-z-]*';
const ABILITY_WORD = new RegExp(`^(${WORD_LABEL}|${NUMBERED_LABEL}) (?:—|-) (?=\\S)`);
const CHOICE_LABEL = /\bfaces? a villainous choice$/i;
const NOT_ABILITY_WORD = /^(?:choose|exhaust|to solve)\b/i;

export default class AbilityWordAbility extends Ability {
    static match(scribe, str) {
        const match = str.match(ABILITY_WORD);
        if (!match || CHOICE_LABEL.test(match[1])) return null;
        return NOT_ABILITY_WORD.test(match[1]) ? null : match;
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
