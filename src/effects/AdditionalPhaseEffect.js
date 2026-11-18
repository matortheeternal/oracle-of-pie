import Effect from './Effect.js';

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

    parseArguments(match) {
        this.phase = match[1].toLowerCase();
    }

    get addsCombat() {
        return this.phase === COMBAT;
    }
}
