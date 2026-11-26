import { Oracle } from '../../src/index.js';
import InlineActionHarvest from './InlineActionHarvest.js';
import KeywordHarvest from '../keywords/KeywordHarvest.js';
import parsePrintedFace from '../corpus/parsePrintedFace.js';
import collectGaps from '../gaps/collectGaps.js';
import GapReport from '../gaps/GapReport.js';

function harvestCard(card) {
    const faces = [...card.faces];
    if (card.shared_rules_text) faces.push({ oracle_text: card.shared_rules_text });
    return { name: card.name, faces };
}

function parseCard(scribe, card) {
    const parsed = card.faces.map(face => parsePrintedFace(scribe, card, face));
    if (card.shared_rules_text) {
        const shared = { ...card.faces[0], oracle_text: card.shared_rules_text };
        parsed.push(parsePrintedFace(scribe, card, shared));
    }
    return parsed;
}

export default class EggHubAudit {
    constructor() {
        this.base = new Oracle();
        this.report = new GapReport();
        this.baselineModeled = 0;
        this.failures = [];
        this.offset = { gained: 0, lost: 0 };
    }

    harvest(sets) {
        const harvest = new KeywordHarvest(this.base);
        const actions = new InlineActionHarvest(this.base);
        for (const set of sets) {
            for (const card of set.cards()) {
                const entry = harvestCard(card);
                harvest.addCard(entry);
                actions.addCard(entry);
            }
        }
        const isKeyword = ({ name }) => !this.base.actionPattern.test(name);
        const actionDefinitions = actions.definitions;
        const actionNames = new Set(actionDefinitions.map(definition => definition.name));
        const keywords = harvest.definitions.filter(isKeyword)
            .filter(({ name }) => !actionNames.has(name.toLowerCase()));
        return { keywords, actions: actionDefinitions };
    }

    measure(card, scribe) {
        try {
            return this.addCard(card, scribe);
        } catch (error) {
            this.failures.push({ id: card.id, name: card.name, message: error.message });
            this.report.addCard(card.name, [], false);
            return [{ raw: error.message, context: 'Parser error', kind: 'error' }];
        }
    }

    addCard(card, scribe) {
        const parsed = parseCard(scribe, card);
        const modeled = parsed.every(face => face.isFullyModeled);
        const gaps = parsed.flatMap(face => collectGaps(face.text));
        const baseline = scribe === this.base ? modeled
            : parseCard(this.base, card).every(face => face.isFullyModeled);
        if (baseline) this.baselineModeled++;
        if (modeled && !baseline) this.offset.gained++;
        if (!modeled && baseline) this.offset.lost++;
        this.report.addCard(`${card.name} [${card.id}]`, gaps, modeled);
        return gaps;
    }
}
