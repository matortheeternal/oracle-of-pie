import Effect from './Effect.js';

const MANA_LOSS = new RegExp(
    '^a player losing unspent mana causes that player to lose that much life\\b', 'i'
);

export default class ManaLossAsLifeLossEffect extends Effect {
    static get pattern() {
        return MANA_LOSS;
    }
}
