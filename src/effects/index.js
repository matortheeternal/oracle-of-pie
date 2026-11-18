import SearchLibraryEffect from './SearchLibraryEffect.js';
import GainControlEffect from './GainControlEffect.js';
import GainLifeEffect from './GainLifeEffect.js';
import LoseLifeEffect from './LoseLifeEffect.js';
import CounterEffect from './CounterEffect.js';
import LookAtTopEffect from './LookAtTopEffect.js';
import DestroyEffect from './DestroyEffect.js';
import ExileEffect from './ExileEffect.js';
import ReturnEffect from './ReturnEffect.js';
import DrawEffect from './DrawEffect.js';
import DiscardEffect from './DiscardEffect.js';
import DamageEffect from './DamageEffect.js';
import ModifyPTEffect from './ModifyPTEffect.js';
import GrantEffect from './GrantEffect.js';
import CreateTokenEffect from './CreateTokenEffect.js';
import PutCountersEffect from './PutCountersEffect.js';
import PutEffect from './PutEffect.js';
import TapEffect from './TapEffect.js';
import UntapEffect from './UntapEffect.js';
import SacrificeEffect from './SacrificeEffect.js';
import FightEffect from './FightEffect.js';
import MillEffect from './MillEffect.js';
import KeywordActionEffect from './KeywordActionEffect.js';
import AddManaEffect from './AddManaEffect.js';
import CantEffect from './CantEffect.js';
import OpaqueEffect from './OpaqueEffect.js';

export const EFFECT_PARSERS = [
    SearchLibraryEffect, GainControlEffect, GainLifeEffect, LoseLifeEffect,
    CounterEffect, LookAtTopEffect, DestroyEffect, ExileEffect, ReturnEffect,
    DrawEffect, DiscardEffect, DamageEffect, ModifyPTEffect, GrantEffect,
    CreateTokenEffect, PutCountersEffect, PutEffect, TapEffect, UntapEffect,
    SacrificeEffect, FightEffect, MillEffect, KeywordActionEffect, AddManaEffect,
    CantEffect, OpaqueEffect
];

export {
    SearchLibraryEffect, GainControlEffect, GainLifeEffect, LoseLifeEffect,
    CounterEffect, LookAtTopEffect, DestroyEffect, ExileEffect, ReturnEffect,
    DrawEffect, DiscardEffect, DamageEffect, ModifyPTEffect, GrantEffect,
    CreateTokenEffect, PutCountersEffect, PutEffect, TapEffect, UntapEffect,
    SacrificeEffect, FightEffect, MillEffect, KeywordActionEffect, AddManaEffect,
    CantEffect, OpaqueEffect
};
