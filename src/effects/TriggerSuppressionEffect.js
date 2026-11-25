import Effect from './Effect.js';

const TRIGGER_SUPPRESSION = new RegExp(
    '^(?<events>(?:artifacts and creatures|permanents|creatures) entering'
    + '(?: the battlefield)?(?: or (?:creatures )?dying)?|creatures dying) '
    + 'don\'t cause abilities(?<limits> of [^,.]+?)? to trigger\\b', 'i'
);

export default class TriggerSuppressionEffect extends Effect {
    static get pattern() {
        return TRIGGER_SUPPRESSION;
    }

    parseArguments(match) {
        this.events = match.groups.events.toLowerCase();
        this.affectedAbilities = match.groups.limits?.slice(4).toLowerCase() ?? null;
    }
}
