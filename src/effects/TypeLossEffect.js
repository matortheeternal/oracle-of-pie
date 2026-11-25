import Effect from './Effect.js';

const TYPE_LOSS = /^(?:isn't|aren't|is not|are not) (?:an? )?(?<type>[a-z]+)\b/i;
const ALL_TYPES = /^loses? all (?<type>creature|land|artifact) types\b/i;

export default class TypeLossEffect extends Effect {
    static get pattern() {
        return TYPE_LOSS;
    }

    static match(scribe, str) {
        return str.match(ALL_TYPES) ?? super.match(scribe, str);
    }

    parseArguments(match) {
        this.lostType = match.groups.type.toLowerCase();
    }
}
