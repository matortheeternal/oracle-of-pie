import Effect from './Effect.js';
import KeywordList from '../values/KeywordList.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const ABILITIES = new RegExp(
    `^(?<count>${NUMBER_PATTERN}) abilit(?:y|ies) from among `, 'i'
);
const CHOOSE = /^chooses? /i;

export default class ChooseKeywordsEffect extends Effect {
    static get pattern() {
        return CHOOSE;
    }

    static match(scribe, str) {
        const match = super.match(scribe, str);
        if (!match) return null;
        const rest = str.slice(match[0].length);
        const options = rest.match(ABILITIES);
        const text = options ? rest.slice(options[0].length) : rest;
        if (!KeywordList.match(scribe, text)) return null;
        const keywords = KeywordList.parse(scribe, [''], text);
        if (keywords.keywords.length < 2) return null;
        return Object.assign([match[0] + (options?.[0] ?? '') + keywords.raw], {
            count: numberValue(options?.groups.count ?? 'one'),
            keywords
        });
    }

    parseArguments(match) {
        this.count = match.count;
        this.options = match.keywords;
    }

    get parts() {
        return [this.options];
    }
}
