import Effect from './Effect.js';

const PLAYER_CONTROL = new RegExp(
    '^controls? (?<player>target opponent|your opponents|'
        + '(?:that|the first|the second) player) '
        + '(?<window>during (?:their|the (?:first|second) player\'s)'
        + ' next (?:turn|combat phase)'
        + '|while they\'re searching their libraries)\\b', 'i'
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
