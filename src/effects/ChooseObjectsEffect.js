import ObjectEffect from './ObjectEffect.js';

const CHOOSE = new RegExp(
    '^(?<secret>secretly )?chooses? (?!not\\b|new targets?\\b|a'
        + ' new target\\b|the same mode\\b)', 'i'
);
const SOURCE = /^from (?:it|among (?:them|those cards|creatures they control))\b/i;

export default class ChooseObjectsEffect extends ObjectEffect {
    static get pattern() {
        return CHOOSE;
    }

    parseArguments(match) {
        this.isSecret = Boolean(match.groups.secret);
        this.source = this.consumeText(SOURCE)?.[0] ?? null;
        super.parseArguments();
    }
}
