import GapDirection from './GapDirection.js';

export default class AfterEffectDirection extends GapDirection {
    static matches(gap) {
        return gap.site.type === 'after-effect';
    }

    get title() {
        return `Extend ${this.owner}`;
    }

    get steps() {
        return [
            `${this.owner} parsed the text before this and stopped here.`,
            'If this text belongs to that effect (a duration, destination, '
                + '"instead" tail or extra object), extend its pattern or read it in '
                + 'parseArguments with consumeText or consume (Effect.js).',
            'If it is a separate clause, check that ClauseReader recognizes the '
                + 'connector between them.'
        ];
    }

    get relatedClasses() {
        return [this.owner, 'Effect', 'ClauseReader'];
    }
}
