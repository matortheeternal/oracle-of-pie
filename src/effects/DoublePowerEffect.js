import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const STATS = 'power(?: and toughness)?|toughness';
const FACTORS = { double: 2, triple: 3 };
const PROPERTY_FIRST = `(?<stat>${STATS}) of (?<object>[^,.]+?)`;
const OWNER = '(?:(?<it>it)s|(?<owner>[^,.]+?)[\'’]s)';
const OWNER_FIRST = `${OWNER} (?<owned>${STATS})`;
const DOUBLE_POWER = new RegExp(
    `^(?<action>double|triple) (?:the )?(?:${PROPERTY_FIRST}|${OWNER_FIRST})`
        + '(?<repeat> X times)?(?= until\\b| and\\b|[,.]|$)',
    'i'
);

export default class DoublePowerEffect extends Effect {
    static match(scribe, str) {
        const match = str.match(DOUBLE_POWER);
        if (!match) return null;
        const { object, it, owner } = match.groups;
        const text = object ?? it ?? owner;
        const phraseMatch = PhraseList.match(scribe, text);
        if (!phraseMatch) return null;
        const objects = PhraseList.parse(scribe, phraseMatch, text);
        if (objects.remainingStr || !objects.isRecognized) return null;
        const stat = (match.groups.stat ?? match.groups.owned).toLowerCase();
        return {
            0: match[0],
            objects,
            doublesPower: stat.includes('power'),
            doublesToughness: stat.includes('toughness'),
            repeatsForX: Boolean(match.groups.repeat),
            multiplier: FACTORS[match.groups.action.toLowerCase()]
        };
    }

    parseArguments(match) {
        this.objects = match.objects;
        this.doublesPower = match.doublesPower;
        this.doublesToughness = match.doublesToughness;
        this.repeatsForX = match.repeatsForX;
        this.multiplier = match.multiplier;
    }

    get parts() {
        return [this.objects];
    }

    get phrases() {
        return this.objects.phrases;
    }
}
