import Effect from './Effect.js';
import {
    usesCreatureCount, usesOpposingArtifactCount
} from '../values/quantityDependencies.js';

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
const MANA_TAIL = /^(for each (?:[^,.]|, (?=non))+|instead)/i;
const PRODUCED_BY = /^that ([^,.]+?) (?:could produce|produced)\b/i;

export default class AddManaEffect extends Effect {
    static get pattern() {
        return ADD;
    }

    parseArguments(match) {
        this.mana = this.consumeText(MANA)?.[0] ?? null;
        this.producedBy = this.consumeText(PRODUCED_BY)?.[1] ?? null;
        this.scaling = this.consumeText(MANA_TAIL)?.[0] ?? null;
    }

    get isComplete() {
        return Boolean(this.mana);
    }

    get usesOpposingArtifactCount() {
        return usesOpposingArtifactCount(this.scaling);
    }

    get usesCreatureCount() {
        return usesCreatureCount(this.scaling ?? this.mana);
    }
}
