import Effect from './Effect.js';

const STATUS = 'saddled|goaded|suspected|monstrous|renowned';
const BECOMES_STATUS = new RegExp(
    '^(?<verb>(?:is|are) (?:no longer |(?!goaded\\b))|becomes? )'
        + `(?<status>${STATUS})\\b`, 'i'
);

export default class SetStatusEffect extends Effect {
    static get pattern() {
        return BECOMES_STATUS;
    }

    parseArguments(match) {
        this.status = match.groups.status.toLowerCase();
        this.removesStatus = match.groups.verb.toLowerCase().endsWith('longer ');
    }
}
