import TriggerEvent from './TriggerEvent.js';

const COMPLETES_DUNGEON = /^(?<subject>.+?) completes? a dungeon\b/i;

export default class CompletesDungeonEvent extends TriggerEvent {
    static get pattern() {
        return COMPLETES_DUNGEON;
    }
}
