import Effect from './Effect.js';

const RETARGET_COPY = /^chooses? new targets for (?:the|that|each|those) cop(?:y|ies)\b/i;

export default class RetargetCopyEffect extends Effect {
    static get pattern() {
        return RETARGET_COPY;
    }
}
