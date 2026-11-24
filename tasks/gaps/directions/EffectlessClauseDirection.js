import GapDirection from './GapDirection.js';

const WORD = /[a-z]{4,}/g;
const CANDIDATE_LIMIT = 6;
const NO_CLUE = 'No existing effect mentions a distinctive word from this clause.';

export default class EffectlessClauseDirection extends GapDirection {
    static matches(gap) {
        return gap.site.type === 'clause';
    }

    get title() {
        return 'No effect matched this clause';
    }

    get words() {
        return this.gap.raw.toLowerCase().match(WORD) ?? [];
    }

    isDistinctive(files) {
        return files.length > 0 && files.length <= CANDIDATE_LIMIT;
    }

    get clue() {
        this.foundClue ??= this.findClue();
        return this.foundClue;
    }

    findClue() {
        for (const word of this.words) {
            const files = this.sources.filesMentioning(word, 'effects');
            if (this.isDistinctive(files)) return { word, files };
        }
        return { word: null, files: [] };
    }

    get clueStep() {
        const { word } = this.clue;
        if (!word) return NO_CLUE;
        return `The effect files listed below mention "${word}"; if one of them covers `
            + 'this action, widen its pattern.';
    }

    get steps() {
        return [
            `No effect in EFFECT_PARSERS matched this clause inside ${this.owner}.`,
            this.clueStep,
            'Otherwise add an effect class in src/effects and register it in '
                + `${this.effectsIndex} before OpaqueEffect.`
        ];
    }

    get extraFiles() {
        return [this.effectsIndex, ...this.clue.files];
    }
}
