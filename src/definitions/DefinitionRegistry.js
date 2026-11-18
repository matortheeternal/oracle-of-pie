export default class DefinitionRegistry {
    constructor(definitionClass, familyClass = definitionClass) {
        this.definitionClass = definitionClass;
        this.familyClass = familyClass;
        this.byKey = new Map();
    }

    add(spec) {
        const definition = this.toDefinition(spec);
        this.byKey.set(definition.key, definition);
        return this;
    }

    toDefinition(spec) {
        if (spec instanceof this.definitionClass) return spec;
        const definitionClass = spec.pattern ? this.familyClass : this.definitionClass;
        return new definitionClass(spec);
    }

    addAll(specs) {
        for (const spec of specs) this.add(spec);
        return this;
    }

    get definitions() {
        return [...this.byKey.values()];
    }

    find(predicate) {
        return this.definitions.find(predicate) ?? null;
    }
}
