import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const FACE_UP = /^draft this card face up\b/i;
const EXTRA_CARD = /^draft (?<extra>an additional card) from that booster pack\b/i;
const REMOVE_FACE_UP = /^remove (?<removed>it|this card) from the draft face up\b/i;
const PASS_PACK = new RegExp(
    '^pass (?<passed>the next booster pack) without drafting a card from it\\b', 'i'
);
const MARK_COLORS = new RegExp(
    `^circle (?<colors>${NUMBER_PATTERN}) of the colors below\\b`, 'i'
);
const RANDOM_DRAFT = /^must draft (?<random>cards at random)\b/i;
const NOTE = new RegExp(
    '^notes? (?<detail>its (?:name|creature types)|one of its creature types'
        + '|a creature type)(?: that hasn\'t been noted for '
        + '(?<record>this Saga|~\'s Journal))?\\b', 'i'
);
const DRAFT_FORMS = [
    FACE_UP, NOTE, EXTRA_CARD, REMOVE_FACE_UP, PASS_PACK, MARK_COLORS, RANDOM_DRAFT
];
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
        this.passesNextPack = Boolean(match.groups.passed);
        this.colorsToMark = match.groups.colors ? numberValue(match.groups.colors) : null;
        this.requiresRandomDraft = Boolean(match.groups.random);
    }
}
