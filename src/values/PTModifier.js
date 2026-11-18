import Node from '../core/Node.js';

const PT = /^([+\-−]?)(\d+|X|\*)\/([+\-−]?)(\d+|X|\*)/;

const LETHAL_SHRINK = 4;
const SIGNS = { '': '', '+': '+', '-': '-', '−': '-' };

function magnitude(value) {
    const number = Number(value);
    return Number.isNaN(number) ? value : number;
}

function signedValue(sign, value) {
    return { sign: SIGNS[sign], magnitude: magnitude(value) };
}

export default class PTModifier extends Node {
    static match(scribe, str) {
        return str.match(PT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.power = signedValue(match[1], match[2]);
        this.toughness = signedValue(match[3], match[4]);
    }

    get lowersToughness() {
        return this.toughness.sign === '-' && this.toughness.magnitude !== 0;
    }

    get isLethalShrink() {
        if (!this.lowersToughness) return false;
        const amount = this.toughness.magnitude;
        return typeof amount !== 'number' || amount >= LETHAL_SHRINK;
    }

    get raisesToughness() {
        return this.toughness.sign === '+' && this.toughness.magnitude !== 0;
    }

    get isPowerBoost() {
        const raisesPower = this.power.sign === '+' && this.power.magnitude !== 0;
        return raisesPower && this.toughness.sign !== '-';
    }

    get isBoost() {
        return this.power.sign === '+' && this.toughness.sign === '+'
            && this.power.magnitude !== 0 && this.toughness.magnitude !== 0;
    }
}
