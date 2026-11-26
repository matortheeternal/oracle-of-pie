import Effect from './Effect.js';
import { TYPAL_SCALING } from '../values/typalScaling.js';
import PTModifier from '../values/PTModifier.js';
import consumeGrantedAbilities from '../values/consumeGrantedAbilities.js';
import {
    usesCreatureCount, usesOpposingArtifactCount
} from '../values/quantityDependencies.js';

const GETS = /^gets? (?<amount>an additional |twice )?(?=[+\-−]?(?:\d+|X|\*)\/)/i;
const AND_GAINS = /^and (?:gains?|has|have) /i;
const AND_ALL_TYPES = /^and (?:gains?|has|have) all creature types\b/i;
const SCALING = /^(for each (?:[^,.]|, (?=non))+|where X is [^,.]+|as long as [^,.]+)/i;
const TYPAL_COUNTS = new RegExp(`^(${TYPAL_SCALING})`);
const OR = /^or (?=[+\-−]?(?:\d+|X|\*)\/)/i;
const CAP = /^, to a maximum of (\d+)\b/i;

const NO_GRANTS = { keywords: null, quoted: null, quotedAbilities: [] };

export default class ModifyPTEffect extends Effect {
    static get pattern() {
        return GETS;
    }

    parseArguments(match) {
        this.modifier = this.consume([PTModifier]);
        this.multiplier = match.groups.amount?.toLowerCase() === 'twice ' ? 2 : 1;
        this.alternative = this.consumeText(OR) ? this.consume([PTModifier]) : null;
        this.gainsAllTypes = Boolean(this.consumeText(AND_ALL_TYPES));
        Object.assign(this, this.consumeGrants());
        const scaling = this.consumeText(TYPAL_COUNTS) ?? this.consumeText(SCALING);
        this.scaling = scaling?.[1] ?? null;
        this.cap = Number(this.consumeText(CAP)?.[1]) || null;
    }

    consumeGrants() {
        const start = this.remainingStr;
        if (!this.consumeText(AND_GAINS)) return NO_GRANTS;
        const abilities = consumeGrantedAbilities(this);
        if (!abilities.keywords && !abilities.quoted) this.remainingStr = start;
        return abilities;
    }

    get parts() {
        return [this.modifier, this.alternative, this.keywords, ...this.quotedAbilities]
            .filter(Boolean);
    }

    get usesOpposingArtifactCount() {
        return usesOpposingArtifactCount(this.scaling);
    }

    get usesCreatureCount() {
        return usesCreatureCount(this.scaling);
    }

    get phrases() {
        return [this.subject].filter(Boolean);
    }

    get grantsKeywords() {
        return Boolean(this.keywords);
    }

    get grantedKeywordNames() {
        return this.keywords?.names ?? [];
    }

    get conferredKeywordNames() {
        return this.grantedKeywordNames;
    }

    grantsKeyword(name) {
        return Boolean(this.keywords?.names.includes(name));
    }
}
