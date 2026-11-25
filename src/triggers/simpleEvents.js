import AbilityEvent from './AbilityEvent.js';
import CounterRemovalEvent from './CounterRemovalEvent.js';
import ThresholdEvent from './ThresholdEvent.js';
import SpentManaEvent from './SpentManaEvent.js';
import PhaseEvent from './PhaseEvent.js';
import CastEvent from './CastEvent.js';
import CopiesSpellEvent from './CopiesSpellEvent.js';
import FightsEvent from './FightsEvent.js';
import ScryPlacementEvent from './ScryPlacementEvent.js';
import SaddlesEvent from './SaddlesEvent.js';
import DiesEvent from './DiesEvent.js';
import EntersEvent from './EntersEvent.js';
import AttacksEvent from './AttacksEvent.js';
import DealsDamageEvent from './DealsDamageEvent.js';
import TargetedEvent from './TargetedEvent.js';
import DamagePreventedEvent from './DamagePreventedEvent.js';
import DrawsEvent from './DrawsEvent.js';
import GainsLifeEvent from './GainsLifeEvent.js';
import LosesLifeEvent from './LosesLifeEvent.js';
import CyclesEvent from './CyclesEvent.js';
import SacrificesEvent from './SacrificesEvent.js';
import DiscardsEvent from './DiscardsEvent.js';
import ScryEvent from './ScryEvent.js';
import SurveilEvent from './SurveilEvent.js';
import BecomesTappedEvent from './BecomesTappedEvent.js';
import BlocksEvent from './BlocksEvent.js';
import BecomesBlockedEvent from './BecomesBlockedEvent.js';
import IsDealtDamageEvent from './IsDealtDamageEvent.js';
import LeavesEvent from './LeavesEvent.js';
import MutatesEvent from './MutatesEvent.js';
import CommitsCrimeEvent from './CommitsCrimeEvent.js';
import TurnsFaceUpEvent from './TurnsFaceUpEvent.js';
import ExploitsEvent from './ExploitsEvent.js';
import UnlocksRoomEvent from './UnlocksRoomEvent.js';
import ExpendsEvent from './ExpendsEvent.js';
import CountersPutEvent from './CountersPutEvent.js';
import TransformsEvent from './TransformsEvent.js';
import PutIntoZoneEvent from './PutIntoZoneEvent.js';
import ActivatesEvent from './ActivatesEvent.js';
import PlacesCountersEvent from './PlacesCountersEvent.js';
import DayNightEvent from './DayNightEvent.js';
import ClassLevelEvent from './ClassLevelEvent.js';
import FacesDilemmaEvent from './FacesDilemmaEvent.js';
import RollsDiceEvent from './RollsDiceEvent.js';
import ProliferatesEvent from './ProliferatesEvent.js';
import RingTemptsEvent from './RingTemptsEvent.js';
import ExertsEvent from './ExertsEvent.js';
import ExploresEvent from './ExploresEvent.js';
import GetsEnergyEvent from './GetsEnergyEvent.js';
import TapsEvent from './TapsEvent.js';
import TappedForManaEvent from './TappedForManaEvent.js';
import BecomesStatusEvent from './BecomesStatusEvent.js';
import BecomesMonstrousEvent from './BecomesMonstrousEvent.js';
import BecomesAttachedEvent from './BecomesAttachedEvent.js';
import CrewsEvent from './CrewsEvent.js';
import BecomesPlottedEvent from './BecomesPlottedEvent.js';
import ConnivesEvent from './ConnivesEvent.js';
import BecomesUntappedEvent from './BecomesUntappedEvent.js';
import MilledEvent from './MilledEvent.js';
import CompletesDungeonEvent from './CompletesDungeonEvent.js';
import RecordedActionEvent from './RecordedActionEvent.js';

export const SIMPLE_EVENTS = [
    PhaseEvent, SpentManaEvent, AbilityEvent, CastEvent, CopiesSpellEvent, EntersEvent,
    AttacksEvent, DiesEvent, DealsDamageEvent,
    TargetedEvent, DamagePreventedEvent,
    DrawsEvent, GainsLifeEvent, LosesLifeEvent,
    CyclesEvent, SacrificesEvent, DiscardsEvent, ScryPlacementEvent, ScryEvent,
    SurveilEvent,
    BecomesTappedEvent, FightsEvent, BlocksEvent, BecomesBlockedEvent,
    IsDealtDamageEvent, LeavesEvent, MutatesEvent,
    CommitsCrimeEvent, TurnsFaceUpEvent, ExploitsEvent, UnlocksRoomEvent, ExpendsEvent,
    CountersPutEvent, TransformsEvent,
    PutIntoZoneEvent, ActivatesEvent, PlacesCountersEvent, DayNightEvent, ClassLevelEvent,
    FacesDilemmaEvent, RollsDiceEvent, ProliferatesEvent, RingTemptsEvent, ExertsEvent,
    GetsEnergyEvent, TapsEvent, TappedForManaEvent,
    BecomesStatusEvent, BecomesMonstrousEvent, BecomesAttachedEvent, BecomesPlottedEvent,
    CrewsEvent, SaddlesEvent, ExploresEvent, ConnivesEvent, BecomesUntappedEvent,
    MilledEvent,
    CompletesDungeonEvent, CounterRemovalEvent, ThresholdEvent, RecordedActionEvent
];

export function readSimpleEvent(scribe, str) {
    let partial = null;
    for (const event of SIMPLE_EVENTS) {
        const match = event.match(scribe, str);
        if (!match) continue;
        const parsed = event.read(scribe, match, str);
        if (parsed.isRecognized) return parsed;
        partial ??= parsed;
    }
    return partial;
}
