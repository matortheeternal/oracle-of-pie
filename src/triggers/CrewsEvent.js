import ActionEvent from './ActionEvent.js';

const CREWS = /^(?<subject>.+?) crews(?= an? vehicle\b)/i;

export default class CrewsEvent extends ActionEvent {
    static get pattern() {
        return CREWS;
    }
}
