const GOAD = /"(?:GoadCreature|GoadEachCreature\w*|IsGoadedByPlayer)"/;
const PREPARE = /"(?:EntersPrepared|PreparePermanent|PrepareEachPermanent)"/;
const EXERT = /"(?:MayBeExerted\w*|ExertPermanent)"/;
const LOSE_ABILITIES = /"(?:LosesAllAbilities|AddAbilityAndLoseAllOtherAbilities)"/;
const REVEAL = /"(?:Reveal\w*|MayReveal\w*)"/;
const DAY_NIGHT = /"(?:BecomeDay|BecomeNight|Daybound|Nightbound)"/;
const LOOK_AT_HAND = /"LookAtPlayersHand\w*"/;
const RETARGET_COPY = /"Copy\w*AndMayChooseNewTargets\w*"/;
const TAP_OR_UNTAP = /"TapOrUntap\w*"/;
const STATIC_CONTROL = /"SetController"/;
const PREVENTION_BAN = /"\w*DamageCantBePrevented"/;
const EXCESS_DAMAGE = /"\w*DealsDamageExcessReplacable"/;
const TYPE_LOSS = /"RemoveCardtype"/;
const COMMANDER = /"(?:IsACommander|IsYourCommander|\w*CastCommander\w*)"/;

const REVEAL_VERBS = new Set(['reveal', 'reveals']);

function isReveal(node) {
    const name = node.constructor.name;
    if (name === 'RevealEffect' || name === 'DigUntilEffect') return true;
    return name === 'LookAtTopEffect' && REVEAL_VERBS.has(node.verb);
}

function kind(name) {
    return node => node.constructor.name === name;
}

export const MTGISH_CONCEPTS = [
    { name: 'goad', ours: node => node.state === 'goaded', theirs: GOAD },
    { name: 'prepare', ours: node => node.state === 'prepared', theirs: PREPARE },
    { name: 'exert', ours: node => node.action === 'exert', theirs: EXERT },
    { name: 'lose-abilities', ours: kind('LoseAbilitiesEffect'), theirs: LOSE_ABILITIES },
    { name: 'reveal', ours: isReveal, theirs: REVEAL },
    { name: 'day-night', ours: kind('DayNightEffect'), theirs: DAY_NIGHT },
    { name: 'look-at-hand', ours: kind('LookAtHandEffect'), theirs: LOOK_AT_HAND },
    { name: 'retarget-copy', ours: kind('RetargetCopyEffect'), theirs: RETARGET_COPY },
    { name: 'tap-or-untap', ours: node => node.mayUntap === true, theirs: TAP_OR_UNTAP },
    { name: 'static-control', ours: kind('StaticControlEffect'), theirs: STATIC_CONTROL },
    { name: 'prevention-ban', ours: kind('PreventionBanEffect'), theirs: PREVENTION_BAN },
    { name: 'excess-damage', ours: kind('ExcessDamageEffect'), theirs: EXCESS_DAMAGE },
    { name: 'type-loss', ours: kind('TypeLossEffect'), theirs: TYPE_LOSS },
    { name: 'commander', ours: node => node.isCommanderGroup === true, theirs: COMMANDER }
];
