import Effect from './Effect.js';

const FACE_UP = /^draft this card face up\b/i;
const EXTRA_CARD = /^draft (?<extra>an additional card) from that booster pack\b/i;
const REMOVE_FACE_UP = /^remove (?<removed>it|this card) from the draft face up\b/i;
const NOTE = new RegExp(
    '^notes? (?<detail>its (?:name|creature types)|one of its creature types'
        + '|a creature type)(?: that hasn\'t been noted for '
        + '(?<record>this Saga|~\'s Journal))?\\b', 'i'
);
const DRAFT_FORMS = [FACE_UP, NOTE, EXTRA_CARD, REMOVE_FACE_UP];
const DRAFT_RULES = new RegExp(DRAFT_FORMS.map(form => form.source).join('|'), 'i');

export default class DraftEffect extends Effect {
    static get pattern() {
        return DRAFT_RULES;
    }

    parseArguments(match) {
        this.notes = match.groups.detail?.toLowerCase() ?? null;
        this.excludesPreviouslyNoted = Boolean(match.groups.record);
        this.draftsExtraCard = Boolean(match.groups.extra);
        this.removesFromDraft = Boolean(match.groups.removed);
        this.draftFaceUp = FACE_UP.test(match[0]);
    }
}
