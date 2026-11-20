const LAND = /\bLand\b/;
const CREATURE = /\bCreature\b/;
const INSTANT_OR_SORCERY = /\b(?:Instant|Sorcery)\b/;
const INSTANT = /\bInstant\b/;
const ARTIFACT = /\bArtifact\b/;
const EQUIPMENT = /\bEquipment\b/;
const TYPE_DASH = ' — ';

export default class CardContext {
    constructor({ name = '', typeLine = '', loyalty = null, faceCount = 1 } = {}) {
        this.name = name;
        this.typeLine = typeLine;
        this.loyalty = loyalty;
        this.faceCount = faceCount;
    }

    get isInsert() {
        return this.typeLine === 'Card';
    }

    get isSingleFaced() {
        return this.faceCount === 1;
    }

    get startingLoyalty() {
        const loyalty = Number.parseInt(this.loyalty, 10);
        return Number.isNaN(loyalty) ? null : loyalty;
    }

    isUltimate(loyaltyLoss) {
        return this.startingLoyalty !== null && loyaltyLoss >= this.startingLoyalty;
    }

    get subtypes() {
        const [, subtypes = ''] = this.typeLine.split(TYPE_DASH);
        return subtypes.split(' ').filter(Boolean);
    }

    hasSubtype(subtype) {
        return this.subtypes.includes(subtype);
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
