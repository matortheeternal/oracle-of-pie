import SelfShuffleEffect from './SelfShuffleEffect.js';
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
import DamageFormEffect from './DamageFormEffect.js';
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
import ActivationBanEffect from './ActivationBanEffect.js';
import CantEffect from './CantEffect.js';
import ChooseModesEffect from './ChooseModesEffect.js';
import ChooseValueEffect from './ChooseValueEffect.js';
import ChooseObjectsEffect from './ChooseObjectsEffect.js';
import EntersUnderOpponentControlEffect from './EntersUnderOpponentControlEffect.js';
import EntersTappedEffect from './EntersTappedEffect.js';
import PayManaEffect from './PayManaEffect.js';
import PayLifeEffect from './PayLifeEffect.js';
import PlayerCountersEffect from './PlayerCountersEffect.js';
import RevealHandEffect from './RevealHandEffect.js';
import DigUntilEffect from './DigUntilEffect.js';
import AttachEffect from './AttachEffect.js';
import ExtraLandEffect from './ExtraLandEffect.js';
import PlayCardsEffect from './PlayCardsEffect.js';
import CopyEffect from './CopyEffect.js';
import RollDieEffect from './RollDieEffect.js';
import CoinFlipEffect from './CoinFlipEffect.js';
import GameResultEffect from './GameResultEffect.js';
import HandSizeEffect from './HandSizeEffect.js';
import AdditionalTriggerEffect from './AdditionalTriggerEffect.js';
import CombatRequirementEffect from './CombatRequirementEffect.js';
import DoubleCountersEffect from './DoubleCountersEffect.js';
import DoublePowerEffect from './DoublePowerEffect.js';
import PreventDamageEffect from './PreventDamageEffect.js';
import RedirectDamageEffect from './RedirectDamageEffect.js';
import CostModificationEffect from './CostModificationEffect.js';
import DefinePTEffect from './DefinePTEffect.js';
import EntersAsCopyEffect from './EntersAsCopyEffect.js';
import CausativeEffect from './CausativeEffect.js';
import SpendManaEffect from './SpendManaEffect.js';
import CombatPermissionEffect from './CombatPermissionEffect.js';
import PhaseEffect from './PhaseEffect.js';
import BecomesEffect from './BecomesEffect.js';
import DamageModificationEffect from './DamageModificationEffect.js';
import DistributeCountersEffect from './DistributeCountersEffect.js';
import SetBasePTEffect from './SetBasePTEffect.js';
import TypeChangeEffect from './TypeChangeEffect.js';
import ManaRetentionEffect from './ManaRetentionEffect.js';
import AdditionalPhaseEffect from './AdditionalPhaseEffect.js';
import CounterModificationEffect from './CounterModificationEffect.js';
import BeginGameEffect from './BeginGameEffect.js';
import TuckEffect from './TuckEffect.js';
import OpaqueEffect from './OpaqueEffect.js';
import ShuffleIntoLibraryEffect from './ShuffleIntoLibraryEffect.js';
import MoveCountersEffect from './MoveCountersEffect.js';
import RemoveCountersEffect from './RemoveCountersEffect.js';
import EntersWithCountersEffect from './EntersWithCountersEffect.js';
import EndTurnOrCombatEffect from './EndTurnOrCombatEffect.js';
import ExtraTurnEffect from './ExtraTurnEffect.js';
import SetLifeTotalEffect from './SetLifeTotalEffect.js';

export const EFFECT_PARSERS = [
    SelfShuffleEffect,
    DigUntilEffect, TuckEffect, SearchLibraryEffect, GainControlEffect, GainLifeEffect,
    LoseLifeEffect, CounterEffect, LookAtTopEffect, DestroyEffect, ExileEffect,
    ReturnEffect, DrawEffect, DiscardEffect, DamageModificationEffect, DamageFormEffect,
    DamageEffect,
    ModifyPTEffect, HandSizeEffect, SetBasePTEffect,
    CausativeEffect, GrantEffect,
    CreateTokenEffect, PutCountersEffect, PutEffect, TapEffect, UntapEffect,
    SacrificeEffect, FightEffect, MillEffect, ShuffleIntoLibraryEffect,
    MoveCountersEffect, RemoveCountersEffect,
    KeywordActionEffect, AddManaEffect, CantEffect, ActivationBanEffect,
    EntersWithCountersEffect,
    ChooseModesEffect, ChooseValueEffect, ChooseObjectsEffect, EntersTappedEffect,
    EntersUnderOpponentControlEffect,
    PayManaEffect, PayLifeEffect, PlayerCountersEffect, RevealHandEffect, AttachEffect,
    ExtraLandEffect, PlayCardsEffect, CopyEffect, RollDieEffect, CoinFlipEffect,
    GameResultEffect, AdditionalTriggerEffect, CombatRequirementEffect,
    DoubleCountersEffect, DoublePowerEffect, PreventDamageEffect, RedirectDamageEffect,
    CostModificationEffect,
    DefinePTEffect,
    EntersAsCopyEffect, SpendManaEffect, CombatPermissionEffect, PhaseEffect,
    SetLifeTotalEffect, BecomesEffect, DistributeCountersEffect, TypeChangeEffect,
    ManaRetentionEffect,
    AdditionalPhaseEffect, CounterModificationEffect, BeginGameEffect,
    EndTurnOrCombatEffect, ExtraTurnEffect, OpaqueEffect
];

export {
    TuckEffect, SearchLibraryEffect, GainControlEffect, GainLifeEffect, LoseLifeEffect,
    CounterEffect, LookAtTopEffect, DestroyEffect, ExileEffect, ReturnEffect,
    DrawEffect, DiscardEffect, DamageEffect, DamageFormEffect, ModifyPTEffect,
    GrantEffect,
    CreateTokenEffect, PutCountersEffect, PutEffect, TapEffect, UntapEffect,
    SacrificeEffect, FightEffect, MillEffect, KeywordActionEffect, AddManaEffect,
    CantEffect, ActivationBanEffect,
    EntersWithCountersEffect, ShuffleIntoLibraryEffect,
    ChooseModesEffect, ChooseValueEffect, ChooseObjectsEffect, EntersTappedEffect,
    PayManaEffect, PayLifeEffect, PlayerCountersEffect, RevealHandEffect,
    DigUntilEffect, AttachEffect,
    ExtraLandEffect, PlayCardsEffect, CopyEffect, RollDieEffect, CoinFlipEffect,
    GameResultEffect, AdditionalTriggerEffect, CombatRequirementEffect,
    DoubleCountersEffect, DoublePowerEffect, PreventDamageEffect, RedirectDamageEffect,
    CostModificationEffect,
    DefinePTEffect,
    EntersAsCopyEffect, SpendManaEffect, CombatPermissionEffect, PhaseEffect,
    SetLifeTotalEffect, BecomesEffect, DistributeCountersEffect, TypeChangeEffect,
    ManaRetentionEffect,
    AdditionalPhaseEffect, CounterModificationEffect, BeginGameEffect,
    EndTurnOrCombatEffect, ExtraTurnEffect, OpaqueEffect
};
