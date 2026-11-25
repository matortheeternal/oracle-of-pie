import Phrase from '../../phrases/Phrase.js';

const SOURCE_KINDS = [
    'a spell or an? ability', 'an? ability or a spell', 'a black spell',
    'a spell(?: or ability)?', 'an (?:activated |triggered )?ability',
    'an aura spell', 'an instant or sorcery spell'
].join('|');
const CONTROLLER = '(?: (?<controller>you control|an opponent controls|they control))?';
const SOURCE = new RegExp(`^(?<kind>${SOURCE_KINDS})${CONTROLLER}\\b`, 'i');
const SPELL = /\bspell\b/i;
const ABILITY = /\bability\b/i;

export default class TargetingSource extends Phrase {
    static match(scribe, str) {
        return str.match(SOURCE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { kind, controller } = match.groups;
        this.includesSpell = SPELL.test(kind);
        this.includesAbility = ABILITY.test(kind);
        this.controller = controller?.toLowerCase() ?? null;
    }

    get controlledByYou() {
        return this.controller === 'you control';
    }

    get controlledByOpponent() {
        return this.controller === 'an opponent controls';
    }

    get isAntecedentCandidate() {
        return this.includesSpell && !this.includesAbility;
    }

    get requiresTypedReference() {
        return true;
    }

    hasType(type) {
        return type === 'spell' && this.includesSpell;
    }
}
