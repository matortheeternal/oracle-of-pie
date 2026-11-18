import DiesEvent from './DiesEvent.js';

const ENTERS_OR_DIES = /^(?<subject>.+?) enters? or dies\b/i;

export default class EntersOrDiesEvent extends DiesEvent {
    static get pattern() {
        return ENTERS_OR_DIES;
    }
}
