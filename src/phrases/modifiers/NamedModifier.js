import Modifier from './Modifier.js';

const NAME_WORD = '(?:[A-Z][\\w\'’.-]*|of|the|and(?= [A-Z])|to|in|on|for|with)';
const NAME_PART = '[A-Z][\\w\'’.-]*(?: ' + NAME_WORD + ')*';
const ALTERNATE_NAME = '(?: or ' + NAME_PART + ')?';
const NAMED = new RegExp('^(?:not )?named (?<name>~|' + NAME_PART
    + '(?:, ' + NAME_PART + ')?' + ALTERNATE_NAME + ')\\b');

export default class NamedModifier extends Modifier {
    static match(scribe, str) {
        return str.match(NAMED);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.name = match.groups.name;
        this.negated = match[0].startsWith('not ');
    }

    get restrictsName() {
        return true;
    }
}
