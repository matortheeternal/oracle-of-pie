import ReplacementSentence from './ReplacementSentence.js';
import RestrictionSentence from './RestrictionSentence.js';
import ReflexiveTriggerSentence from './ReflexiveTriggerSentence.js';
import ConditionalSentence from './ConditionalSentence.js';
import EffectSentence from './EffectSentence.js';
import TriggerSentence from './TriggerSentence.js';

export const SENTENCE_PARSERS = [
    ReplacementSentence, RestrictionSentence, TriggerSentence, ReflexiveTriggerSentence,
    ConditionalSentence, EffectSentence
];
