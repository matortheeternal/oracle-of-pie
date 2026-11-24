import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const STATS = 'power( and toughness)?';
const DOUBLE_POWER = new RegExp(
    `^double (?:the ${STATS} of ([^,.]+?)|(?:(it)s|([^,.]+?)['’]s) ${STATS})`
        + '( X times)?(?= until\\b| and\\b|[,.]|$)',
    'i'
);

export default class DoublePowerEffect extends Effect {
    static match(scribe, str) {
        const match = str.match(DOUBLE_POWER);
        if (!match) return null;
        const object = match[2] ?? match[3] ?? match[4];
        const phraseMatch = PhraseList.match(scribe, object);
        if (!phraseMatch) return null;
        const objects = PhraseList.parse(scribe, phraseMatch, object);
        if (objects.remainingStr || !objects.isRecognized) return null;
        return {
            0: match[0],
            objects,
            doublesToughness: Boolean(match[1] ?? match[5]),
            repeatsForX: Boolean(match[6])
        };
    }

    parseArguments(match) {
        this.objects = match.objects;
        this.doublesToughness = match.doublesToughness;
        this.repeatsForX = match.repeatsForX;
    }

    get parts() {
        return [this.objects];
    }

    get phrases() {
        return this.objects.phrases;
    }
}
