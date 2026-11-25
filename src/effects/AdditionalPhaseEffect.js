import Effect from './Effect.js';

const AFTER_STEP = new RegExp(
    '^you get (?:an additional|that many additional) upkeep steps?'
    + ' after this (?:phase|step)\\b', 'i'
);
const AFTER_PHASE = '(?:after this (?:main )?phase, )?';
const PHASE_KIND = '(combat|main|beginning|end)';
const ADDITIONAL_PHASE = new RegExp(
    `^${AFTER_PHASE}there(?: is|'s) an additional ${PHASE_KIND}(?: phase)?[^,.]*`, 'i'
);
const COMBAT = 'combat';

export default class AdditionalPhaseEffect extends Effect {
    static get pattern() {
        return ADDITIONAL_PHASE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(AFTER_STEP);
    }

    parseArguments(match) {
        this.phase = match[1]?.toLowerCase() ?? 'upkeep';
    }

    get addsCombat() {
        return this.phase === COMBAT;
    }
}
