import Effect from './Effect.js';
import { TYPE_WORDS } from '../phrases/vocabulary.js';

const SOURCE = '(?:artifacts|creatures|enchantments|lands|planeswalkers|battles)';
const ACTIVATION_BAN = new RegExp(
    `^activated abilities of (${SOURCE}(?:, ${SOURCE})*(?:,? (?:and|or) ${SOURCE})?) `
        + 'can\'t be activated(?=$|[.,])',
    'i'
);
const SOURCE_SEPARATOR = /,? (?:and|or) |, /i;

export default class ActivationBanEffect extends Effect {
    static get pattern() {
        return ACTIVATION_BAN;
    }

    parseArguments(match) {
        this.sourceTypes = match[1].toLowerCase().split(SOURCE_SEPARATOR)
            .map(source => TYPE_WORDS[source]);
    }
}
