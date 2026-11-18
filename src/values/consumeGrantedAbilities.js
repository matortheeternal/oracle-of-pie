import KeywordList from './KeywordList.js';
import QuotedAbility from './QuotedAbility.js';

const AND_QUOTED = /^\s*,? ?and (?=")/i;

function consumeQuoted(parser, keywords) {
    if (keywords && !parser.consumeText(AND_QUOTED)) return null;
    return parser.consume([QuotedAbility]);
}

export default function consumeGrantedAbilities(parser) {
    const keywords = parser.consume([KeywordList]);
    return { keywords, quoted: consumeQuoted(parser, keywords) };
}
