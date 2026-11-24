import Effect from './Effect.js';

const SKIP = new RegExp(
    '^skips? (?:your|their|that player\'s|his or her) (?<next>next )?'
    + '(?<part>untap step|upkeep step|upkeep|draw step|combat phase|'
    + 'main phase|end step|turn)\\b', 'i'
);

export default class SkipEffect extends Effect {
    static get pattern() {
        return SKIP;
    }

    parseArguments(match) {
        this.skipped = match.groups.part.toLowerCase();
        this.isNextOnly = Boolean(match.groups.next);
    }

    get skipsTurn() {
        return this.skipped === 'turn';
    }
}
