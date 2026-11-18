import Effect from './Effect.js';

export default class ObjectEffect extends Effect {
    parseArguments(match) {
        this.objects = this.consumeObjects();
    }

    get parts() {
        return [this.objects].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.objects);
    }

    get phrases() {
        return this.objects?.phrases ?? [];
    }

    get primaryObject() {
        return this.phrases[0] ?? null;
    }
}
