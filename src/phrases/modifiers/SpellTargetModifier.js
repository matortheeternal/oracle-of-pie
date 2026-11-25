import Modifier from './Modifier.js';
import SpellTarget from '../../triggers/qualifiers/SpellTarget.js';

export default class SpellTargetModifier extends Modifier {
    static match(scribe, str) {
        return SpellTarget.match(scribe, str);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.target = SpellTarget.parse(scribe, match, str);
    }

    get children() {
        return [this.target];
    }

    get restrictsTargeting() {
        return true;
    }
}
