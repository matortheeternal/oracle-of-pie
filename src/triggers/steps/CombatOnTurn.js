import TurnStep from './TurnStep.js';

const OWNER = '(?<owner>your|each (?:player|opponent)\'s|enchanted opponent\'s)';
const COMBAT_ON_TURN = new RegExp(
    '^(?<step>combat)(?: on ' + OWNER + ' turn)?\\b', 'i'
);

export default class CombatOnTurn extends TurnStep {
    static get pattern() {
        return COMBAT_ON_TURN;
    }
}
