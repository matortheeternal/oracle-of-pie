# Color-pie inspections

The default registry contains 244 inspections. Each entry lists its built-in exceptions and the colors each one allows.
Color codes are W (white), U (blue), B (black), R (red), and G (green).

Flags use the modern color pie. A tertiary tier is a bend and a tier of none is
a break. The [project reference](reference.md#pie-inspections) explains how evidence,
tier overrides, and project configuration affect a flag.

## Implemented inspections

### Removal

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Counters spells | `counterspell` | — |
| Counters abilities | `counter-ability` | — |
| Destroys creatures | `destroy-creature` | Replaced by a random card for its controller (R; "Polymorph")<br>Replaced by a token for its controller (U)<br>Creatures with defender (R)<br>Creatures with flying (G; Destroy target creature with flying)<br>Attacking or blocking creatures (W; Destroy target attacking or blocking creature.) |
| Exiles creatures | `exile-creature` | Replaced by a random card for its controller (R; "Polymorph")<br>Replaced by a token for its controller (U)<br>Creatures with flying (G) |
| Returns creatures to hand | `bounce-creature` | — |
| Makes opponents sacrifice | `edict` | Creatures with flying (G; Destroy target creature with flying)<br>Attacking or blocking creatures (W; Destroy target attacking or blocking creature.) |
| Lowers toughness | `shrink-creature` | Creatures with flying (G; Destroy target creature with flying) |
| Removes artifacts | `destroy-artifact` | — |
| Removes enchantments | `destroy-enchantment` | — |

### Damage

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Deals direct damage to creatures | `damage-creature` | Redirected prevented damage (W; Damage redirection)<br>Creatures with flying (G)<br>Damage scaled by a creature's power or toughness (G)<br>Damage scaled by the number of creatures you control (W)<br>Attacking or blocking creatures (W; Deal N damage to target attacking or blocking creature.)<br>Tapped creatures (W) |
| Deals direct damage to players | `damage-player` | Redirected prevented damage (W; Damage redirection) |
| Creature deals damage equal to its power | `bite` | — |
| Fights | `fight` | — |

### Card flow

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Makes opponents discard | `discard-opponent` | Discarding paired with drawing (R; "Wheeling") |
| Searches the library for a nonland card | `tutor-nonland` | — |
| Draws cards | `draw-cards` | — |
| Draws, then discards | `loot` | — |
| Discards, then draws | `rummage` | — |

### Graveyard

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Mills opponents | `mill-opponent` | — |
| Returns creature cards from graveyard to battlefield | `reanimate` | — |
| Returns creature cards from graveyard to hand | `regrowth` | — |
| Mills yourself | `mill-self` | — |

### Mana & lands

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Puts lands from the library onto the battlefield | `land-ramp` | — |
| Creatures that tap for mana | `mana-dork` | Mana paid for by sacrificing another permanent (B, R; Mana production, temporary) |
| Untaps your permanents en masse | `extra-untap` | Untapping creatures for an additional combat (R; Extra attack)<br>Untapping creatures (W, U, G; Untapping creatures) |

### Control

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Taps opposing creatures | `tap-creature` | — |
| Gains control permanently | `steal-permanently` | — |
| Gains control until end of turn | `threaten` | — |
| Keeps creatures tapped | `freeze-creature` | — |

### Protection

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Exiles and returns creatures | `flicker` | — |

### Life

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Gains life | `gain-life` | — |
| Drains life | `drain-life` | — |

### Costs

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Discards your own cards | `discard-outlet` | — |
| Taxes spells | `cost-increaser` | — |

### Creatures & combat

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Can’t be blocked | `unblockable` | — |
| Pumps its own power | `firebreathing` | Power boosts bundled with unblockability (U) |
| Pumps itself +N/+N | `shade-pump` | — |
| Adds combat phases | `extra-combat-phase` | — |

### Keywords / Evergreen

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Flying | `keyword-flying` | — |
| First strike | `keyword-first-strike` | — |
| Double strike | `keyword-double-strike` | — |
| Deathtouch | `keyword-deathtouch` | — |
| Haste | `keyword-haste` | — |
| Hexproof | `keyword-hexproof` | — |
| Indestructible | `keyword-indestructible` | — |
| Lifelink | `keyword-lifelink` | — |
| Menace | `keyword-menace` | — |
| Reach | `keyword-reach` | — |
| Trample | `keyword-trample` | Demons (B) |
| Vigilance | `keyword-vigilance` | — |
| Defender | `keyword-defender` | — |
| Flash | `keyword-flash` | — |
| Ward | `keyword-ward` | Ward costs paid in life (R; Ward (for life))<br>Non-mana ward costs (B) |
| Prowess | `keyword-prowess` | — |

### Keywords / Returning

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Affinity | `keyword-affinity` | — |
| Afflict | `keyword-afflict` | — |
| Afterlife | `keyword-afterlife` | — |
| Aftermath | `keyword-aftermath` | — |
| Annihilator | `keyword-annihilator` | — |
| Ascend | `keyword-ascend` | — |
| Awaken | `keyword-awaken` | — |
| Banding | `keyword-banding` | — |
| Bargain | `keyword-bargain` | — |
| Basic landcycling | `keyword-basic-landcycling` | — |
| Battle cry | `keyword-battle-cry` | — |
| Bestow | `keyword-bestow` | — |
| Blitz | `keyword-blitz` | — |
| Bloodthirst | `keyword-bloodthirst` | — |
| Bushido | `keyword-bushido` | — |
| Buyback | `keyword-buyback` | — |
| Cascade | `keyword-cascade` | — |
| Casualty | `keyword-casualty` | — |
| Champion | `keyword-champion` | — |
| Changeling | `keyword-changeling` | — |
| Cipher | `keyword-cipher` | — |
| Compleated | `keyword-compleated` | — |
| Convoke | `keyword-convoke` | — |
| Crew | `keyword-crew` | — |
| Cumulative upkeep | `keyword-cumulative-upkeep` | — |
| Cycling | `keyword-cycling` | — |
| Dash | `keyword-dash` | — |
| Daybound | `keyword-daybound` | — |
| Delve | `keyword-delve` | — |
| Devoid | `keyword-devoid` | — |
| Devour | `keyword-devour` | — |
| Disguise | `keyword-disguise` | — |
| Disturb | `keyword-disturb` | — |
| Dredge | `keyword-dredge` | — |
| Echo | `keyword-echo` | — |
| Emerge | `keyword-emerge` | — |
| Enchant | `keyword-enchant` | — |
| Encore | `keyword-encore` | — |
| Enlist | `keyword-enlist` | — |
| Entwine | `keyword-entwine` | — |
| Equip | `keyword-equip` | — |
| Escalate | `keyword-escalate` | — |
| Escape | `keyword-escape` | — |
| Eternalize | `keyword-eternalize` | — |
| Evoke | `keyword-evoke` | — |
| Evolve | `keyword-evolve` | — |
| Exalted | `keyword-exalted` | — |
| Exploit | `keyword-exploit` | — |
| Extort | `keyword-extort` | — |
| Fabricate | `keyword-fabricate` | — |
| Fear | `keyword-fear` | — |
| Firebending | `keyword-firebending` | — |
| Flanking | `keyword-flanking` | — |
| Flashback | `keyword-flashback` | — |
| For mirrodin! | `keyword-for-mirrodin!` | — |
| Forestcycling | `keyword-forestcycling` | — |
| Forestwalk | `keyword-forestwalk` | — |
| Foretell | `keyword-foretell` | — |
| Fuse | `keyword-fuse` | — |
| Gift | `keyword-gift` | — |
| Gravestorm | `keyword-gravestorm` | — |
| Harmonize | `keyword-harmonize` | — |
| Hexproof from | `keyword-hexproof-from` | — |
| Hideaway | `keyword-hideaway` | — |
| Horsemanship | `keyword-horsemanship` | — |
| Improvise | `keyword-improvise` | — |
| Infect | `keyword-infect` | — |
| Ingest | `keyword-ingest` | — |
| Intimidate | `keyword-intimidate` | — |
| Islandcycling | `keyword-islandcycling` | — |
| Islandwalk | `keyword-islandwalk` | — |
| Job select | `keyword-job-select` | — |
| Jump-start | `keyword-jump-start` | — |
| Kicker | `keyword-kicker` | — |
| Level up | `keyword-level-up` | — |
| Living weapon | `keyword-living-weapon` | — |
| Madness | `keyword-madness` | — |
| Mayhem | `keyword-mayhem` | — |
| Megamorph | `keyword-megamorph` | — |
| Melee | `keyword-melee` | — |
| Mentor | `keyword-mentor` | — |
| Miracle | `keyword-miracle` | — |
| Mobilize | `keyword-mobilize` | — |
| Modular | `keyword-modular` | — |
| Morph | `keyword-morph` | — |
| Mountaincycling | `keyword-mountaincycling` | — |
| Mountainwalk | `keyword-mountainwalk` | — |
| Multikicker | `keyword-multikicker` | — |
| Mutate | `keyword-mutate` | — |
| Myriad | `keyword-myriad` | — |
| Nightbound | `keyword-nightbound` | — |
| Ninjutsu | `keyword-ninjutsu` | — |
| Offspring | `keyword-offspring` | — |
| Outlast | `keyword-outlast` | — |
| Overload | `keyword-overload` | — |
| Partner | `keyword-partner` | — |
| Partner with | `keyword-partner-with` | — |
| Persist | `keyword-persist` | — |
| Phasing | `keyword-phasing` | — |
| Plainscycling | `keyword-plainscycling` | — |
| Plainswalk | `keyword-plainswalk` | — |
| Plot | `keyword-plot` | — |
| Protection | `keyword-protection` | — |
| Prototype | `keyword-prototype` | — |
| Rampage | `keyword-rampage` | — |
| Rebound | `keyword-rebound` | — |
| Reconfigure | `keyword-reconfigure` | — |
| Reinforce | `keyword-reinforce` | — |
| Renown | `keyword-renown` | — |
| Replicate | `keyword-replicate` | — |
| Retrace | `keyword-retrace` | — |
| Riot | `keyword-riot` | — |
| Saddle | `keyword-saddle` | — |
| Scavenge | `keyword-scavenge` | — |
| Shadow | `keyword-shadow` | — |
| Shroud | `keyword-shroud` | — |
| Skulk | `keyword-skulk` | — |
| Soulbond | `keyword-soulbond` | — |
| Soulshift | `keyword-soulshift` | — |
| Spectacle | `keyword-spectacle` | — |
| Splice | `keyword-splice` | — |
| Split second | `keyword-split-second` | — |
| Squad | `keyword-squad` | — |
| Start your engines! | `keyword-start-your-engines!` | — |
| Station | `keyword-station` | — |
| Storm | `keyword-storm` | — |
| Suspend | `keyword-suspend` | — |
| Swampcycling | `keyword-swampcycling` | — |
| Swampwalk | `keyword-swampwalk` | — |
| Toxic | `keyword-toxic` | — |
| Training | `keyword-training` | — |
| Tribute | `keyword-tribute` | — |
| Umbra armor | `keyword-umbra-armor` | — |
| Undying | `keyword-undying` | — |
| Unearth | `keyword-unearth` | — |
| Unleash | `keyword-unleash` | — |
| Vanishing | `keyword-vanishing` | — |
| Web-slinging | `keyword-web-slinging` | — |
| Wither | `keyword-wither` | — |

### Keywords / Set mechanics

| Inspection | ID | Exceptions |
| --- | --- | --- |
| Amplify | `keyword-amplify` | — |
| Assist | `keyword-assist` | — |
| Aura swap | `keyword-aura-swap` | — |
| Backup | `keyword-backup` | — |
| Beam me up | `keyword-beam-me-up` | — |
| Choose a background | `keyword-choose-a-background` | — |
| Cleave | `keyword-cleave` | — |
| Commander ninjutsu | `keyword-commander-ninjutsu` | — |
| Conspire | `keyword-conspire` | — |
| Craft | `keyword-craft` | — |
| Decayed | `keyword-decayed` | — |
| Demonstrate | `keyword-demonstrate` | — |
| Desertwalk | `keyword-desertwalk` | — |
| Dethrone | `keyword-dethrone` | — |
| Doctor's companion | `keyword-doctor's-companion` | — |
| Double agenda | `keyword-double-agenda` | — |
| Embalm | `keyword-embalm` | — |
| Epic | `keyword-epic` | — |
| Fading | `keyword-fading` | — |
| Fortify | `keyword-fortify` | — |
| Freerunning | `keyword-freerunning` | — |
| Graft | `keyword-graft` | — |
| Halflingcycling | `keyword-halflingcycling` | — |
| Haunt | `keyword-haunt` | — |
| Hidden agenda | `keyword-hidden-agenda` | — |
| Impending | `keyword-impending` | — |
| Increment | `keyword-increment` | — |
| Legendary landwalk | `keyword-legendary-landwalk` | — |
| Living metal | `keyword-living-metal` | — |
| More than meets the eye | `keyword-more-than-meets-the-eye` | — |
| Nonbasic landwalk | `keyword-nonbasic-landwalk` | — |
| Paradigm | `keyword-paradigm` | — |
| Provoke | `keyword-provoke` | — |
| Prowl | `keyword-prowl` | — |
| Ravenous | `keyword-ravenous` | — |
| Read ahead | `keyword-read-ahead` | — |
| Recover | `keyword-recover` | — |
| Ripple | `keyword-ripple` | — |
| Slivercycling | `keyword-slivercycling` | — |
| Sneak | `keyword-sneak` | — |
| Spree | `keyword-spree` | — |
| Storied | `keyword-storied` | — |
| Sunburst | `keyword-sunburst` | — |
| Surge | `keyword-surge` | — |
| Teamwork | `keyword-teamwork` | — |
| Tiered | `keyword-tiered` | — |
| Transfigure | `keyword-transfigure` | — |
| Transmute | `keyword-transmute` | — |
| Undaunted | `keyword-undaunted` | — |
| Warp | `keyword-warp` | — |
| Wizardcycling | `keyword-wizardcycling` | — |

## Planned inspections

There are no additional named inspections on the current public roadmap.

One open policy question concerns Plasma Caster. The existing exile inspection flags
its red coin-flip exile as a break. Whether it should be a bend or receive an exception
is still under review.
