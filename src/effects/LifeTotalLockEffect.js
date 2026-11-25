import Effect from './Effect.js';

const LOCK = new RegExp(
    '^(?<owner>your|their|that player\'s|its controller\'s) '
        + 'life total can\'t change\\b',
    'i'
);

export default class LifeTotalLockEffect extends Effect {
    static get pattern() {
        return LOCK;
    }

    parseArguments(match) {
        this.owner = match.groups.owner.toLowerCase();
    }
}
