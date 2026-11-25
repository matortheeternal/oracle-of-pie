import Effect from './Effect.js';

const ADDITIONAL_TRIGGER = new RegExp(
    '^(?:(?<abilities>that ability|it|room abilities of dungeons you own) )?'
        + 'triggers? an additional time\\b', 'i'
);

export default class AdditionalTriggerEffect extends Effect {
    static get pattern() {
        return ADDITIONAL_TRIGGER;
    }

    parseArguments(match) {
        this.abilities = match.groups.abilities?.toLowerCase() ?? null;
    }
}
