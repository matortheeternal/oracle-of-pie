import ReplacementSentence from './ReplacementSentence.js';
import RestrictionSentence from './RestrictionSentence.js';
import ConditionalSentence from './ConditionalSentence.js';
import ClauseSentence from './ClauseSentence.js';
import TriggerSentence from './TriggerSentence.js';

export const SENTENCE_PARSERS = [
    ReplacementSentence, RestrictionSentence, TriggerSentence, ConditionalSentence,
    ClauseSentence
];
