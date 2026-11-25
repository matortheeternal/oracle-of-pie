import ActionEvent from './ActionEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const SADDLES = /^(?<subject>.+?) saddles? (?=an? Mount\b)/i;

export default class SaddlesEvent extends ActionEvent {
    static get pattern() {
        return SADDLES;
    }

    static get qualifierParsers() {
        return [TurnWindow];
    }
}
