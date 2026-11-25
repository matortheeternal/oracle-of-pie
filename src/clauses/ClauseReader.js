import Parser from '../core/Parser.js';
import EffectSubjectGroup from '../phrases/EffectSubjectGroup.js';
import TrailingCondition from './TrailingCondition.js';
import UnrecognizedText from '../values/UnrecognizedText.js';
import { EFFECT_PARSERS } from '../effects/index.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const CONNECTOR = /^(?:,? ?and then |,? ?then |, and |; |and |,? ?or |, )/i;
const ALTERNATIVE = /^,? ?or /i;
const MAY = /^may /i;
const EACH = /^each /i;
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

    readAll() {
        this.clauseEffects = [this.readClause()];
        while (this.readNextClause()) continue;
        this.condition = this.consume([TrailingCondition]);
        this.unrecognized = this.consume([UnrecognizedText]);
    }

    readNextClause() {
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
        const effect = this.consume(EFFECT_PARSERS) ?? this.readSubjectEffect();
        if (effect && replaces) effect.replacesPriorAction = true;
        return effect;
    }

    readSubjectEffect() {
        const start = this.remainingStr;
        const single = this.consume(PHRASE_PARSERS);
        const effect = single && this.readEffectFor(single);
        if (effect) return effect;
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
        this.consumeText(EACH);
        const replaces = Boolean(this.consumeText(INSTEAD));
        const effect = this.consume(EFFECT_PARSERS);
        if (!effect) return null;
        if (replaces) effect.replacesPriorAction = true;
        return attachSubject(effect, subject, isOptional);
    }
}
