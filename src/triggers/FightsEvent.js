import ActionEvent from './ActionEvent.js';
import ThisWay from './qualifiers/ThisWay.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const FIGHTS = /^(?<subject>.+?) fights?\b/i;

export default class FightsEvent extends ActionEvent {
    static get pattern() {
        return FIGHTS;
    }

    static get qualifierParsers() {
        return [ThisWay, TurnWindow];
    }
}
