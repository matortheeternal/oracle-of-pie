import BodyAbility from './BodyAbility.js';

const WHOLE_LINE = /^([\s\S]+)$/;

export default class SpellAbility extends BodyAbility {
    static match(scribe, str) {
        return str.match(WHOLE_LINE);
    }
}
