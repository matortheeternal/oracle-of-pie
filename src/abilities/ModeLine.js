import BodyAbility from './BodyAbility.js';

const MODE = /^• (?:([A-Z][\w ']+?) — )?(?:\+?\{[^}]+\}(?:\{[^}]+\})* — )?([\s\S]+)$/;

export default class ModeLine extends BodyAbility {
    static match(scribe, str) {
        return str.match(MODE);
    }

    apply(abilities) {
        const owner = abilities.at(-1);
        if (!owner) return abilities.push(this);
        owner.addMode(this);
    }
}
