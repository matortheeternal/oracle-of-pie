import ActionEvent from './ActionEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const BLOCKS = /^(?<subject>.+?) blocks?\b/i;

export default class BlocksEvent extends ActionEvent {
    static get pattern() {
        return BLOCKS;
    }

    static get qualifierParsers() {
        return [TurnWindow];
    }

    get blockedCreature() {
        return this.objectPhrase;
    }
}
