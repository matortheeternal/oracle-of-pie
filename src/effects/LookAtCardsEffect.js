import ObjectEffect from './ObjectEffect.js';

const LOOK_AT_KNOWN_CARDS = /^looks? at (?=(?:it|them|that card|those cards)\b)/i;
const CHOICES = [
    'face-down creatures (?:you don\'t control|your opponents control) any time',
    'the cards in (?:the other|each) pile',
    'cards exiled with (?:this [a-z]+|~)',
    'an additional \\w+ cards each time you surveil',
    'the next card drafted by a player of your choice'
];
const LOOK_AT_GROUP = new RegExp(
    `^looks? at (?<group>${CHOICES.join('|')})\\b`, 'i'
);

export default class LookAtCardsEffect extends ObjectEffect {
    static get pattern() {
        return LOOK_AT_KNOWN_CARDS;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(LOOK_AT_GROUP);
    }

    parseArguments(match) {
        this.group = match.groups?.group ?? null;
        if (!this.group) super.parseArguments();
    }

    get isComplete() {
        return Boolean(this.group) || super.isComplete;
    }

    get isPlayerAction() {
        return true;
    }
}
