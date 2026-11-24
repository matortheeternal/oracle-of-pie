import Parser from '../../core/Parser.js';

const FOR_MANA = /^for (?:mana|(?<colorless>\{C\}))(?=$|[ ,.])/i;

export default class ForMana extends Parser {
    static match(scribe, str) {
        return str.match(FOR_MANA);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isColorlessOnly = Boolean(match.groups.colorless);
    }
}
