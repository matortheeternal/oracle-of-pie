const SOURCE_TEXT = { granted: false, expansion: null, parentEffect: null };
const COUNTERED_THIS_WAY = /^if that spell is countered this way$/i;
const INSTEAD_OF_GRAVEYARD = /^instead of putting it into its owner's graveyard$/i;
const KICKED_THIS_SPELL = /^if this spell was kicked$/i;
const REPLACEMENT_TAIL = /^instead$/i;

export const REPLACEMENT_TAGS = [
    {
        tag: 'self-replacement-effect',
        match: {
            context: SOURCE_TEXT,
            any: [
                {
                    kind: 'ExileEffect',
                    manner: INSTEAD_OF_GRAVEYARD,
                    context: {
                        sentence: {
                            kind: 'ConditionalSentence',
                            condition: COUNTERED_THIS_WAY,
                            antecedentEffects: { kind: 'CounterEffect' }
                        }
                    }
                },
                {
                    kind: 'ModifyPTEffect',
                    context: {
                        ability: { kind: 'SpellAbility' },
                        sentence: {
                            kind: 'ConditionalSentence',
                            condition: KICKED_THIS_SPELL,
                            antecedentEffects: { kind: 'ModifyPTEffect' },
                            trailingCondition: { text: REPLACEMENT_TAIL }
                        }
                    }
                }
            ]
        }
    },
    {
        tag: 'damage-redirection',
        match: {
            context: SOURCE_TEXT,
            any: [
                { kind: 'RedirectDamageEffect' },
                {
                    kind: 'DamageEffect',
                    amountText: 'that much damage',
                    actingSubject: { refersToSelf: true },
                    context: {
                        sentence: {
                            kind: 'TriggerSentence',
                            events: {
                                kind: 'DamagePreventedEvent',
                                linksToPrevention: true
                            },
                            antecedentEffects: { kind: 'PreventDamageEffect' }
                        }
                    }
                }
            ]
        }
    }
];
