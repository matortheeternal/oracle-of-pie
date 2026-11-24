export const CANON_TIERS = {
    'counterspell': {
        W: 'tertiary', U: 'primary', B: 'none', R: 'none', G: 'none'
    },
    'counter-ability': {
        W: 'tertiary', U: 'primary', B: 'none', R: 'none', G: 'tertiary'
    },
    'destroy-creature': {
        W: 'secondary', U: 'none', B: 'primary', R: 'none', G: 'none'
    },
    'exile-creature': {
        W: 'primary', U: 'tertiary', B: 'primary', R: 'none', G: 'none'
    },
    'bounce-creature': {
        W: 'none', U: 'primary', B: 'none', R: 'none', G: 'none'
    },
    'edict': {
        W: 'none', U: 'none', B: 'primary', R: 'tertiary', G: 'none'
    },
    'shrink-creature': {
        W: 'none', U: 'none', B: 'primary', R: 'none', G: 'none'
    },
    'destroy-artifact': {
        W: 'primary', U: 'tertiary', B: 'none', R: 'primary', G: 'primary'
    },
    'destroy-enchantment': {
        W: 'primary', U: 'none', B: 'tertiary', R: 'none', G: 'primary'
    },
    'damage-creature': {
        W: 'tertiary', U: 'none', B: 'tertiary', R: 'primary', G: 'none'
    },
    'damage-player': {
        W: 'none', U: 'none', B: 'secondary', R: 'primary', G: 'none'
    },
    'bite': {
        W: 'none', U: 'none', B: 'none', R: 'secondary', G: 'primary'
    },
    'fight': {
        W: 'none', U: 'none', B: 'none', R: 'secondary', G: 'primary'
    },
    'discard-opponent': {
        W: 'none', U: 'none', B: 'primary', R: 'none', G: 'none'
    },
    'mill-opponent': {
        W: 'none', U: 'primary', B: 'secondary', R: 'none', G: 'tertiary'
    },
    'tutor-nonland': {
        W: 'primary', U: 'primary', B: 'primary', R: 'secondary', G: 'secondary'
    },
    'land-ramp': {
        W: 'secondary', U: 'none', B: 'none', R: 'secondary', G: 'primary'
    },
    'reanimate': {
        W: 'secondary', U: 'none', B: 'primary', R: 'none', G: 'none'
    },
    'regrowth': {
        W: 'tertiary', U: 'none', B: 'primary', R: 'none', G: 'secondary'
    },
    'tap-creature': {
        W: 'primary', U: 'primary', B: 'none', R: 'none', G: 'none'
    },
    'steal-permanently': {
        W: 'none', U: 'primary', B: 'tertiary', R: 'secondary', G: 'none'
    },
    'threaten': {
        W: 'none', U: 'none', B: 'none', R: 'primary', G: 'none'
    },
    'flicker': {
        W: 'primary', U: 'primary', B: 'none', R: 'none', G: 'none'
    },
    'gain-life': {
        W: 'primary', U: 'none', B: 'primary', R: 'none', G: 'primary'
    },
    'draw-cards': {
        W: 'secondary', U: 'primary', B: 'secondary', R: 'secondary', G: 'secondary'
    },
    'loot': {
        W: 'tertiary', U: 'primary', B: 'secondary', R: 'none', G: 'none'
    },
    'rummage': {
        W: 'none', U: 'tertiary', B: 'none', R: 'primary', G: 'none'
    },
    'discard-outlet': {
        W: 'tertiary', U: 'primary', B: 'secondary', R: 'primary', G: 'tertiary'
    },
    'mill-self': {
        W: 'none', U: 'secondary', B: 'primary', R: 'tertiary', G: 'primary'
    },
    'unblockable': {
        W: 'none', U: 'primary', B: 'tertiary', R: 'none', G: 'none'
    },
    'firebreathing': {
        W: 'tertiary', U: 'none', B: 'secondary', R: 'primary', G: 'none'
    },
    'shade-pump': {
        W: 'secondary', U: 'none', B: 'primary', R: 'tertiary', G: 'primary'
    },
    'extra-combat-phase': {
        W: 'none', U: 'none', B: 'none', R: 'primary', G: 'none'
    },
    'mana-dork': {
        W: 'none', U: 'secondary', B: 'tertiary', R: 'secondary', G: 'primary'
    },
    'extra-untap': {
        W: 'none', U: 'tertiary', B: 'none', R: 'none', G: 'primary'
    },
    'freeze-creature': {
        W: 'secondary', U: 'primary', B: 'none', R: 'none', G: 'none'
    },
    'drain-life': {
        W: 'none', U: 'none', B: 'primary', R: 'none', G: 'none'
    },
    'cost-increaser': {
        W: 'primary', U: 'none', B: 'none', R: 'none', G: 'none'
    },
    'keyword-flying': {
        W: 'primary', U: 'primary', B: 'primary', R: 'secondary', G: 'tertiary'
    },
    'keyword-first-strike': {
        W: 'primary', U: 'none', B: 'tertiary', R: 'primary', G: 'none'
    },
    'keyword-double-strike': {
        W: 'primary', U: 'none', B: 'none', R: 'primary', G: 'none'
    },
    'keyword-deathtouch': {
        W: 'none', U: 'none', B: 'primary', R: 'none', G: 'secondary'
    },
    'keyword-haste': {
        W: 'none', U: 'none', B: 'tertiary', R: 'primary', G: 'secondary'
    },
    'keyword-hexproof': {
        W: 'primary', U: 'primary', B: 'tertiary', R: 'none', G: 'primary'
    },
    'keyword-indestructible': {
        W: 'primary', U: 'tertiary', B: 'primary', R: 'tertiary', G: 'secondary'
    },
    'keyword-lifelink': {
        W: 'primary', U: 'none', B: 'primary', R: 'none', G: 'none'
    },
    'keyword-menace': {
        W: 'none', U: 'none', B: 'primary', R: 'primary', G: 'none'
    },
    'keyword-reach': {
        W: 'tertiary', U: 'tertiary', B: 'none', R: 'secondary', G: 'primary'
    },
    'keyword-trample': {
        W: 'none', U: 'none', B: 'tertiary', R: 'primary', G: 'primary'
    },
    'keyword-vigilance': {
        W: 'primary', U: 'secondary', B: 'none', R: 'none', G: 'primary'
    },
    'keyword-defender': {
        W: 'secondary', U: 'primary', B: 'secondary', R: 'secondary', G: 'secondary'
    },
    'keyword-flash': {
        W: 'primary', U: 'primary', B: 'secondary', R: 'secondary', G: 'secondary'
    },
    'keyword-ward': {
        W: 'secondary', U: 'primary', B: 'none', R: 'none', G: 'primary'
    },
    'keyword-prowess': {
        W: 'tertiary', U: 'primary', B: 'none', R: 'primary', G: 'none'
    }
};
