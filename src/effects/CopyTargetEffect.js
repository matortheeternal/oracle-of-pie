import ObjectEffect from './ObjectEffect.js';

const TARGETS = /^(?<each>each|the) copy targets? /i;
const DISTINCT = new RegExp(
    '^a different (?<count>one|two|three) of (?=those (?:creatures|permanents)\\b)', 'i'
);

export default class CopyTargetEffect extends ObjectEffect {
    static get pattern() {
        return TARGETS;
    }

    parseArguments(match) {
        this.eachCopy = match.groups.each.toLowerCase() === 'each';
        this.distinctTargets = this.consumeText(DISTINCT)?.groups.count ?? null;
        super.parseArguments(match);
    }
}
