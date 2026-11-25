import ObjectEffect from './ObjectEffect.js';

const CHOOSE = new RegExp(
    '^(?<secret>secretly )?chooses? (?!not\\b|new targets?\\b|a'
        + ' new target\\b|the same mode\\b)', 'i'
);
const SOURCE = /^from (?:it|among (?:them|those cards|creatures they control))\b/i;
const TO = /^to (?=(?:draw|create)\b)/i;

export default class ChooseObjectsEffect extends ObjectEffect {
    static get pattern() {
        return CHOOSE;
    }

    parseArguments(match) {
        this.isSecret = Boolean(match.groups.secret);
        this.source = this.consumeText(SOURCE)?.[0] ?? null;
        super.parseArguments();
        this.selectedAction = this.readSelectedAction();
    }

    readSelectedAction() {
        const recipient = this.primaryObject;
        if (!recipient?.isPlayer || !this.consumeText(TO)) return null;
        const effect = this.consume(this.scribe.effectParsers);
        if (effect) effect.inheritedSubject = recipient;
        return effect;
    }

    get parts() {
        return [...super.parts, this.selectedAction].filter(Boolean);
    }
}
