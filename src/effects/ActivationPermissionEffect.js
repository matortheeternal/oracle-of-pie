import Effect from './Effect.js';

const LOYALTY = 'loyalty abilities of [^,.]+?';
const OTHERS
    = '(?:each of those abilities|abilities of (?:other )?creatures you control)';
const LIMITS = [
    'only once each turn', 'twice this turn rather than only once',
    'twice each turn rather than only once',
    'any time you could cast an instant',
    'as though they haven\'t been activated',
    'as though those creatures had haste',
    'on any player\'s turn any time you could cast an instant'
];
const ACTIVATION_PERMISSION = new RegExp(
    '^activate (?<abilities>(?:the )?' + LOYALTY + '|' + OTHERS
        + '|equip abilities|exhaust abilities|power-up abilities) '
        + '(?<permission>' + LIMITS.join('|') + ')',
    'i'
);
const EXTRA_ACTIVATION = /^can be activated (?<permission>an additional time)\b/i;

export default class ActivationPermissionEffect extends Effect {
    static get pattern() {
        return ACTIVATION_PERMISSION;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(EXTRA_ACTIVATION);
    }

    parseArguments(match) {
        this.abilities = match.groups.abilities?.toLowerCase() ?? null;
        this.permission = match.groups.permission.toLowerCase();
    }
}
