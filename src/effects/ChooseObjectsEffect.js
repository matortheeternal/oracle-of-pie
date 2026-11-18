import ObjectEffect from './ObjectEffect.js';

const CHOOSE = /^chooses? (?!not\b|new targets?\b|a new target\b|the same mode\b)/i;

export default class ChooseObjectsEffect extends ObjectEffect {
    static get pattern() {
        return CHOOSE;
    }
}
