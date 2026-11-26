import Parser from '../../core/Parser.js';

const SINGLE_TARGET = [
    'artifact or creature', 'nonland permanent', 'creature', 'opponent', 'permanent'
].join('|');
const TARGET = [
    'one or more (?:creatures(?: or Vehicles)?|permanents)',
    'an opponent or a creature an opponent controls',
    'a single permanent or player',
    'a single opponent or a single permanent an opponent controls',
    'this creature', '~', 'it', `a single (?:${SINGLE_TARGET})`, 'a modified permanent',
    'a creature', 'an artifact or land', 'an artifact or creature'
].join('|');
const CONTROL = 'you (?:control|don\'t control)|an opponent controls|they control';
const CONTROLLER = `(?: (?<controller>${CONTROL}))?`;
const EXCLUSION = '(?: other than (?<excluded>this creature|~))?';
const TARGETS = new RegExp(
    `^that targets (?<exclusive>only )?(?<target>${TARGET})`
        + `${CONTROLLER}${EXCLUSION}(?=\\s|$|,)`,
    'i'
);
const SELF = /^(?:this creature|~)$/i;
const REFERENT = /^(?:it|this creature|~)$/i;
const SINGLE = /^a single /i;

export default class SpellTarget extends Parser {
    static match(scribe, str) {
        return str.match(TARGETS);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { exclusive, target, controller, excluded } = match.groups;
        this.target = target.toLowerCase();
        this.controller = controller?.toLowerCase() ?? null;
        this.isExclusive = Boolean(exclusive);
        this.excludedTarget = excluded?.toLowerCase() ?? null;
    }

    get refersToSelf() {
        return SELF.test(this.target);
    }

    get requiresSingleTarget() {
        const single = REFERENT.test(this.target) || SINGLE.test(this.target);
        return this.isExclusive && single;
    }
}
