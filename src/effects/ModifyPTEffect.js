import Effect from './Effect.js';
import PTModifier from '../values/PTModifier.js';
import consumeGrantedAbilities from '../values/consumeGrantedAbilities.js';
import {
    usesCreatureCount, usesOpposingArtifactCount
} from '../values/quantityDependencies.js';

const GETS = /^gets? (?:an additional )?(?=[+\-−]?(?:\d+|X|\*)\/)/i;
const AND_GAINS = /^and (?:gains?|has|have) /i;
const SCALING = /^(for each (?:[^,.]|, (?=non))+|where X is [^,.]+|as long as [^,.]+)/i;

const NO_GRANTS = { keywords: null, quoted: null, quotedAbilities: [] };

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
        if (!this.consumeText(AND_GAINS)) return NO_GRANTS;
        return consumeGrantedAbilities(this);
    }

    get parts() {
        return [this.modifier, this.keywords, ...this.quotedAbilities].filter(Boolean);
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
