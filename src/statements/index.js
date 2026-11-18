import ReplacementStatement from './ReplacementStatement.js';
import RestrictionStatement from './RestrictionStatement.js';
import ConditionalStatement from './ConditionalStatement.js';
import ClauseStatement from './ClauseStatement.js';

export const STATEMENT_PARSERS = [
    ReplacementStatement, RestrictionStatement, ConditionalStatement, ClauseStatement
];
