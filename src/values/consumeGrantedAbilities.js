import KeywordList from './KeywordList.js';
import QuotedAbility from './QuotedAbility.js';

const QUOTE_SEPARATOR = /^\s*,? ?(?:and )?(?=["'])/i;
const KEYWORD_SEPARATOR = /^(?:,? ?and |, )/i;

function consumeNextQuoted(parser) {
    const start = parser.remainingStr;
    if (!parser.consumeText(QUOTE_SEPARATOR)) return null;
    const quoted = parser.consume([QuotedAbility]);
    if (!quoted) parser.remainingStr = start;
    return quoted;
}

function consumeQuotedList(parser, keywords) {
    const first = keywords ? consumeNextQuoted(parser) : parser.consume([QuotedAbility]);
    if (!first) return [];
    const quoted = [first];
    for (let next = consumeNextQuoted(parser); next; next = consumeNextQuoted(parser))
        quoted.push(next);
    return quoted;
}

function consumeKeywordsAfterQuotes(parser, quotedAbilities) {
    if (!quotedAbilities.length) return null;
    const start = parser.remainingStr;
    if (!parser.consumeText(KEYWORD_SEPARATOR)) return null;
    const keywords = parser.consume([KeywordList]);
    if (!keywords) parser.remainingStr = start;
    return keywords;
}

export default function consumeGrantedAbilities(parser) {
    const initialKeywords = parser.consume([KeywordList]);
    const quotedAbilities = consumeQuotedList(parser, initialKeywords);
    const keywords = initialKeywords
        ?? consumeKeywordsAfterQuotes(parser, quotedAbilities);
    return { keywords, quoted: quotedAbilities[0] ?? null, quotedAbilities };
}
