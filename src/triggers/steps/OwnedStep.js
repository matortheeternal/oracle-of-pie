import TurnStep from './TurnStep.js';

const POSSESSIVE_OWNER = '(?:each|enchanted) (?:player|opponent)\'s';
const OTHER_OWNER = 'your|each|the|its owner\'s|the monarch\'s';
const TIMING = '(?:(?<timing>first|next) )?';
const STEP = '(?<step>upkeep|draw step|end step|combat)';
const OWNED_STEP = new RegExp(
    `^(?<owner>${POSSESSIVE_OWNER}|${OTHER_OWNER}) ${TIMING}${STEP}\\b`, 'i'
);

export default class OwnedStep extends TurnStep {
    static get pattern() {
        return OWNED_STEP;
    }
}
