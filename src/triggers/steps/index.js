import CombatOnTurn from './CombatOnTurn.js';
import OwnedStep from './OwnedStep.js';
import MainPhase from './MainPhase.js';

export const STEP_PARSERS = [CombatOnTurn, MainPhase, OwnedStep];
