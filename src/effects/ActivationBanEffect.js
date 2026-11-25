import Effect from './Effect.js';
import { TYPE_WORDS } from '../phrases/vocabulary.js';

const SOURCE = '(?:artifacts|creatures|enchantments|lands|planeswalkers|battles)';
const ACTIVATION_BAN = new RegExp(
    `^activated abilities of (${SOURCE}(?:, ${SOURCE})*(?:,? (?:and|or) ${SOURCE})?) `
        + 'can\'t be activated(?=$|[.,])',
    'i'
);
const SOURCE_SEPARATOR = /,? (?:and|or) |, /i;
const NAMED_ABILITY_BAN = new RegExp(
    '^(?<abilityKind>power-up|exhaust|mana) abilities can\'t be activated\\b', 'i'
);

export default class ActivationBanEffect extends Effect {
    static get pattern() {
        return ACTIVATION_BAN;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(NAMED_ABILITY_BAN);
    }

    parseArguments(match) {
        this.abilityKind = match.groups?.abilityKind.toLowerCase() ?? 'activated';
        const sources = match[1]?.toLowerCase().split(SOURCE_SEPARATOR) ?? [];
        this.sourceTypes = sources.map(source => TYPE_WORDS[source]).filter(Boolean);
    }
}
