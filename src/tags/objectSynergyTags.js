const SOURCE_TEXT = { granted: false, expansion: null };
const ARTIFACT = { hasExactType: 'artifact', allowsTypeAlone: 'artifact' };
const ARTIFACT_CREATURE = { hasTypeConjunction: 'artifact creature' };
const AURA = { hasSubtype: 'Aura' };

function eventSubject(object) {
    return {
        any: [
            { subjectPhrase: object },
            { subjectPhrase: { kind: 'SelfOrAnother', other: object } }
        ]
    };
}

function permanentTrigger(object) {
    return {
        kind: ['EntersEvent', 'DiesEvent'],
        isSelf: false,
        unreadSubject: null,
        ...eventSubject({
            kind: 'NounPhrase',
            ...object,
            controlledByYou: true,
            isCardInZone: false,
            not: { hasExactType: 'spell' }
        })
    };
}

function castTrigger(object) {
    return {
        kind: 'CastEvent',
        castsSelf: false,
        objectPhrase: { kind: 'CastSpell', controlledByYou: true, ...object },
        unreadObject: null
    };
}

function massBenefit(object) {
    return {
        kind: ['GrantEffect', 'ModifyPTEffect'],
        subject: { ...object, isMass: true, controlledByYou: true },
        any: [
            { kind: 'GrantEffect', isComplete: true },
            {
                kind: 'ModifyPTEffect',
                modifier: { any: [{ isPowerBoost: true }, { raisesToughness: true }] }
            }
        ]
    };
}

function spellDiscount(object) {
    return {
        kind: 'CostModificationEffect',
        reducesCost: true,
        modifiesSpellCost: true,
        subject: { ...object, hasExactType: 'spell', controlledByYou: true }
    };
}

function objectPayoffs(object, ...additionalPayoffs) {
    return {
        context: SOURCE_TEXT,
        any: [
            permanentTrigger(object),
            castTrigger(object),
            massBenefit(object),
            spellDiscount(object),
            ...additionalPayoffs
        ]
    };
}

export const OBJECT_SYNERGY_TAGS = [
    {
        tag: 'synergy-artifact',
        match: {
            any: [
                {
                    tag: 'artifactfall',
                    not: { events: eventSubject({ controlledByOpponent: true }) }
                },
                objectPayoffs(ARTIFACT)
            ]
        }
    },
    {
        tag: 'synergy-artifact-creature',
        match: objectPayoffs(ARTIFACT_CREATURE, {
            kind: 'SacrificeCost',
            isRecognized: true,
            phrases: ARTIFACT_CREATURE
        })
    },
    {
        tag: 'synergy-aura',
        match: objectPayoffs(AURA)
    }
];
