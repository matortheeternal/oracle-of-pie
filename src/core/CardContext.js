const LAND = /\bLand\b/;
const CREATURE = /\bCreature\b/;
const INSTANT_OR_SORCERY = /\b(?:Instant|Sorcery)\b/;

export default class CardContext {
    constructor({ name = '', typeLine = '' } = {}) {
        this.name = name;
        this.typeLine = typeLine;
    }

    get isLand() {
        return LAND.test(this.typeLine);
    }

    get isInstantOrSorcery() {
        return INSTANT_OR_SORCERY.test(this.typeLine);
    }

    get isCreature() {
        return CREATURE.test(this.typeLine);
    }
}
