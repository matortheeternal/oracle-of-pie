const SOURCE_TRIGGER = {
    kind: 'TriggeredAbility',
    context: { granted: false, expansion: null }
};
const READ_EVENT = { unreadSubject: null, unreadObject: null, unreadText: null };
const CREATURE = {
    kind: 'NounPhrase',
    isCardInZone: false,
    hasExactType: 'creature'
};
const CREATURE_ENTRANT = {
    kind: 'EntersEvent',
    ...READ_EVENT,
    isSelf: false,
    any: [
        { subjectPhrase: CREATURE },
        { subjectPhrase: { kind: 'SelfOrAnother', other: CREATURE } }
    ]
};
const PLAYER_COMBAT_DAMAGE = {
    kind: 'DealsDamageEvent',
    ...READ_EVENT,
    isSelf: true,
    isCombat: true,
    recipient: { player: ['a player', 'an opponent'] }
};

function payoff(effects) {
    return { sentences: { kind: ['EffectSentence', 'ConditionalSentence'], effects } };
}

export const TRIGGERED_PAYOFF_TAGS = [
    {
        tag: 'soul-warden-ability',
        match: {
            ...SOURCE_TRIGGER,
            events: CREATURE_ENTRANT,
            body: payoff({ kind: 'GainLifeEffect', subjectIsYou: true })
        }
    },
    {
        tag: 'specter-ability',
        match: {
            ...SOURCE_TRIGGER,
            events: PLAYER_COMBAT_DAMAGE,
            body: payoff({
                kind: 'DiscardEffect',
                isComplete: true,
                actingSubject: { player: 'that player' }
            })
        }
    },
    {
        tag: 'leaves-trigger-self',
        match: {
            ...SOURCE_TRIGGER,
            event: {
                kind: 'LeavesEvent',
                ...READ_EVENT,
                isFromBattlefield: true,
                isSelf: true
            }
        }
    },
    {
        tag: 'leaves-graveyard-trigger',
        match: {
            ...SOURCE_TRIGGER,
            events: {
                kind: 'LeavesEvent',
                ...READ_EVENT,
                isFromGraveyard: true,
                subjectPhrase: { hasExactType: 'card' }
            }
        }
    }
];
