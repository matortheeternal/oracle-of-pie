import TriggerEvent from './TriggerEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const COMMITS_CRIME = /^(?<subject>.+?) commits? a crime\b/i;

export default class CommitsCrimeEvent extends TriggerEvent {
    static get pattern() {
        return COMMITS_CRIME;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }
}
