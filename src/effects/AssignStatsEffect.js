import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const PROPERTY = 'base (?:power and toughness|power|toughness)';
const POSSESSOR = '(?:~|[A-Z][\\w-]+|this creature|that creature|its controller)\'s|its';
const OWNER_FIRST = '(?:(?<owner>' + POSSESSOR + ') (?<ownerStats>' + PROPERTY + '))';
const PROPERTY_FIRST = '(?:the (?<stats>' + PROPERTY + ') of (?<objects>[^,.]+?))';
const STAT_VALUE = '(?:\\d+|X)/(?:\\d+|X)';
const VALUE = [
    STAT_VALUE + ' or ' + STAT_VALUE,
    STAT_VALUE,
    '\\d+',
    '(?:equal to |twice |1 plus )[^,.]+?(?= until\\b| and (?:it|they|its)\\b|[,.]|$)'
].join('|');
const ASSIGN_STATS = new RegExp(
    '^(?:' + OWNER_FIRST + '|' + PROPERTY_FIRST + ') (?:becomes?|is) '
        + '(?<value>' + VALUE + ')\\b', 'i'
);

export default class AssignStatsEffect extends Effect {
    static get pattern() {
        return ASSIGN_STATS;
    }

    parseArguments(match) {
        const { owner, ownerStats, stats, objects, value } = match.groups;
        this.stat = (ownerStats ?? stats).toLowerCase();
        this.owner = owner?.toLowerCase() ?? null;
        this.targets = objects ? this.parseNext(objects, [PhraseList]) : null;
        this.value = value;
    }

    get parts() {
        return [this.targets].filter(Boolean);
    }
}
