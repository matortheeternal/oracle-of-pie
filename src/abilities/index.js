import ModeLine from './ModeLine.js';
import StructureLine from './StructureLine.js';
import StationAbility from './StationAbility.js';
import ChapterAbility from './ChapterAbility.js';
import KeywordAbility from './KeywordAbility.js';
import TriggeredAbility from './TriggeredAbility.js';
import ActivatedAbility from './ActivatedAbility.js';
import AbilityWordAbility from './AbilityWordAbility.js';
import SpellAbility from './SpellAbility.js';

export const ABILITY_PARSERS = [
    ModeLine, StructureLine, StationAbility, ChapterAbility, KeywordAbility,
    AbilityWordAbility, TriggeredAbility, ActivatedAbility, SpellAbility
];

export const INNER_ABILITY_PARSERS = [
    KeywordAbility, TriggeredAbility, ActivatedAbility, SpellAbility
];
