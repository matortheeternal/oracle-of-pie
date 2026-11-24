import fs from 'node:fs';
import { readJson } from '../shared/files.js';
import { PATHS } from '../shared/paths.js';
import { parseCardFaces } from '../corpus/pieCorpus.js';
import collectGaps from './collectGaps.js';
import SourceIndex from './SourceIndex.js';
import { spanShape } from './spanShape.js';
import { directionFor } from './directions/index.js';

function summary(stats, opaqueShapes) {
    const { shape, cards, unlocks, contexts, examples } = stats;
    const kind = opaqueShapes.has(shape) ? 'opaque' : 'unread';
    return { shape, cards, unlocks, contexts, examples, kind };
}

function collectShapeIds(node, shape, ids) {
    const isGap = !node.isRecognized || node.isOpaque;
    if (isGap && spanShape(node.raw ?? '') === shape) ids.push(node.id);
    for (const child of node.children) collectShapeIds(child, shape, ids);
    return ids;
}

export default class GapService {
    constructor(astService) {
        this.ast = astService;
        this.sources = new SourceIndex();
    }

    get report() {
        if (!fs.existsSync(PATHS.gapReport)) return null;
        const { mtimeMs } = fs.statSync(PATHS.gapReport);
        if (this.reportTime !== mtimeMs) this.loadReport(mtimeMs);
        return this.cachedReport;
    }

    loadReport(mtimeMs) {
        const report = readJson(PATHS.gapReport);
        this.cachedReport = report;
        this.reportTime = mtimeMs;
        this.opaqueShapes = new Set(report.opaque.map(stats => stats.shape));
        this.byShape = new Map(report.unrecognized.map(stats => [stats.shape, stats]));
    }

    list() {
        const report = this.report;
        if (!report) return null;
        const gaps = report.unrecognized.map(stats => summary(stats, this.opaqueShapes));
        return { cards: report.cards, modeled: report.recognized, gaps };
    }

    detail(shape) {
        if (!this.report) return null;
        return this.byShape.get(shape) ?? null;
    }

    gapsOf(card) {
        const faces = parseCardFaces(this.ast.scribe, card);
        const gaps = faces.flatMap(face => collectGaps(face.parsed.text));
        const modeled = faces.every(face => face.parsed.isFullyModeled);
        return { gaps, modeled };
    }

    describeGap(gap) {
        const direction = directionFor(gap, this.sources);
        const { kind, raw, context } = gap;
        return { kind, raw, context, shape: spanShape(raw), direction };
    }

    card(shape, name) {
        const card = this.ast.findCard(name);
        if (!card) return null;
        const inspection = this.ast.inspect(card);
        const { gaps, modeled } = this.gapsOf(card);
        const shapeIds = face => collectShapeIds(face.tree, shape, []);
        const gapIds = inspection.faces.map(shapeIds);
        const described = gaps.map(gap => this.describeGap(gap));
        return { ...inspection, modeled, gapIds, gaps: described };
    }

    recheckCard(shape, name) {
        const card = this.ast.findCard(name);
        if (!card) return { name, missing: true };
        const { gaps, modeled } = this.gapsOf(card);
        const remaining = gaps.filter(gap => spanShape(gap.raw) === shape);
        return { name, resolved: !remaining.length, modeled, gaps: gaps.length };
    }

    recheck(shape) {
        const stats = this.detail(shape);
        if (!stats) return null;
        return stats.cardNames.map(name => this.recheckCard(shape, name));
    }
}
