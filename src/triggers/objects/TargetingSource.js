import Phrase from '../../phrases/Phrase.js';
import { PHRASE_PARSERS } from '../../phrases/index.js';

const SOURCE_KINDS = [
    'a spell or an? ability', 'an? ability or a spell', 'a black spell',
    'a spell(?: or ability)?', 'an (?:activated |triggered )?ability',
    'an aura spell', 'an instant or sorcery spell', 'a backup ability'
].join('|');
const CONTROLLER = '(?: (?<controller>you control|an opponent controls|they control))?';
const SOURCE = new RegExp(`^(?<kind>${SOURCE_KINDS})${CONTROLLER}\\b`, 'i');
const SPELL = /\bspell\b/i;
const ABILITY = /\bability\b/i;
const OF = /^of /i;

export default class TargetingSource extends Phrase {
    static match(scribe, str) {
        return str.match(SOURCE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { kind, controller } = match.groups;
        this.kind = kind.toLowerCase();
        this.includesSpell = SPELL.test(kind);
        this.includesAbility = ABILITY.test(kind);
        this.controller = controller?.toLowerCase() ?? null;
        this.source = this.readAbilitySource();
    }

    readAbilitySource() {
        const start = this.remainingStr;
        if (!this.includesAbility || !this.consumeText(OF)) return null;
        const source = this.consume(PHRASE_PARSERS);
        if (!source?.isRecognized) this.remainingStr = start;
        return source?.isRecognized ? source : null;
    }

    get children() {
        return [this.source].filter(Boolean);
    }

    get controlledByYou() {
        return this.controller === 'you control' || Boolean(this.source?.controlledByYou);
    }

    get controlledByOpponent() {
        return this.controller === 'an opponent controls'
            || Boolean(this.source?.controlledByOpponent);
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
