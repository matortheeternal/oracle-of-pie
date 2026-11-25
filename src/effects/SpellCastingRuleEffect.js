import Effect from './Effect.js';

const MODES = [
    'can be cast as though (?:it|they) had flash',
    'can cast spells only during your turn',
    'may be cast without paying (?:its|their) mana costs?',
    'can be cast without paying (?:its|their) mana costs?'
];
const CAST_PRIVILEGE = new RegExp('^(?<permission>' + MODES.join('|') + ')\\b', 'i');
const COST_EXEMPTION = /\bwithout paying\b/i;
const FLASH_TIMING = /\bhad flash\b/i;

export default class SpellCastingRuleEffect extends Effect {
    static get pattern() {
        return CAST_PRIVILEGE;
    }

    parseArguments(match) {
        this.waivesManaCost = COST_EXEMPTION.test(match.groups.permission);
        this.grantsFlashTiming = FLASH_TIMING.test(match.groups.permission);
        this.restrictsTiming = !this.waivesManaCost && !this.grantsFlashTiming;
    }
}
