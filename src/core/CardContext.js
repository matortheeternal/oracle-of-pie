const LAND = /\bLand\b/;
const CREATURE = /\bCreature\b/;
const INSTANT_OR_SORCERY = /\b(?:Instant|Sorcery)\b/;
const INSTANT = /\bInstant\b/;
const ARTIFACT = /\bArtifact\b/;
const EQUIPMENT = /\bEquipment\b/;

export default class CardContext {
    constructor({ name = '', typeLine = '', loyalty = null } = {}) {
        this.name = name;
        this.typeLine = typeLine;
        this.loyalty = loyalty;
    }

    get startingLoyalty() {
        const loyalty = Number.parseInt(this.loyalty, 10);
        return Number.isNaN(loyalty) ? null : loyalty;
    }

    isUltimate(loyaltyLoss) {
        return this.startingLoyalty !== null && loyaltyLoss >= this.startingLoyalty;
    }

    get isLand() {
        return LAND.test(this.typeLine);
    }

    get isInstant() {
        return INSTANT.test(this.typeLine);
    }

    get isArtifact() {
        return ARTIFACT.test(this.typeLine);
    }

    get isInstantOrSorcery() {
        return INSTANT_OR_SORCERY.test(this.typeLine);
    }

    get isEquipment() {
        return EQUIPMENT.test(this.typeLine);
    }

    get isCreature() {
        return CREATURE.test(this.typeLine);
    }
}
