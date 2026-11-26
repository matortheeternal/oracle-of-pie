import Oracle from '../Oracle.js';
import KeywordHarvest from './KeywordHarvest.js';
import InlineActionHarvest from './InlineActionHarvest.js';
import inferTokens from './inferTokens.js';

function withoutEvidence({ name, reminder, reminders }) {
    return { name, reminder, ...(reminders?.length > 1 && { reminders }) };
}

export default function inferMechanics(cards, options = {}) {
    const { oracle = new Oracle(), includeEvidence = false } = options;
    const keywords = new KeywordHarvest(oracle);
    const actions = new InlineActionHarvest(oracle);
    const set = [...cards];
    for (const card of set) {
        keywords.addCard(card);
        actions.addCard(card);
    }
    const actionDefinitions = actions.definitions;
    const actionNames = new Set(actionDefinitions.map(definition => definition.name));
    const keywordDefinitions = keywords.definitions.filter(({ name }) =>
        !actionNames.has(name.toLowerCase()) && !oracle.actionPattern.test(name));
    const tokens = inferTokens(set);
    if (includeEvidence)
        return { keywords: keywordDefinitions, actions: actionDefinitions, tokens };
    return {
        keywords: keywordDefinitions.map(withoutEvidence),
        actions: actionDefinitions.map(withoutEvidence),
        tokens
    };
}
