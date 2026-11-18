const LAND = /\bLand\b/;
const CREATURE = /\bCreature\b/;

export default class CardContext {
    constructor({ name = '', typeLine = '' } = {}) {
        this.name = name;
        this.typeLine = typeLine;
    }

    get isLand() {
        return LAND.test(this.typeLine);
    }

    get isCreature() {
        return CREATURE.test(this.typeLine);
    }
}
