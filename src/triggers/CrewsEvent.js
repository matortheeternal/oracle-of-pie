import ActionEvent from './ActionEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const CREWS = /^(?<subject>.+?) crews(?= an? vehicle\b)/i;

export default class CrewsEvent extends ActionEvent {
    static get pattern() {
        return CREWS;
    }

    static get qualifierParsers() {
        return [TurnWindow];
    }
}
