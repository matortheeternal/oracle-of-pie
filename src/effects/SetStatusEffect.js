import Effect from './Effect.js';

const STATUS = 'saddled|goaded|suspected|monstrous|renowned';
const BECOMES_STATUS = new RegExp(
    `^(?<loss>is no longer |are no longer |becomes? )(?<status>${STATUS})\\b`, 'i'
);

export default class SetStatusEffect extends Effect {
    static get pattern() {
        return BECOMES_STATUS;
    }

    parseArguments(match) {
        this.status = match.groups.status.toLowerCase();
        this.removesStatus = match.groups.loss.toLowerCase().endsWith('longer ');
    }
}
