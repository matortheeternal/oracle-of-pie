import Effect from './Effect.js';

const PERMISSION = new RegExp(
    '^can be the targets? of spells and abilities(?<controller> you control)? '
        + 'as though (?:they|it) (?:didn\'t|did not) have (?<ignored>hexproof)\\b',
    'i'
);

export default class TargetingPermissionEffect extends Effect {
    static get pattern() {
        return PERMISSION;
    }

    parseArguments(match) {
        this.ignoresKeyword = match.groups.ignored.toLowerCase();
        this.limitedToYourEffects = Boolean(match.groups.controller);
    }
}
