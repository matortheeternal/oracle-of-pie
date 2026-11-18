import Effect from './Effect.js';

const MANA_KIND_ALTERNATIVES = [
    'of any (?:one )?(?:color|type)',
    'in any combination of [^,.]+',
    'of the chosen color',
    'of any of the exiled card\'s colors'
];
const MANA_ALTERNATIVES = [
    '(?:\\{[^}]+\\})+(?:,? (?:or |and )?(?:\\{[^}]+\\})+)*',
    `(?:[a-z]+|\\d+|X) mana (?:${MANA_KIND_ALTERNATIVES.join('|')})`,
    '[^,.]*\\bmana\\b(?! value)[^,.]*',
    '[^,.]*?\\{[^}]+\\}[^,.]*'
];
const MANA = new RegExp(`^(?:${MANA_ALTERNATIVES.join('|')})`, 'i');
const ADD = new RegExp(`^adds? (?=${MANA.source.slice(1)})`, 'i');
const MANA_TAIL = /^(for each [^,.]+|instead)/i;

export default class AddManaEffect extends Effect {
    static get pattern() {
        return ADD;
    }

    parseArguments(match) {
        this.mana = this.consumeText(MANA)?.[0] ?? null;
        this.consumeText(MANA_TAIL);
    }

    get isComplete() {
        return Boolean(this.mana);
    }
}
