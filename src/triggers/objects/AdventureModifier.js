import Modifier from '../../phrases/modifiers/Modifier.js';

const HAS_ADVENTURE = /^that has an Adventure\b/i;

export default class AdventureModifier extends Modifier {
    static match(scribe, str) {
        return str.match(HAS_ADVENTURE);
    }
}
