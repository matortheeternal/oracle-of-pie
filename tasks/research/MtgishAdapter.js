import fs from 'node:fs';
import { CardColors, PieInspector } from '../../src/index.js';
import { COLOR_POLICIES } from '../../src/pie/policies/index.js';
import { analyzeRule, cardFaces } from './mtgishSemantics.js';

const TAG_INSPECTIONS = {
    draw: 'draw-cards', lifegain: 'gain-life', 'mill-self': 'mill-self',
    loot: 'loot', rummage: 'rummage'
};

function inspectionsFor({ tags, keyword }) {
    const ids = [...tags].map(tag => TAG_INSPECTIONS[tag]).filter(Boolean);
    if (keyword) ids.push(`keyword-${keyword.replaceAll(' ', '-')}`);
    return ids;
}

function colorsFor(face, card) {
    const original = card.faces.find(candidate => candidate.name === face.Name);
    const source = original ?? card;
    return new CardColors({ colors: source.colors, manaCost: source.mana_cost ?? '' });
}

export default class MtgishAdapter {
    constructor(filename) {
        const lines = fs.readFileSync(filename, 'utf8').trim().split('\n');
        this.cards = new Map();
        for (const line of lines) this.addCard(JSON.parse(line));
        this.inspections = new Map(new PieInspector().inspections.map(i => [i.id, i]));
    }

    addCard(card) {
        for (const face of cardFaces(card)) this.cards.set(face.Name, card);
    }

    lookup(card) {
        return this.cards.get(card.name) ?? this.cards.get(card.faces[0].name);
    }

    flag(id, colors, evidence) {
        const inspection = this.inspections.get(id);
        const policy = COLOR_POLICIES.find(candidate => candidate.appliesTo(colors));
        const verdict = policy?.judge(colors, inspection.tiers);
        if (!verdict) return null;
        return {
            inspection: id, severity: verdict.tier.severity,
            offending: verdict.offending, policy: policy.id, evidence
        };
    }

    inspectRule(rule, colors, result) {
        const semantics = analyzeRule(rule);
        const evidence = JSON.stringify(rule);
        for (const tag of semantics.tags) result.tags[tag] = evidence;
        const attributed = colors.withAbilityColors(semantics.colors);
        for (const id of inspectionsFor(semantics)) {
            const flag = this.flag(id, attributed, evidence);
            if (flag) result.flags.push(flag);
        }
    }

    inspectFace(face, card, result) {
        const colors = colorsFor(face, card);
        for (const rule of face.Rules) this.inspectRule(rule, colors, result);
    }

    predict(card) {
        const encoded = this.lookup(card);
        const result = { available: Boolean(encoded), tags: {}, flags: [] };
        if (!encoded) return result;
        for (const face of cardFaces(encoded)) this.inspectFace(face, card, result);
        return result;
    }
}
