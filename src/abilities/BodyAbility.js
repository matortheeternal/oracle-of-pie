import Ability from './Ability.js';

export default class BodyAbility extends Ability {
    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.body = this.parseBody(this.bodyText(match));
        this.remainingStr = '';
    }

    bodyText(match) {
        return match[match.length - 1];
    }

    get parts() {
        return [this.body];
    }
}
