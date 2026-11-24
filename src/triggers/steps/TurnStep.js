import Parser from '../../core/Parser.js';

const UPKEEP = 'upkeep';
const END_STEP = 'end step';
const COMBAT = 'combat';
const YOUR = 'your';
const EACH = 'each';
const EACH_PLAYER = 'each player\'s';
const UNSPECIFIED_OWNER = 'the';

export default class TurnStep extends Parser {
    static get pattern() {
        return null;
    }

    static match(scribe, str) {
        return str.match(this.pattern);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.step = match.groups.step.toLowerCase();
        const owner = (match.groups.owner ?? match.groups.scopedOwner).toLowerCase();
        this.turnOwner = owner === UNSPECIFIED_OWNER ? null : owner;
        this.timing = match.groups.timing?.toLowerCase() ?? null;
        this.allPhases = Boolean(match.groups.allPhases);
    }

    get isUpkeep() {
        return this.step === UPKEEP;
    }

    get isEndStep() {
        return this.step === END_STEP;
    }

    get isCombat() {
        return this.step === COMBAT;
    }

    get isYourTurn() {
        return this.turnOwner === YOUR;
    }

    get isEachTurn() {
        return this.turnOwner === EACH || this.turnOwner === EACH_PLAYER;
    }
}
