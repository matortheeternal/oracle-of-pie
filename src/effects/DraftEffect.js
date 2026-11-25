import Effect from './Effect.js';

const FACE_UP = /^draft this card face up\b/i;
const NOTE = new RegExp(
    '^notes? (?<detail>its (?:name|creature types)|one of its creature types)\\b', 'i'
);
const DRAFT_RULES = new RegExp(`(?:${FACE_UP.source}|${NOTE.source})`, 'i');

export default class DraftEffect extends Effect {
    static get pattern() {
        return DRAFT_RULES;
    }

    parseArguments(match) {
        this.notes = match.groups.detail?.toLowerCase() ?? null;
        this.draftFaceUp = !this.notes;
    }
}
