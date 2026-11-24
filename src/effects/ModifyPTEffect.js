import Effect from './Effect.js';
import PTModifier from '../values/PTModifier.js';
import consumeGrantedAbilities from '../values/consumeGrantedAbilities.js';
import {
    usesCreatureCount, usesOpposingArtifactCount
} from '../values/quantityDependencies.js';

const GETS = /^gets? (?=[+\-−]?(?:\d+|X|\*)\/)/i;
const AND_GAINS = /^and (?:gains?|has|have) /i;
const SCALING = /^(for each [^,.]+|where X is [^,.]+|as long as [^,.]+)/i;

export default class ModifyPTEffect extends Effect {
    static get pattern() {
        return GETS;
    }

    parseArguments(match) {
        this.modifier = this.consume([PTModifier]);
        Object.assign(this, this.consumeGrants());
        this.scaling = this.consumeText(SCALING)?.[1] ?? null;
    }

    consumeGrants() {
        if (!this.consumeText(AND_GAINS)) return { keywords: null, quoted: null };
        return consumeGrantedAbilities(this);
    }

    get parts() {
        return [this.modifier, this.keywords, this.quoted].filter(Boolean);
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
