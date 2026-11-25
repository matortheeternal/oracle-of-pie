import Effect from './Effect.js';

const DEFINITION = /^(?:the value of )?X (?:is|becomes?) (?<value>[^,.]+)$/;
const LIMIT = /^X can't be greater than (?<maximum>[^,.]+)$/;
const DOUBLE = /^double the value of (?<variable>[NX])\b/i;

export default class DefineVariableEffect extends Effect {
    static match(scribe, str) {
        return str.match(DEFINITION) ?? str.match(LIMIT) ?? str.match(DOUBLE);
    }

    parseArguments(match) {
        this.value = match.groups.value ?? null;
        this.maximum = match.groups.maximum ?? null;
        this.doubledVariable = match.groups.variable ?? null;
    }
}
