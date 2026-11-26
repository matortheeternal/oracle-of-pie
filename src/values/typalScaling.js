const TYPE = '[A-Z][a-z-]+';
export const TYPAL_SCALING = `for each (?:tapped |untapped )?${TYPE}(?:, ${TYPE})*`
    + `(?:,? (?:and/or|or|and) ${TYPE}) (?:you|they) control\\b`;
