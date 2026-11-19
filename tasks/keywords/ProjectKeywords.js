import KeywordHarvest from './KeywordHarvest.js';
import projectSettings from './projectSettings.js';
import { ColorTiers } from 'oracle-of-pie';

const PROJECT_SOURCE = 'project keyword';

function keyOf(definition) {
    return definition.name.toLowerCase();
}

export default class ProjectKeywords {
    constructor(scribe, projectDir) {
        this.harvest = new KeywordHarvest(scribe);
        this.configured = projectSettings(projectDir).customKeywords ?? [];
    }

    addCard(card) {
        this.harvest.addCard(card);
    }

    get definitions() {
        const merged = new Map();
        for (const definition of this.harvest.definitions)
            merged.set(keyOf(definition), { ...definition, source: 'harvested' });
        for (const definition of this.configured)
            merged.set(keyOf(definition), { ...definition, source: 'configured' });
        return [...merged.values()].filter(definition => !definition.disabled);
    }

    get pieTiers() {
        const tiered = this.definitions.filter(definition => definition.tiers);
        const entries = tiered.map(({ name, tiers }) =>
            [name.toLowerCase(), ColorTiers.fromNames(tiers, PROJECT_SOURCE)]);
        return Object.fromEntries(entries);
    }
}
