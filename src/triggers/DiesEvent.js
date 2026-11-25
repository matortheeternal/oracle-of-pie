import TriggerEvent from './TriggerEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import Arrival from './qualifiers/Arrival.js';

const DEATH_ALTERNATIVES = [
    'dies',
    'die',
    '(?:is|are) put into a graveyard from the battlefield'
];
const DIES = new RegExp(`^(?<subject>.+?) (?:${DEATH_ALTERNATIVES.join('|')})\\b`, 'i');

export default class DiesEvent extends TriggerEvent {
    static get pattern() {
        return DIES;
    }

    static get qualifierParsers() {
        return [TurnWindow, Arrival];
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}
