import TriggerEvent from './TriggerEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const CAUSES = new RegExp(
    '^(?<cause>[^,.]+?) causes? (?<ability>a triggered'
        + ' ability[^,.]*?) to trigger\\b', 'i'
);
const ABILITY_FORMS = [
    'the final chapter ability of a Saga you control',
    'an? (?:triggered |mana |activated )?ability of (?:this'
        + ' creature|equipped creature|~)',
    'this ability'
].join('|');
const LIFECYCLE = new RegExp(
    '^(?<ability>' + ABILITY_FORMS + ') (?<event>resolves?|triggers?|is activated)'
        + '(?: for the (?<ordinal>first|second|third) time)?\\b', 'i'
);

export default class AbilityEvent extends TriggerEvent {
    static match(scribe, str) {
        return str.match(CAUSES) ?? str.match(LIFECYCLE);
    }

    static get qualifierParsers() {
        return [TurnWindow];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.ability = match.groups.ability;
        this.cause = match.groups.cause ?? null;
        this.event = match.groups.event?.toLowerCase() ?? 'trigger';
        this.ordinal = match.groups.ordinal?.toLowerCase() ?? null;
    }
}
