import ObjectEffect from './ObjectEffect.js';

const TURN_FACE = /^turns? (?=[^,.]+ face (?:up|down)\b)/i;
const FACE_STATE = /^face (up|down)\b/i;

export default class TurnFaceEffect extends ObjectEffect {
    static get pattern() {
        return TURN_FACE;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.faceState = this.consumeText(FACE_STATE)?.[1].toLowerCase() ?? null;
    }

    get isComplete() {
        return super.isComplete && Boolean(this.faceState);
    }
}
