import BodyAbility from './BodyAbility.js';
import ModeOption from './ModeOption.js';

const MODE_START = '(?:• |(?=\\+ ?\\{|(?:\\{P\\})+ — ))';
const MODE_COST = '(?:\\+ ?)?\\{[^}]+\\}(?:\\{[^}]+\\})* — ';
const MODE_NAME = `(?:([A-Z][\\w !,'’.?-]+?) — )?`;
const MODE = new RegExp(`^${MODE_START}${MODE_NAME}(?:${MODE_COST})?([\\s\\S]+)$`);

export default class ModeLine extends BodyAbility {
    static match(scribe, str) {
        return str.match(MODE);
    }

    parseBody(text) {
        this.option = this.parseNext(text, [ModeOption]);
        return super.parseBody(this.option ? '' : text);
    }

    get parts() {
        return this.option ? [this.option] : super.parts;
    }

    apply(abilities) {
        const owner = abilities.at(-1);
        if (!owner) return abilities.push(this);
        owner.addMode(this);
    }
}
