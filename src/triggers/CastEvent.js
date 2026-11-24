import TriggerEvent from './TriggerEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import FirstTime from './qualifiers/FirstTime.js';
import SpellTarget from './qualifiers/SpellTarget.js';
import ZoneOrigin from './qualifiers/ZoneOrigin.js';
import ZoneModifier from '../phrases/modifiers/ZoneModifier.js';
import WithModifier from '../phrases/modifiers/WithModifier.js';
import BackReference from '../phrases/BackReference.js';
import UnrecognizedText from '../values/UnrecognizedText.js';
import CastSpell from './objects/CastSpell.js';

const SUBJECT = '(?<subject>(?:(?! (?:and|or) (?:whenever|when|at) ).)+?)';
const MANA_SPENT = '(?<manaSpent> spends? this mana to)?';
const PLAYS_LAND = '(?<playsLand> plays? a land or)?';
const CASTER = `^${SUBJECT}(?<next> next)?${MANA_SPENT}${PLAYS_LAND} casts? `;
const COPY_ALTERNATIVE = '(?:or (?<otherVerb>[a-z]+) )?';
const SPELL = '(?<spell>this spell\\b|~|.*?\\bspells?\\b)';
const CAST = new RegExp(CASTER + COPY_ALTERNATIVE + SPELL, 'i');
const THIS_SPELL = /^(?:this spell|~)$/i;

export default class CastEvent extends TriggerEvent {
    static get pattern() {
        return CAST;
    }

    static get qualifierParsers() {
        return [
            ZoneModifier, ZoneOrigin, WithModifier, SpellTarget, FirstTime, TurnWindow
        ];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.spell = match.groups.spell;
        this.otherVerb = match.groups.otherVerb ?? null;
        this.isNext = Boolean(match.groups.next);
        this.paidWithThisMana = Boolean(match.groups.manaSpent);
        this.includesLandPlay = Boolean(match.groups.playsLand);
        this.includesCopy = ['copy', 'copies'].includes(this.otherVerb);
        Object.defineProperty(this, 'spellSource', {
            value: str.slice(match[0].length - this.spell.length)
        });
    }

    get isRepeatable() {
        return !this.castsSelf;
    }

    get objectText() {
        return this.castsSelf ? null : this.spell;
    }

    parseObjectPhrase() {
        if (this.castsSelf) return null;
        const reference = this.parseNext(this.spell, [BackReference]);
        if (reference) return reference;
        const spell = this.parseNext(this.spell, [CastSpell]);
        if (!spell) return null;
        if (!this.unreadSubject) spell.caster = this.subjectPhrase;
        if (spell.remainingStr) return spell;
        spell.readModifiers(this.spellSource, this.remainingStr);
        this.remainingStr = spell.remainingStr;
        return spell;
    }

    unreadParticipant(phrase, source) {
        if (!source) return null;
        const consumed = phrase?.isRecognized ? phrase.raw.length : 0;
        const leftover = source.slice(consumed).trimStart();
        return UnrecognizedText.fromLeftover(this.scribe, leftover);
    }

    get castsSelf() {
        return THIS_SPELL.test(this.spell);
    }
}
