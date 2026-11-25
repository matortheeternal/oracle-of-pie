import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const AFTER_STEP = new RegExp(
    '^you get (?:an additional|that many additional) upkeep steps?'
    + ' after this (?:phase|step)\\b', 'i'
);
const AFTER_PHASE = '(?:after this (?:(?<after>main|combat) )?phase, )?';
const PHASE_KIND = '(?<phase>combat|main|beginning|end)';
const FOLLOWING = '(?<following> followed by an additional main phase)?';
const LATER = '(?<later> after this (?:phase|combat|step))?';
const ADDITIONAL_PHASE = new RegExp(
    `^${AFTER_PHASE}there(?: is|'s| are) (?<count>${NUMBER_PATTERN}) additional `
        + `${PHASE_KIND}(?: phases?| steps?)?${LATER}${FOLLOWING}`,
    'i'
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
        this.phase = match.groups?.phase.toLowerCase() ?? 'upkeep';
        this.count = match.groups ? numberValue(match.groups.count) : null;
        this.afterPhase = match.groups?.after?.toLowerCase() ?? null;
        this.afterCurrentPhase = Boolean(this.afterPhase || match.groups?.later);
        this.followedByMainPhase = Boolean(match.groups?.following);
    }

    get addsCombat() {
        return this.phase === COMBAT;
    }
}
