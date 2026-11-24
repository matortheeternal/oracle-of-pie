import Phrase from '../../phrases/Phrase.js';

const CONTROLLERS = 'you control|an opponent controls';
const COLORS = 'white|blue|black|red|green';
const SOURCE = new RegExp(
    `^(?<determiner>a|another) (?:(?<color>${COLORS}) )?source`
        + `(?: (?<controller>${CONTROLLERS}))?(?=\s|$)`,
    'i'
);
const YOU_CONTROL = /^you control$/i;
const OPPONENT_CONTROLS = /^an opponent controls$/i;
const ANOTHER = /^another$/i;

export default class DamageSource extends Phrase {
    static match(scribe, str) {
        return str.match(SOURCE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { determiner, color, controller } = match.groups;
        this.color = color?.toLowerCase() ?? null;
        this.controller = controller ?? '';
        Object.defineProperty(this, 'determiner', { value: determiner });
    }

    get isAntecedentCandidate() {
        return false;
    }

    get excludesSelf() {
        return ANOTHER.test(this.determiner);
    }

    get controlledByYou() {
        return YOU_CONTROL.test(this.controller);
    }

    get controlledByOpponent() {
        return OPPONENT_CONTROLS.test(this.controller);
    }
}
