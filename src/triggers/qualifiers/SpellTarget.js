import Parser from '../../core/Parser.js';

const SINGLE_TARGET = [
    'artifact or creature', 'nonland permanent', 'creature', 'opponent', 'permanent'
].join('|');
const TARGET = [
    'this creature', '~', `a single (?:${SINGLE_TARGET})`, 'a modified permanent',
    'a creature', 'an artifact or land'
].join('|');
const CONTROL = 'you (?:control|don\'t control)|an opponent controls';
const CONTROLLER = `(?: (?<controller>${CONTROL}))?`;
const TARGETS = new RegExp(
    `^that targets (?<exclusive>only )?(?<target>${TARGET})${CONTROLLER}(?=\\s|$|,)`, 'i'
);
const SELF = /^(?:this creature|~)$/i;
const SINGLE = /^a single /i;

export default class SpellTarget extends Parser {
    static match(scribe, str) {
        return str.match(TARGETS);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { exclusive, target, controller } = match.groups;
        this.target = target.toLowerCase();
        this.controller = controller?.toLowerCase() ?? null;
        this.isExclusive = Boolean(exclusive);
    }

    get refersToSelf() {
        return SELF.test(this.target);
    }

    get requiresSingleTarget() {
        return this.isExclusive && (this.refersToSelf || SINGLE.test(this.target));
    }
}
