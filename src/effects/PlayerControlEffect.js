import Effect from './Effect.js';

const PLAYER_CONTROL = new RegExp(
    '^control (?<player>target opponent|your opponents) '
    + '(?<window>during their next turn|while they\'re searching their libraries)\\b', 'i'
);

export default class PlayerControlEffect extends Effect {
    static get pattern() {
        return PLAYER_CONTROL;
    }

    parseArguments(match) {
        this.player = match.groups.player.toLowerCase();
        this.window = match.groups.window.toLowerCase();
    }
}
