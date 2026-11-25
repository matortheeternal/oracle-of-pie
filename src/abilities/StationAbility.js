import Ability from './Ability.js';
import AbilityWordAbility from './AbilityWordAbility.js';

const STATION = /^(\d+)\+ ?\| ?/;

export default class StationAbility extends Ability {
    static match(scribe, str) {
        return str.match(STATION);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.threshold = Number(match[1]);
        const parsers = [AbilityWordAbility, ...scribe.innerAbilityParsers];
        this.inner = this.consume(parsers);
    }

    get parts() {
        return [this.inner].filter(Boolean);
    }

    childContext(context) {
        return { ...super.childContext(context), station: this };
    }
}
