const TYPECYCLING = /(?<type>[a-z]+(?: land)?)cycling/;

const EXPLORE_WORDING = /explores?/;
const CONNIVE_WORDING = /connives?/;
const AMASS_WORDING = /amass (?<type>[A-Z][a-z]+)/;
const DISCOVER_WORDING = /discovers?/;
const ENDURE_WORDING = /endures?/;
const GOAD_WORDING = /goad [^,.]+/;
const TRANSFORM_WORDING = /transform [^,.]+/;
const REGENERATE_WORDING = /regenerate [^,.]+/;
const SHUFFLE_WORDING = /shuffle(?: [^,.]*)?/;
const EXERT_WORDING = /exert [^,.]+/;
const SUSPECT_WORDING = /suspect [^,.]+/;
const BEHOLD_WORDING = /behold an? [^,.]+/;
const EMPOWER_WORDING = /empower [A-Z][a-z]+/;
const AIRBEND_WORDING = /airbend [^,.]+/;

export const DEFAULT_DEFINITIONS = {
    keywords: [
        {
            name: 'Battle cry',
            reminder: 'Whenever this creature attacks, each other attacking creature '
                + 'gets +1/+0 until end of turn.'
        },
        {
            name: 'Blitz',
            reminder: 'If you cast this spell for its blitz cost, it gains haste and '
                + '"When this creature dies, draw a card." Sacrifice it at the beginning '
                + 'of the next end step.'
        },
        {
            name: 'Cycling',
            reminder: '{parameter}, Discard this card: Draw a card.'
        },
        {
            name: 'Firebending',
            reminder: 'Whenever this creature attacks, add {parameter} {R}. This mana '
                + 'lasts until end of combat.'
        },
        {
            name: 'Gift',
            reminder: 'You may promise an opponent a gift as you cast this spell.'
        },
        {
            name: 'Typecycling',
            pattern: TYPECYCLING,
            reminder: '{parameter}, Discard this card: Search your library for a {type} '
                + 'card, reveal it, put it into your hand, then shuffle.'
        }
    ],
    actions: [
        { name: 'Scry' },
        { name: 'Surveil' },
        { name: 'Investigate', reminder: 'Create a Clue token.' },
        { name: 'Proliferate' },
        { name: 'Explore', pattern: EXPLORE_WORDING },
        {
            name: 'Connive',
            pattern: CONNIVE_WORDING,
            reminder: 'Draw a card, then discard a card. If you discarded a nonland '
                + 'card, put a +1/+1 counter on this creature.'
        },
        { name: 'Populate' },
        { name: 'Learn' },
        {
            name: 'Amass',
            pattern: AMASS_WORDING,
            reminder: 'Put {parameter} +1/+1 counters on an Army you control. '
                + 'If you don\'t control one, create a 0/0 Army creature token first.'
        },
        { name: 'Adapt' },
        { name: 'Bolster' },
        { name: 'Support' },
        { name: 'Incubate' },
        {
            name: 'Discover',
            pattern: DISCOVER_WORDING,
            findsRandomCard: true,
            reminder: 'Exile cards from the top of your library until you exile a '
                + 'nonland card with mana value {parameter} or less. Cast it without '
                + 'paying its mana cost or put it into your hand. Put the rest on the '
                + 'bottom of your library in a random order.'
        },
        { name: 'Seek' },
        { name: 'Endure', pattern: ENDURE_WORDING },
        { name: 'Manifest dread' },
        { name: 'Manifest' },
        { name: 'Venture into the dungeon' },
        { name: 'The Ring tempts you' },
        { name: 'Become the monarch' },
        { name: 'Take the initiative' },
        { name: 'Goad', pattern: GOAD_WORDING },
        { name: 'Transform', pattern: TRANSFORM_WORDING },
        { name: 'Regenerate', pattern: REGENERATE_WORDING },
        { name: 'Shuffle', pattern: SHUFFLE_WORDING },
        { name: 'Time travel' },
        { name: 'Forage' },
        { name: 'Collect evidence' },
        { name: 'Exert', pattern: EXERT_WORDING },
        { name: 'Suspect', pattern: SUSPECT_WORDING },
        { name: 'Earthbend' },
        { name: 'Monstrosity' },
        { name: 'Blight' },
        { name: 'Behold', pattern: BEHOLD_WORDING },
        {
            name: 'Recruit',
            reminder: 'Draw a card, then discard a card. If you discarded a nonland '
                + 'card, create a 1/1 white Human Soldier creature token.'
        },
        { name: 'Empower', pattern: EMPOWER_WORDING },
        { name: 'Airbend', pattern: AIRBEND_WORDING }
    ],
    tokens: [
        {
            name: 'Clue',
            typeLine: 'Token Artifact — Clue',
            reminder: '{2}, Sacrifice this token: Draw a card.'
        },
        {
            name: 'Food',
            typeLine: 'Token Artifact — Food',
            reminder: '{2}, {T}, Sacrifice this token: You gain 3 life.'
        },
        {
            name: 'Treasure',
            typeLine: 'Token Artifact — Treasure',
            reminder: '{T}, Sacrifice this token: Add one mana of any color.'
        },
        {
            name: 'Powerstone',
            typeLine: 'Token Artifact — Powerstone',
            reminder: '{T}: Add {C}. This mana can\'t be spent to cast a '
                + 'nonartifact spell.'
        },
        {
            name: 'Gold',
            typeLine: 'Token Artifact — Gold',
            reminder: 'Sacrifice this token: Add one mana of any color.'
        },
        {
            name: 'Lander',
            typeLine: 'Token Artifact — Lander',
            reminder: '{2}, {T}, Sacrifice this token: Search your library for a basic '
                + 'land card, put it onto the battlefield tapped, then shuffle.'
        },
        {
            name: 'Blood',
            typeLine: 'Token Artifact — Blood',
            reminder: '{1}, {T}, Discard a card, Sacrifice this token: Draw a card.'
        }
    ]
};
