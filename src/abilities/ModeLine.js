import BodyAbility from './BodyAbility.js';

const MODE_START = '(?:• |(?=\\+ ?\\{))';
const MODE_COST = '(?:\\+ ?)?\\{[^}]+\\}(?:\\{[^}]+\\})* — ';
const MODE_NAME = '(?:([A-Z][\\w \']+?) — )?';
const MODE = new RegExp(`^${MODE_START}${MODE_NAME}(?:${MODE_COST})?([\\s\\S]+)$`);

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
