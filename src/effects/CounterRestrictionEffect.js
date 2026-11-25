import ObjectEffect from './ObjectEffect.js';

const RESTRICTION = new RegExp(
    '^(?:(?<kind>[a-z]+|[+−-]\\d+/[+−-]\\d+) )?counters '
        + 'can\'t be (?<action>put on|removed from) ', 'i'
);

export default class CounterRestrictionEffect extends ObjectEffect {
    static get pattern() {
        return RESTRICTION;
    }

    parseArguments(match) {
        this.counterKind = match.groups.kind?.toLowerCase() ?? null;
        this.prohibitsPlacement = match.groups.action.toLowerCase() === 'put on';
        super.parseArguments(match);
    }
}
