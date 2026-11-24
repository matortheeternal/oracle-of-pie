const GOAD = /"(?:GoadCreature|GoadEachCreature\w*|IsGoadedByPlayer)"/;
const PREPARE = /"(?:EntersPrepared|PreparePermanent|PrepareEachPermanent)"/;
const EXERT = /"(?:MayBeExerted\w*|ExertPermanent)"/;
const LOSE_ABILITIES = /"(?:LosesAllAbilities|AddAbilityAndLoseAllOtherAbilities)"/;
const REVEAL = /"(?:Reveal\w*|MayReveal\w*)"/;

export const MTGISH_CONCEPTS = [
    { name: 'goad', ours: node => node.state === 'goaded', theirs: GOAD },
    { name: 'prepare', ours: node => node.state === 'prepared', theirs: PREPARE },
    { name: 'exert', ours: node => node.action === 'exert', theirs: EXERT },
    {
        name: 'lose-abilities',
        ours: node => node.constructor.name === 'LoseAbilitiesEffect',
        theirs: LOSE_ABILITIES
    },
    {
        name: 'reveal',
        ours: node => node.constructor.name === 'RevealEffect',
        theirs: REVEAL
    }
];
