import Effect from './Effect.js';

const LOYALTY = 'loyalty abilities of [^,.]+?';
const OTHERS
    = '(?:each of those abilities|abilities of (?:other )?creatures you control)';
const LIMITS = [
    'only once each turn', 'twice this turn rather than only once',
    'as though those creatures had haste',
    'on any player\'s turn any time you could cast an instant'
];
const ACTIVATION_PERMISSION = new RegExp(
    '^activate (?<abilities>(?:the )?' + LOYALTY + '|' + OTHERS + ') '
        + '(?<permission>' + LIMITS.join('|') + ')',
    'i'
);

export default class ActivationPermissionEffect extends Effect {
    static get pattern() {
        return ACTIVATION_PERMISSION;
    }

    parseArguments(match) {
        this.abilities = match.groups.abilities.toLowerCase();
        this.permission = match.groups.permission.toLowerCase();
    }
}
