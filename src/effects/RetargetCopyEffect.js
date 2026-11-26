import Effect from './Effect.js';

const RETARGET_ALTERNATIVES = [
    '(?:the|that|each|those|their|the additional) cop(?:y|ies)',
    '(?:target|that) spells?(?: or (?:ability|abilities))?',
    'any number of other spells and/or abilities',
    'it'
];
const RETARGET_COPY = new RegExp(
    '^chooses? (?:a new target|new targets) for (?<recipient>'
        + RETARGET_ALTERNATIVES.join('|') + ')\\b', 'i'
);
const COPY_CONTROLLER = /^(?:you|they) control\b/i;
const RANDOM_RESELECT = new RegExp(
    '^reselect the targets at random for (?<recipient>the spell and the copy)\\b', 'i'
);

export default class RetargetCopyEffect extends Effect {
    static get pattern() {
        return RETARGET_COPY;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(RANDOM_RESELECT);
    }

    parseArguments(match) {
        this.recipient = match.groups.recipient;
        this.controller = this.consumeText(COPY_CONTROLLER)?.[0] ?? null;
        this.atRandom = RANDOM_RESELECT.test(match[0]);
    }
}
