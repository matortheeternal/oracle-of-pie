import Parser from '../core/Parser.js';
import { trimLeadingSpace } from '../core/Node.js';
import EffectSubjectGroup from '../phrases/EffectSubjectGroup.js';
import TrailingCondition from './TrailingCondition.js';
import UnrecognizedText from '../values/UnrecognizedText.js';
import { EFFECT_PARSERS, MODELED_EFFECT_PARSERS } from '../effects/index.js';
import { PHRASE_PARSERS } from '../phrases/index.js';
import OpaqueEffect from '../effects/OpaqueEffect.js';

const CONNECTOR = /^(?:,? ?and then |,? ?then |, (?:and|but) |; |and |,? ?or |, )/i;
const ALTERNATIVE = /^,? ?or /i;
const MAY = /^may /i;
const GROUP_ADVERB = /^(?:each|both) /i;
const ONLY = /^only /i;
const SINGULAR_BE = /^'s /i;
const PLURAL_BE = /^'re /i;
const ALSO = /^also /i;
const INSTEAD = /^instead /i;

function attachSubject(effect, subject, isOptional) {
    effect.subject = subject;
    effect.isOptional = isOptional;
    return effect;
}

export default class ClauseReader extends Parser {
    static read(scribe, text) {
        const reader = new ClauseReader(scribe, null, text);
        reader.readAll();
        return reader;
    }

    static startsClause(scribe, str) {
        return Boolean(new ClauseReader(scribe, null, str).readClause());
    }

    static startsModeledClause(scribe, str) {
        const effect = new ClauseReader(scribe, null, str).readClause();
        return Boolean(effect?.isRecognized && !effect.isOpaque);
    }

    readAll() {
        this.clauseEffects = [this.readClause()];
        while (this.readNextClause()) continue;
        this.condition = this.consume([TrailingCondition]);
        this.unrecognized = this.consume([UnrecognizedText]);
    }

    readNextClause() {
        this.remainingStr = trimLeadingSpace(this.remainingStr);
        const connector = this.remainingStr.match(CONNECTOR);
        if (!connector) return false;
        const rest = this.remainingStr.slice(connector[0].length);
        if (!ClauseReader.startsClause(this.scribe, rest)) return false;
        this.consumeText(CONNECTOR);
        const effect = this.readClause();
        effect.isAlternative = ALTERNATIVE.test(connector[0]);
        const subject = this.clauseEffects.at(-1)?.actingSubject;
        if (effect && !effect.subject && subject && effect.acceptsSubject(subject))
            effect.shareSubject(subject);
        this.clauseEffects.push(effect);
        return true;
    }

    readClause() {
        this.consumeText(ALSO);
        const replaces = Boolean(this.consumeText(INSTEAD));
        const isOptional = Boolean(this.consumeText(MAY));
        const effect = this.readEffect();
        if (!effect) return null;
        if (replaces) effect.replacesPriorAction = true;
        if (isOptional) effect.isOptional = true;
        return effect;
    }

    readEffect() {
        return this.consume(MODELED_EFFECT_PARSERS)
            ?? this.readSubjectEffect() ?? this.consume([OpaqueEffect]);
    }

    readSubjectEffect() {
        const start = this.remainingStr;
        const restricted = Boolean(this.consumeText(ONLY));
        const single = this.consume(PHRASE_PARSERS);
        const effect = single && this.readEffectFor(single);
        if (effect) {
            effect.limitedToSubject = restricted;
            return effect;
        }
        this.remainingStr = start;
        return this.readGroupEffect(start);
    }

    readGroupEffect(start) {
        const group = this.consume([EffectSubjectGroup]);
        const effect = group?.isGroup && this.readEffectFor(group);
        if (effect) return effect;
        this.remainingStr = start;
        return null;
    }

    readEffectFor(subject) {
        if (!subject) return null;
        this.consumeText(ALSO);
        const isOptional = Boolean(this.consumeText(MAY));
        this.consumeText(ALSO);
        this.consumeText(GROUP_ADVERB);
        const replaces = Boolean(this.consumeText(INSTEAD));
        this.remainingStr = this.remainingStr.replace(SINGULAR_BE, 'is ')
            .replace(PLURAL_BE, 'are ');
        const effect = this.consume(EFFECT_PARSERS);
        if (!effect) return null;
        if (replaces) effect.replacesPriorAction = true;
        return attachSubject(effect, subject, isOptional);
    }
}
