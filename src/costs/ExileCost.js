import ObjectCost from './ObjectCost.js';

const EXILE = /^exile /i;
const FACE_UP = /^face up\b/i;
const OPPONENT_COUNT = /^equal to the number of opponents you have\b/i;

export default class ExileCost extends ObjectCost {
    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.faceUp = Boolean(this.consumeText(FACE_UP));
        this.countsOpponents = Boolean(this.consumeText(OPPONENT_COUNT));
    }

    static get pattern() {
        return EXILE;
    }
}
