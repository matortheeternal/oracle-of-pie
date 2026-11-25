import Effect from './Effect.js';

const STATUS = 'saddled|goaded|suspected|monstrous|renowned|worthy';
const BECOMES_STATUS = new RegExp(
    '^(?<verb>(?:is|are) (?:no longer |also |(?!goaded\\b))|becomes? )'
        + `(?<status>${STATUS})\\b`, 'i'
);
const COLOR = '(?:white|blue|black|red|green)';
const WORTHINESS = new RegExp(
    '^if it\'s an? (?<legendary>legendary )?non-(?<subtype>[a-z-]+) that\'s '
        + `(?<colors>${COLOR}(?: and/or ${COLOR})?)\\b`,
    'i'
);
const COLOR_JOINER = / and\/or /i;

export default class SetStatusEffect extends Effect {
    static get pattern() {
        return BECOMES_STATUS;
    }

    parseArguments(match) {
        this.status = match.groups.status.toLowerCase();
        this.removesStatus = match.groups.verb.toLowerCase().endsWith('longer ');
        const qualifications = this.status === 'worthy'
            ? this.consumeText(WORTHINESS)?.groups : null;
        this.requiresLegendary = Boolean(qualifications?.legendary);
        this.excludedSubtype = qualifications?.subtype ?? null;
        const colors = qualifications?.colors.toLowerCase();
        this.requiredColors = colors?.split(COLOR_JOINER) ?? [];
    }
}
