import TurnStep from './TurnStep.js';

const EACH_OF_OWNER = '(?<allPhases>each of )(?<scopedOwner>your|enchanted player\'s)';
const OWNER = '(?<owner>your|each player\'s|each|the)';
const TIMING = '(?:(?<timing>first|second|precombat|postcombat|next) )?';
const MAIN_PHASE = new RegExp(
    `^(?:${EACH_OF_OWNER}|${OWNER}) ${TIMING}(?<step>main phase)s?\\b`, 'i'
);

export default class MainPhase extends TurnStep {
    static get pattern() {
        return MAIN_PHASE;
    }
}
