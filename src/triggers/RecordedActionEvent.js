import ActionEvent from './ActionEvent.js';
import ThisWay from './qualifiers/ThisWay.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import ZoneOrigin from './qualifiers/ZoneOrigin.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const ACTIONS = {
    'exiles?(?= (?:a|an|the|target|it|them|one) )': 'exile',
    '(?:is|are) exiled': 'exile',
    'creates?': 'create-token',
    'reveals?': 'reveal',
    'plays?': 'play',
    'foretells?': 'foretell',
    'copies?': 'copy',
    'investigates?': 'investigate',
    'forages?': 'forage',
    'manifests? dread': 'manifest-dread',
    'discovers?': 'discover',
    'waterbends?': 'waterbend',
    'untaps?': 'untap',
    'phases? (?<phaseDirection>in|out)': 'phase',
    'finish(?:es)? voting': 'finish-voting',
    'puts?(?= .+ onto the battlefield this way)': 'put-onto-battlefield',
    'loses? (?:a coin flip|the flip)': 'lose-coin-flip',
    'gains? control of': 'gain-control',
    '(?:is|are) attacked': 'is-attacked',
    '(?:is|are) sacrificed or destroyed': 'is-sacrificed-or-destroyed',
    '(?:is|are) drawn': 'is-drawn',
    'chooses? a creature as your Ring-bearer': 'choose-ring-bearer',
    'mills?': 'mill',
    'enlists?': 'enlist',
    'mentors?': 'mentor',
    'evolves?': 'evolve',
    'trains?': 'train',
    'exploits?': 'exploit',
    'solves?': 'solve-case',
    'collects? evidence': 'collect-evidence',
    'gives? a gift': 'give-gift',
    'wins? (?:a coin flip|the flip)': 'win-coin-flip',
    'wins? a clash': 'win-clash',
    'loses? the game': 'lose-game',
    'loses? control of': 'lose-control',
    'searches?': 'search',
    'counters?(?= (?:a|an|target|another) )': 'counter',
    'pays? life': 'pay-life',
    'pays? this cost': 'pay-cost',
    'turns?(?= .+ face up)': 'turn-face-up',
    '(?:is|are) returned to (?:hand|its owner\'s hand)': 'return-to-hand',
    '(?:is|are) cast': 'cast'
};
const ACTION_CHOICES = Object.keys(ACTIONS).map(
    (wording, i) => `(?<action${i}>${wording})`
);
const ACTION_EVENT = new RegExp(
    `^(?<subject>.+?) (?:${ACTION_CHOICES.join('|')})\\b`, 'i'
);
const END_OF_OBJECT = /^(?:face up|this way)\b/i;
const COUNT = new RegExp(`^${NUMBER_PATTERN} or more times\\b`, 'i');
const SEARCH_LIBRARY = /^(?:their|your|that player's) library\b/i;
const FACE_UP = /^face up\b/i;
const BATTLEFIELD = /^onto the battlefield\b/i;
const PREVIOUS_CONTROLLER = /^from you\b/i;

function actionOf(groups) {
    const index = ACTION_CHOICES.findIndex((_, i) => groups[`action${i}`]);
    return Object.values(ACTIONS)[index];
}

export default class RecordedActionEvent extends ActionEvent {
    static get pattern() {
        return ACTION_EVENT;
    }

    static get qualifierParsers() {
        return [ThisWay, FirstTime, TurnWindow, ZoneOrigin];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.action = actionOf(match.groups);
        this.phaseDirection = match.groups.phaseDirection?.toLowerCase() ?? null;
        this.threshold = this.action === 'pay-cost' ? this.consumeText(COUNT)?.[0] : null;
    }

    get objectText() {
        if (END_OF_OBJECT.test(this.remainingStr)) return null;
        return this.remainingStr;
    }

    parseObjectPhrase() {
        if (this.action === 'search') {
            this.library = this.consumeText(SEARCH_LIBRARY)?.[0] ?? null;
            return null;
        }
        if (!this.objectText) return null;
        const phrase = super.parseObjectPhrase();
        if (!phrase) return null;
        this.readObjectTail();
        return phrase;
    }

    readObjectTail() {
        const tails = {
            'turn-face-up': FACE_UP, 'put-onto-battlefield': BATTLEFIELD,
            'gain-control': PREVIOUS_CONTROLLER
        };
        const tail = tails[this.action];
        if (tail) this.consumeText(tail);
    }

    get isRepeatable() {
        if (this.isSelf || this.objectPhrase?.refersToSelf) return false;
        return this.action !== 'lose-game';
    }
}
