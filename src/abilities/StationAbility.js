import Ability from './Ability.js';

const STATION = /^(\d+)\+ ?\| ?/;

export default class StationAbility extends Ability {
    static match(scribe, str) {
        return str.match(STATION);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.threshold = Number(match[1]);
        this.inner = this.consume(scribe.innerAbilityParsers);
    }

    get parts() {
        return [this.inner].filter(Boolean);
    }

    childContext(context) {
        return { ...super.childContext(context), station: this };
    }
}
