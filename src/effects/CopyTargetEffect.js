import ObjectEffect from './ObjectEffect.js';

const TARGETS = /^the copy targets? /i;

export default class CopyTargetEffect extends ObjectEffect {
    static get pattern() {
        return TARGETS;
    }
}
