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

export default class RetargetCopyEffect extends Effect {
    static get pattern() {
        return RETARGET_COPY;
    }

    parseArguments(match) {
        this.recipient = match.groups.recipient;
    }
}
