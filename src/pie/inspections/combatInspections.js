import tagInspection from './tagInspection.js';
import { allow } from '../conditions/index.js';
import { WITH_UNBLOCKABLE } from '../conditions/combatConditions.js';

export const COMBAT_INSPECTIONS = [
    tagInspection({
        id: 'unblockable',
        title: 'Can’t be blocked',
        cards: 'cards that make creatures unblockable',
        group: 'Creatures & combat',
        example: { typeLine: 'Creature', text: 'This creature can\'t be blocked.' },
        cites: 'Can\'t be blocked'
    }),
    tagInspection({
        id: 'firebreathing',
        title: 'Pumps its own power',
        cards: 'creatures that pump their own power',
        group: 'Creatures & combat',
        example: {
            typeLine: 'Creature',
            text: '{1}: This creature gets +1/+0 until end of turn.'
        },
        exceptions: [allow(WITH_UNBLOCKABLE, ['U'])],
        cites: '+N/+0 (on creatures)'
    }),
    tagInspection({
        id: 'shade-pump',
        title: 'Pumps itself +N/+N',
        cards: 'creatures that pump themselves +N/+N',
        group: 'Creatures & combat',
        example: {
            typeLine: 'Creature',
            text: '{1}: This creature gets +1/+1 until end of turn.'
        }
    }),
    tagInspection({
        id: 'extra-combat-phase',
        title: 'Adds combat phases',
        cards: 'cards that add combat phases',
        group: 'Creatures & combat',
        example: {
            typeLine: 'Sorcery',
            text: 'Untap all creatures that attacked this turn. After this main '
                + 'phase, there is an additional combat phase followed by an '
                + 'additional main phase.'
        }
    })
];
