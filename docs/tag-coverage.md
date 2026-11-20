# Scryfall tag coverage

Results for 305 evaluated tags on 17,836 modern printed cards (November 2026 corpus).
The evaluation includes parent tags implied by the Scryfall tag hierarchy.

TP is a suggestion Scryfall also assigns. FP is a suggestion absent from Scryfall, TN is
a tag neither system assigns, and FN is a Scryfall tag the library missed. Accuracy is
(TP + TN) / all cards. Recall is TP / (TP + FN). A dash means there are no Scryfall
positives for that tag. Accuracy can be high for rare tags because most cards are negatives.

Notes give examples of raw disagreements. An absent Scryfall label can reflect an omission
or a different tagging convention, so these examples are not review verdicts.

| Tag | TP | FP | TN | FN | Accuracy | Recall | Disagreement notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| activated-ability | 4569 | 20 | 12888 | 359 | 97.88% | 92.72% | Suggested only here, e.g. Dominarioes // Dominarioes (cont'd); Gowron, Eager for Battle. Scryfall only, e.g. Crown of Gondor; Mirrormind Crown |
| additional-cost | 222 | 0 | 17303 | 311 | 98.26% | 41.65% | Scryfall only, e.g. Battlewing Mystic; Rally the Galadhrim |
| alternate-win-condition | 22 | 0 | 17795 | 19 | 99.89% | 53.66% | Scryfall only, e.g. Strixhaven Stadium; Ezio Auditore da Firenze |
| alternative-cost | 645 | 0 | 17137 | 54 | 99.70% | 92.27% | Scryfall only, e.g. Security Rhox; Flare of Denial |
| anthem | 267 | 5 | 17525 | 39 | 99.75% | 87.25% | Suggested only here, e.g. Clamavus; Raggadragga, Goreguts Boss. Scryfall only, e.g. Nephilim Epochal; Deepchannel Duelist |
| attack-trigger | 1535 | 14 | 16158 | 129 | 99.20% | 92.25% | Suggested only here, e.g. Braulios of Pheres Band; Eternal of Harsh Truths. Scryfall only, e.g. Polygoyf; Flockchaser Phantom |
| attacking-matters | 432 | 9 | 16944 | 451 | 97.42% | 48.92% | Suggested only here, e.g. Acquired Mutation; Invisible Woman. Scryfall only, e.g. Thousand-Faced Shadow; Warrant // Warden |
| attacking-matters-self | 1076 | 13 | 16597 | 150 | 99.09% | 87.77% | Suggested only here, e.g. Cybermat; Danny Pink. Scryfall only, e.g. War Historian; Hurska Sweet-Tooth |
| auto-equip | 56 | 0 | 17774 | 6 | 99.97% | 90.32% | Scryfall only, e.g. Cryptic Coat; Sidequest: Play Blitzball // World Champion, Celestial Weapon |
| burn-any | 323 | 8 | 17475 | 30 | 99.79% | 91.50% | Suggested only here, e.g. Devils' Playground; Burn Down the House. Scryfall only, e.g. Chandra's Pyrohelix; Avacyn's Judgment |
| burn-creature | 1049 | 12 | 16697 | 78 | 99.50% | 93.08% | Suggested only here, e.g. Spinerock Tyrant; Devils' Playground. Scryfall only, e.g. Chandra's Pyrohelix; Parasitic Grasp |
| burn-planeswalker | 529 | 7 | 17260 | 40 | 99.74% | 92.97% | Suggested only here, e.g. Devils' Playground; Zurzoth, Chaos Rider. Scryfall only, e.g. Chandra's Pyrohelix; Avacyn's Judgment |
| burn-player | 763 | 14 | 16979 | 80 | 99.47% | 90.51% | Suggested only here, e.g. Devils' Playground; Burn Down the House. Scryfall only, e.g. Heated Argument; Refuse // Cooperate |
| burn-player-each | 15 | 1 | 17815 | 5 | 99.97% | 75.00% | Suggested only here, e.g. Wheel of Misfortune. Scryfall only, e.g. Roiling Vortex; Blim, Comedic Genius |
| burn-you | 51 | 5 | 17771 | 9 | 99.92% | 85.00% | Suggested only here, e.g. Form of the Dinosaur; Relic Robber. Scryfall only, e.g. Roiling Vortex; Rite of Belzenlok |
| burst-draw | 289 | 24 | 17389 | 134 | 99.11% | 68.32% | Suggested only here, e.g. Casey Jones, Vigilante; River Song. Scryfall only, e.g. Professor Hulk; Body of Knowledge |
| cantrip | 334 | 17 | 17410 | 75 | 99.48% | 81.66% | Suggested only here, e.g. Striding Shotcaller // Run the Play; Mosswood Dreadknight // Dread Whispers. Scryfall only, e.g. Craftwork Crusher; Hormagaunt Horde |
| cast-trigger-you | 766 | 0 | 16969 | 101 | 99.43% | 88.35% | Scryfall only, e.g. Ruric Thar, Biomagus; Prosper, Tome-Bound |
| cda-power | 113 | 0 | 17722 | 1 | 99.99% | 99.12% | Scryfall only, e.g. Lumbering Worldwagon |
| cda-toughness | 65 | 0 | 17771 | 0 | 100.00% | 100.00% |  |
| cheaper-than-mv | 406 | 0 | 16513 | 917 | 94.86% | 30.69% | Scryfall only, e.g. Obyra's Attendants // Desperate Parry; Consecrate // Consume |
| clone | 42 | 0 | 17790 | 4 | 99.98% | 91.30% | Scryfall only, e.g. Cursed Mirror; Callidus Assassin |
| coin-flip | 17 | 0 | 17817 | 2 | 99.99% | 89.47% | Scryfall only, e.g. Pokey, the Scallywagg; Yusri, Fortune's Flame |
| combat-ramp | 98 | 1 | 17657 | 80 | 99.55% | 55.06% | Suggested only here, e.g. Cityscape Leveler. Scryfall only, e.g. Initiate's Companion; Eivor, Wolf-Kissed |
| combat-trick | 378 | 13 | 17022 | 423 | 97.56% | 47.19% | Suggested only here, e.g. Hapatra's Mark; Time Lord Regeneration. Scryfall only, e.g. Archdruid's Charm; Lost in Memories |
| copy-spell | 89 | 1 | 17691 | 55 | 99.69% | 61.81% | Suggested only here, e.g. Way of the Cryomancer. Scryfall only, e.g. Gorion, Wise Mentor; Anhelo, the Painter |
| cost-increaser | 17 | 1 | 17810 | 8 | 99.95% | 68.00% | Suggested only here, e.g. Zero, Incorporeal Sensate. Scryfall only, e.g. Eidolon of Obstruction; Soul Partition |
| cost-reducer | 127 | 0 | 17610 | 99 | 99.44% | 56.19% | Scryfall only, e.g. Gonti, Canny Acquisitor; Flockchaser Phantom |
| cost-reducer-creature | 18 | 0 | 17786 | 32 | 99.82% | 36.00% | Scryfall only, e.g. Herald of Slaanesh; Baron Strucker, HYDRA Overlord |
| counter-doubler | 26 | 0 | 17780 | 30 | 99.83% | 46.43% | Scryfall only, e.g. Lily Bowen, Raging Grandma; Chief Miles O'Brien |
| counterspell | 233 | 0 | 17591 | 12 | 99.93% | 95.10% | Scryfall only, e.g. Commit // Memory; Aang, Swift Savior // Aang and La, Ocean's Fury |
| death-trigger | 826 | 6 | 16886 | 118 | 99.30% | 87.50% | Suggested only here, e.g. Angelic Destiny; Netherese Puzzle-Ward. Scryfall only, e.g. Kelsien, the Plague; Ravenloft Adventurer |
| death-trigger-self | 459 | 3 | 17319 | 55 | 99.67% | 89.30% | Suggested only here, e.g. Mantle of the Wolf; Oft-Nabbed Goat. Scryfall only, e.g. Doom Weaver; Expedition Diviner |
| deathtouch-counter | 5 | 0 | 17820 | 11 | 99.94% | 31.25% | Scryfall only, e.g. Crystalline Giant; Aragorn, Company Leader |
| decayed-counter | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| discard | 182 | 12 | 17586 | 56 | 99.62% | 76.47% | Suggested only here, e.g. Fervent Mastery; Raphael's Technique. Scryfall only, e.g. Torment of Scarabs; Saruman of Many Colors |
| discard-outlet | 677 | 12 | 17016 | 131 | 99.20% | 83.79% | Suggested only here, e.g. Captive Audience; Archon of Cruelty. Scryfall only, e.g. Rona, Sheoldred's Faithful; Gravitic Punch |
| double-strike-counter | 0 | 0 | 17829 | 7 | 99.96% | 0.00% | Scryfall only, e.g. Avenging Huntbonder; Indominus Rex, Alpha |
| drain-life | 234 | 0 | 17562 | 40 | 99.78% | 85.40% | Scryfall only, e.g. Joshua, Phoenix's Dominant // Phoenix, Warden of Fire; Dark Nourishment |
| draw | 2810 | 34 | 14797 | 195 | 98.72% | 93.51% | Suggested only here, e.g. River Song; Communal Brewing. Scryfall only, e.g. Crown of Gondor; Fealty to the Realm |
| draw-engine | 739 | 23 | 16627 | 447 | 97.36% | 62.31% | Suggested only here, e.g. Ruric Thar, Biomagus; Public Enemy. Scryfall only, e.g. Crown of Gondor; Fealty to the Realm |
| energy-generator | 121 | 0 | 17701 | 14 | 99.92% | 89.63% | Scryfall only, e.g. Wrath of the Skies; The Motherlode, Excavator |
| enters-in-company | 339 | 6 | 17436 | 55 | 99.66% | 86.04% | Suggested only here, e.g. Abdel Adrian, Gorion's Ward; Glitch Interpreter. Scryfall only, e.g. Thousand-Faced Shadow; Sin, Spira's Punishment |
| exalted-counter | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| exile-self | 894 | 4 | 16859 | 79 | 99.53% | 91.88% | Suggested only here, e.g. Energize; Crystal Fragments // Summon: Alexander. Scryfall only, e.g. Invasion of Tolvada // The Broken Sky; Conqueror's Galleon // Conqueror's Foothold |
| extra-combat-phase | 29 | 0 | 17805 | 2 | 99.99% | 93.55% | Scryfall only, e.g. Full Throttle; Raphael, Tag Team Tough |
| extra-untap | 38 | 5 | 17778 | 15 | 99.89% | 71.70% | Suggested only here, e.g. Xolatoyac, the Smiling Flood; Preston Garvey, Minuteman. Scryfall only, e.g. Shadow of the Second Sun; Cyclonus, the Saboteur // Cyclonus, Cybertronian Fighter |
| fetchland | 29 | 1 | 17805 | 1 | 99.99% | 96.67% | Suggested only here, e.g. Volatile Fault. Scryfall only, e.g. Field of Ruin |
| firebreathing | 68 | 0 | 17733 | 35 | 99.80% | 66.02% | Scryfall only, e.g. Cavalier of Flame; Ruby Collector |
| first-strike-counter | 0 | 0 | 17822 | 14 | 99.92% | 0.00% | Scryfall only, e.g. Crystalline Giant; Aragorn, Company Leader |
| flicker-creature | 98 | 1 | 17719 | 18 | 99.89% | 84.48% | Suggested only here, e.g. Morningtide's Light. Scryfall only, e.g. Fortune, Loyal Steed; Sword of Hearth and Home |
| flying-counter | 16 | 0 | 17801 | 19 | 99.89% | 45.71% | Scryfall only, e.g. Luminous Broodmoth; Ascent of the Worthy |
| fog | 5 | 0 | 17806 | 25 | 99.86% | 16.67% | Scryfall only, e.g. Selfless Squire; Teferi's Reproach |
| free-discard-outlet | 24 | 3 | 17805 | 4 | 99.96% | 85.71% | Suggested only here, e.g. Nezahal, Primal Tide; Page, Loose Leaf. Scryfall only, e.g. Pact Weapon; Murderer's Axe |
| freeze-artifact | 2 | 0 | 17827 | 7 | 99.96% | 22.22% | Scryfall only, e.g. Mechanozoa; Subcommander T'Pol |
| freeze-creature | 124 | 4 | 17697 | 11 | 99.92% | 91.85% | Suggested only here, e.g. The Watcher in the Water; Twisted Riddlekeeper. Scryfall only, e.g. Illithid Harvester // Plant Tadpoles; Wicked Slumber |
| french-vanilla | 430 | 10 | 17368 | 28 | 99.79% | 93.89% | Suggested only here, e.g. Winter, Cursed Rider; Mishra, Tamer of Mak Fawa. Scryfall only, e.g. Baneslayer Angel; Consulate Dreadnought |
| gains-afflict | 0 | 0 | 17834 | 2 | 99.99% | 0.00% | Scryfall only, e.g. Lazotep Sliver; Cyberman Patrol |
| gains-annihilator | 1 | 0 | 17834 | 1 | 99.99% | 50.00% | Scryfall only, e.g. Idol of False Gods |
| gains-banding | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Oddric, Lunar Marquis |
| gains-battle-cry | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gains-bushido | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gains-cascade | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gains-changeling | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Oddric, Lunar Marquis |
| gains-deathtouch | 48 | 3 | 17739 | 46 | 99.73% | 51.06% | Suggested only here, e.g. Shadow Stinger; Hunter's Axe. Scryfall only, e.g. Tyvar the Bellicose; Crossway Troublemakers |
| gains-defender | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Corrupted Shapeshifter |
| gains-dethrone | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gains-devoid | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Oddric, Lunar Marquis |
| gains-double-strike | 30 | 1 | 17759 | 46 | 99.74% | 39.47% | Suggested only here, e.g. Flaming Fist. Scryfall only, e.g. Tom Paris, Risk-Taker; Seifer Almasy |
| gains-exalted | 0 | 0 | 17834 | 2 | 99.99% | 0.00% | Scryfall only, e.g. Emissary of Soulfire; First Sliver's Chosen |
| gains-exploit | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Henry Wu, InGen Geneticist |
| gains-fear | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Oddric, Lunar Marquis |
| gains-firebending | 1 | 0 | 17834 | 1 | 99.99% | 50.00% | Scryfall only, e.g. Iroh, Dragon of the West |
| gains-first-strike | 49 | 0 | 17748 | 39 | 99.78% | 55.68% | Scryfall only, e.g. Greymond, Avacyn's Stalwart; Crystalline Giant |
| gains-flanking | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Oddric, Lunar Marquis |
| gains-flash | 6 | 0 | 17813 | 17 | 99.90% | 26.09% | Scryfall only, e.g. Blast-Furnace Hellkite; Molten Exhale |
| gains-flying | 142 | 2 | 17629 | 63 | 99.64% | 69.27% | Suggested only here, e.g. Lunarch Mantle; Dragonbroods' Relic. Scryfall only, e.g. Tom Paris, Risk-Taker; Borg Scout Sphere |
| gains-forestwalk | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gains-haste | 95 | 2 | 17630 | 109 | 99.38% | 46.57% | Suggested only here, e.g. Rootwire Amalgam; Grishnákh, Brash Instigator. Scryfall only, e.g. Soul of Eternity; Rory Williams |
| gains-hexproof | 30 | 2 | 17781 | 23 | 99.86% | 56.60% | Suggested only here, e.g. Giant's Amulet; Maze's Mantle. Scryfall only, e.g. Mondo Gecko; Crystalline Giant |
| gains-horsemanship | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Oddric, Lunar Marquis |
| gains-indestructible | 94 | 2 | 17706 | 34 | 99.80% | 73.44% | Suggested only here, e.g. Bloodsworn Squire // Bloodsworn Knight; Agent of the Shadow Thieves. Scryfall only, e.g. Tegan Jovanka; Captain America, Unbowed |
| gains-islandwalk | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Catch of the Day |
| gains-lifelink | 50 | 1 | 17735 | 50 | 99.71% | 50.00% | Suggested only here, e.g. Dragonbroods' Relic. Scryfall only, e.g. Crossway Troublemakers; Noble Banneret |
| gains-living-weapon | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gains-melee | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Depthshaker Titan |
| gains-menace | 47 | 0 | 17732 | 57 | 99.68% | 45.19% | Scryfall only, e.g. Mishra, Lost to Phyrexia; Doctor Doom, King of Latveria |
| gains-myriad | 0 | 0 | 17832 | 4 | 99.98% | 0.00% | Scryfall only, e.g. Cybermen Squadron; Ironwill Forger |
| gains-pp-counters | 1206 | 58 | 16245 | 327 | 97.84% | 78.67% | Suggested only here, e.g. Ornery Tumblewagg; Verdurous Gearhulk. Scryfall only, e.g. Siren Lookout; Orzhov Advokist |
| gains-protection | 2 | 1 | 17824 | 9 | 99.94% | 18.18% | Suggested only here, e.g. Haktos the Unscarred. Scryfall only, e.g. Gor Muldrak, Amphinologist; Lord of the Nazgûl |
| gains-prowess | 0 | 0 | 17834 | 2 | 99.99% | 0.00% | Scryfall only, e.g. Narset, Enlightened Exile; Triton Wavebreaker |
| gains-reach | 4 | 1 | 17819 | 12 | 99.93% | 25.00% | Suggested only here, e.g. Cactus Preserve. Scryfall only, e.g. Crystalline Giant; Indominus Rex, Alpha |
| gains-renown | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Aragorn, Hornburg Hero |
| gains-shadow | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gains-shroud | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Oddric, Lunar Marquis |
| gains-skulk | 0 | 0 | 17815 | 21 | 99.88% | 0.00% | Scryfall only, e.g. Sauron, the Dark Lord; MacCready, Lamplight Mayor |
| gains-split-second | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gains-suspend | 0 | 0 | 17834 | 2 | 99.99% | 0.00% | Scryfall only, e.g. Rory Williams; Sinister Concierge |
| gains-toxic | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Monument to Perfection |
| gains-training | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Warrior's Resolve |
| gains-trample | 46 | 2 | 17700 | 88 | 99.50% | 34.33% | Suggested only here, e.g. Earthbender Ascension; Hunter's Axe. Scryfall only, e.g. Keen-Eyed Curator; Mishra, Lost to Phyrexia |
| gains-umbra-armor | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gains-undying | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gains-vanishing | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Flesh Duplicate |
| gains-vigilance | 45 | 2 | 17733 | 56 | 99.67% | 44.55% | Suggested only here, e.g. Dovin's Automaton; God-Eternal Rhonas. Scryfall only, e.g. Tom Paris, Risk-Taker; Greymond, Avacyn's Stalwart |
| gains-ward | 4 | 1 | 17820 | 11 | 99.93% | 26.67% | Suggested only here, e.g. Minthara, Merciless Soul. Scryfall only, e.g. One, Borg Evolved; Catch of the Day |
| gains-wither | 0 | 0 | 17834 | 2 | 99.99% | 0.00% | Scryfall only, e.g. Massacre Girl, Known Killer; Oddric, Lunar Marquis |
| gives-affinity | 3 | 0 | 17826 | 7 | 99.96% | 30.00% | Scryfall only, e.g. Sokka, Swordmaster; Magnus the Red |
| gives-afflict | 4 | 0 | 17830 | 2 | 99.99% | 66.67% | Scryfall only, e.g. Tormentor's Helm; Simian Sling |
| gives-afterlife | 2 | 0 | 17834 | 0 | 100.00% | 100.00% |  |
| gives-annihilator | 3 | 0 | 17832 | 1 | 99.99% | 75.00% | Scryfall only, e.g. Flayer of Loyalties |
| gives-assist | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Yume, Chronicler of Valor |
| gives-banding | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-basic-landcycling | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-battle-cry | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-beam-me-up | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Scotty, Miracle Worker |
| gives-blitz | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-bloodthirst | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-bushido | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-cascade | 7 | 0 | 17821 | 8 | 99.96% | 46.67% | Scryfall only, e.g. Rain of Riches; Smoldering Stagecoach |
| gives-casualty | 1 | 0 | 17833 | 2 | 99.99% | 33.33% | Scryfall only, e.g. Anhelo, the Painter; Ashad, the Lone Cyberman |
| gives-changeling | 0 | 0 | 17827 | 9 | 99.95% | 0.00% | Scryfall only, e.g. Dominion Infiltration; Omo, Queen of Vesuva |
| gives-conspire | 2 | 0 | 17834 | 0 | 100.00% | 100.00% |  |
| gives-convoke | 7 | 0 | 17826 | 3 | 99.98% | 70.00% | Scryfall only, e.g. Flockchaser Phantom; Peri Brown |
| gives-cycling | 3 | 0 | 17833 | 0 | 100.00% | 100.00% |  |
| gives-deathtouch | 91 | 0 | 17707 | 38 | 99.79% | 70.54% | Scryfall only, e.g. Vraska Joins Up; Ghoulish Impetus |
| gives-decayed | 1 | 0 | 17833 | 2 | 99.99% | 33.33% | Scryfall only, e.g. Ghouls' Night Out; Rot-Curse Rakshasa |
| gives-defender | 2 | 0 | 17830 | 4 | 99.98% | 33.33% | Scryfall only, e.g. Stasis Field; Deep Freeze |
| gives-delve | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-demonstrate | 1 | 0 | 17833 | 2 | 99.99% | 33.33% | Scryfall only, e.g. The Twelfth Doctor; Elda, Conjurer of Spectacle |
| gives-dethrone | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-devoid | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Oddric, Lunar Marquis |
| gives-devour | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-disguise | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-double-strike | 78 | 2 | 17728 | 28 | 99.83% | 73.58% | Suggested only here, e.g. Valiant Knight; Veteran Cathar. Scryfall only, e.g. Blast-Furnace Hellkite; Kayla's Command |
| gives-dredge | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-echo | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-embalm | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-emerge | 1 | 0 | 17834 | 1 | 99.99% | 50.00% | Scryfall only, e.g. "Zekes, Acid Rock Fan" |
| gives-encore | 4 | 0 | 17832 | 0 | 100.00% | 100.00% |  |
| gives-escape | 4 | 0 | 17830 | 2 | 99.99% | 66.67% | Scryfall only, e.g. The Grim Captain's Locker; Desdemona, Freedom's Edge |
| gives-evoke | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-evolve | 2 | 0 | 17834 | 0 | 100.00% | 100.00% |  |
| gives-exalted | 6 | 0 | 17829 | 1 | 99.99% | 85.71% | Scryfall only, e.g. Emissary of Soulfire |
| gives-exploit | 1 | 0 | 17834 | 1 | 99.99% | 50.00% | Scryfall only, e.g. Henry Wu, InGen Geneticist |
| gives-extort | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-fabricate | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-fear | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Oddric, Lunar Marquis |
| gives-firebending | 3 | 0 | 17832 | 1 | 99.99% | 75.00% | Scryfall only, e.g. Iroh, Dragon of the West |
| gives-first-strike | 98 | 0 | 17702 | 36 | 99.80% | 73.13% | Scryfall only, e.g. Angelic Destiny; Greymond, Avacyn's Stalwart |
| gives-flanking | 0 | 0 | 17834 | 2 | 99.99% | 0.00% | Scryfall only, e.g. Flanking Licid; Oddric, Lunar Marquis |
| gives-flash | 1 | 0 | 17798 | 37 | 99.79% | 2.63% | Scryfall only, e.g. Liberator, Urza's Battlethopter; Cherished Hatchling |
| gives-flashback | 13 | 0 | 17823 | 0 | 100.00% | 100.00% |  |
| gives-flying | 189 | 0 | 17557 | 90 | 99.50% | 67.74% | Scryfall only, e.g. Archon of the Wild Rose; Vulpikeet |
| gives-forestwalk | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-foretell | 2 | 0 | 17833 | 1 | 99.99% | 66.67% | Scryfall only, e.g. Ethereal Valkyrie |
| gives-freerunning | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-harmonize | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-haste | 273 | 14 | 17393 | 156 | 99.05% | 63.64% | Suggested only here, e.g. Goldwardens' Gambit; Orthion, Hero of Lavabrink. Scryfall only, e.g. Jolrael, Voice of Zhalfir; All-Star Kicker |
| gives-hexproof | 102 | 6 | 17690 | 38 | 99.75% | 72.86% | Suggested only here, e.g. Metropolis Reformer; Enduring Angel // Angelic Enforcer. Scryfall only, e.g. Dragonfire Blade; Dawn's Truce |
| gives-horsemanship | 2 | 0 | 17833 | 1 | 99.99% | 66.67% | Scryfall only, e.g. Oddric, Lunar Marquis |
| gives-improvise | 2 | 0 | 17832 | 2 | 99.99% | 50.00% | Scryfall only, e.g. Archway of Innovation; The Fifteenth Doctor |
| gives-indestructible | 172 | 0 | 17612 | 52 | 99.71% | 76.79% | Scryfall only, e.g. Almost Perfect; Dawn's Truce |
| gives-islandwalk | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-jump-start | 1 | 0 | 17834 | 1 | 99.99% | 50.00% | Scryfall only, e.g. Niv-Mizzet, Supreme |
| gives-lifelink | 108 | 2 | 17676 | 50 | 99.71% | 68.35% | Suggested only here, e.g. Jerren, Corrupted Bishop // Ormendahl, the Corrupter; Lyra Dawnbringer. Scryfall only, e.g. Dreadhorde Invasion; On Serra's Wings |
| gives-living-weapon | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-madness | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Falkenrath Gorger |
| gives-mayhem | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-melee | 8 | 0 | 17828 | 0 | 100.00% | 100.00% |  |
| gives-menace | 97 | 2 | 17693 | 44 | 99.74% | 68.79% | Suggested only here, e.g. Piper of the Swarm; Eiganjo Uprising. Scryfall only, e.g. Gloomfang Mauler; Rebuild the City |
| gives-mentor | 2 | 0 | 17834 | 0 | 100.00% | 100.00% |  |
| gives-miracle | 3 | 0 | 17833 | 0 | 100.00% | 100.00% |  |
| gives-mobilize | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-modular | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-myriad | 7 | 0 | 17829 | 0 | 100.00% | 100.00% |  |
| gives-ninjutsu | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-offspring | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-outlast | 2 | 0 | 17834 | 0 | 100.00% | 100.00% |  |
| gives-persist | 3 | 0 | 17833 | 0 | 100.00% | 100.00% |  |
| gives-plainswalk | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-plot | 1 | 0 | 17830 | 5 | 99.97% | 16.67% | Scryfall only, e.g. Make Your Own Luck; Kellan Joins Up |
| gives-pp-counters | 991 | 17 | 16507 | 321 | 98.10% | 75.53% | Suggested only here, e.g. Fell Beast of Mordor; Mimeoplasm, Revered One. Scryfall only, e.g. Kellan, Daring Traveler // Journey On; Conformer Shuriken |
| gives-protection | 29 | 7 | 17795 | 5 | 99.93% | 85.29% | Suggested only here, e.g. Runed Halo; Noble Heritage. Scryfall only, e.g. Gor Muldrak, Amphinologist; Eater of Virtue |
| gives-prowess | 5 | 0 | 17831 | 0 | 100.00% | 100.00% |  |
| gives-prowl | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-reach | 40 | 0 | 17771 | 25 | 99.86% | 61.54% | Scryfall only, e.g. Gemrazer; Glowstone Recluse |
| gives-read-ahead | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-rebound | 0 | 0 | 17834 | 2 | 99.99% | 0.00% | Scryfall only, e.g. Ojer Pakpatiq, Deepest Epoch // Temple of Cyclical Time; Taigam, Ojutai Master |
| gives-renown | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-replicate | 3 | 0 | 17832 | 1 | 99.99% | 75.00% | Scryfall only, e.g. Threefold Signal |
| gives-retrace | 2 | 0 | 17834 | 0 | 100.00% | 100.00% |  |
| gives-riot | 3 | 0 | 17833 | 0 | 100.00% | 100.00% |  |
| gives-saddle | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Jandor, Fortuned Traveler |
| gives-scavenge | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-shadow | 0 | 0 | 17834 | 2 | 99.99% | 0.00% | Scryfall only, e.g. Minas Morgul, Dark Fortress; Lyna, Veil of Vengeance |
| gives-shroud | 2 | 0 | 17833 | 1 | 99.99% | 66.67% | Scryfall only, e.g. Oddric, Lunar Marquis |
| gives-skulk | 2 | 0 | 17781 | 53 | 99.70% | 3.64% | Scryfall only, e.g. Sauron, the Dark Lord; Ranger's Firebrand |
| gives-sneak | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-spectacle | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-split-second | 2 | 0 | 17834 | 0 | 100.00% | 100.00% |  |
| gives-squad | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-storm | 1 | 0 | 17833 | 2 | 99.99% | 33.33% | Scryfall only, e.g. Storm, Force of Nature; Crackling Spellslinger |
| gives-sunburst | 0 | 0 | 17833 | 3 | 99.98% | 0.00% | Scryfall only, e.g. Solar Array; Wildgrowth Archaic |
| gives-suspend | 2 | 0 | 17825 | 9 | 99.95% | 18.18% | Scryfall only, e.g. Taigam, Master Opportunist; The Tenth Doctor |
| gives-toxic | 6 | 0 | 17829 | 1 | 99.99% | 85.71% | Scryfall only, e.g. Kinzu of the Bleak Coven |
| gives-training | 2 | 0 | 17834 | 0 | 100.00% | 100.00% |  |
| gives-trample | 253 | 0 | 17509 | 74 | 99.59% | 77.37% | Scryfall only, e.g. Gemrazer; Fully Grown |
| gives-umbra-armor | 0 | 0 | 17836 | 0 | 100.00% | ? |  |
| gives-undaunted | 0 | 0 | 17834 | 2 | 99.99% | 0.00% | Scryfall only, e.g. Durnan of the Yawning Portal; Võx, Child of the Collective |
| gives-undying | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Haunted One |
| gives-unearth | 3 | 0 | 17832 | 1 | 99.99% | 75.00% | Scryfall only, e.g. Solemn Doomguide |
| gives-unleash | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-vigilance | 151 | 0 | 17648 | 37 | 99.79% | 80.32% | Scryfall only, e.g. Tayam, Luminous Enigma; On Serra's Wings |
| gives-ward | 39 | 0 | 17781 | 16 | 99.91% | 70.91% | Scryfall only, e.g. Winter, Cursed Rider; Thran Power Suit |
| gives-warp | 1 | 0 | 17835 | 0 | 100.00% | 100.00% |  |
| gives-web-slinging | 0 | 0 | 17835 | 1 | 99.99% | 0.00% | Scryfall only, e.g. Peter Parker // Amazing Spider-Man |
| gives-wither | 2 | 0 | 17832 | 2 | 99.99% | 50.00% | Scryfall only, e.g. Spinerock Tyrant; Oddric, Lunar Marquis |
| group-slug | 476 | 8 | 17255 | 97 | 99.41% | 83.07% | Suggested only here, e.g. The Kingpin of Crime; Syndicate Heavy. Scryfall only, e.g. Amarant Coral; Underworld Dreams |
| hand-size-increase | 25 | 0 | 17803 | 8 | 99.96% | 75.76% | Scryfall only, e.g. Finale of Revelation; Spirit Water Revival |
| haste-counter | 1 | 0 | 17833 | 2 | 99.99% | 33.33% | Scryfall only, e.g. Indominus Rex, Alpha; Owen Grady, Raptor Trainer |
| hate-flying | 41 | 0 | 17769 | 26 | 99.85% | 61.19% | Scryfall only, e.g. Netcaster Spider; Storm, Queen of Wakanda |
| hate-graveyard | 176 | 6 | 17553 | 101 | 99.40% | 63.54% | Suggested only here, e.g. The Spot, Living Portal; Savior of Ollenbock. Scryfall only, e.g. Saruman of Many Colors; Reito Sentinel |
| hexproof-counter | 1 | 0 | 17829 | 6 | 99.97% | 14.29% | Scryfall only, e.g. Crystalline Giant; Wingfold Pteron |
| indestructible-counter | 12 | 0 | 17811 | 13 | 99.93% | 48.00% | Scryfall only, e.g. Myojin of Cryptic Dreams; Myojin of Roaring Blades |
| intervening-if-clause | 956 | 3 | 16432 | 445 | 97.49% | 68.24% | Suggested only here, e.g. Uvilda, Dean of Perfection // Nassari, Dean of Expression; Magik, Illyana Rasputin // Darkchild, Demon Uncaged. Scryfall only, e.g. Summon: Choco/Mog; Rally the Galadhrim |
| keyword-anthem | 247 | 29 | 17484 | 76 | 99.41% | 76.47% | Suggested only here, e.g. Boss Uramon, Shadow's Reach; Drix Fatemaker. Scryfall only, e.g. Archon of the Wild Rose; Bruse Tarl, Roving Rancher |
| land-ramp | 224 | 9 | 17374 | 229 | 98.67% | 49.45% | Suggested only here, e.g. Scapeshift; Fall of the Thran. Scryfall only, e.g. Invasion of Tolvada // The Broken Sky; Growing Rites of Itlimoc // Itlimoc, Cradle of the Sun |
| life-payment | 79 | 0 | 17348 | 409 | 97.71% | 16.19% | Scryfall only, e.g. Blood Operative; Miara, Thorn of the Glade |
| lifegain | 1542 | 7 | 16151 | 136 | 99.20% | 91.90% | Suggested only here, e.g. Bloomvine Regent // Claim Territory // Bloomvine Regent; Bilbo, Birthday Celebrant. Scryfall only, e.g. Ragost, Deft Gastronaut; The Fourth Doctor |
| lifelink-counter | 4 | 0 | 17813 | 19 | 99.89% | 17.39% | Scryfall only, e.g. Gilraen, Dúnedain Protector; Crystalline Giant |
| loot | 231 | 1 | 17527 | 77 | 99.56% | 75.00% | Suggested only here, e.g. Balor. Scryfall only, e.g. Katara, Waterbending Master; Sauron, the Dark Lord |
| mana-dork | 224 | 13 | 17516 | 83 | 99.46% | 72.96% | Suggested only here, e.g. Ramos, Dragon Engine; The Cabbage Merchant. Scryfall only, e.g. Kelpie Guide; Ioreth of the Healing House |
| mana-producer | 451 | 21 | 17212 | 152 | 99.03% | 74.79% | Suggested only here, e.g. Tesak, Judith's Hellhound; Fangorn, Tree Shepherd. Scryfall only, e.g. Ninja Pizza; Kelpie Guide |
| mana-rock | 183 | 0 | 17612 | 41 | 99.77% | 81.70% | Scryfall only, e.g. Repair and Recharge; Urza's Command |
| mana-sink | 62 | 1 | 16815 | 958 | 94.62% | 6.08% | Suggested only here, e.g. Sigarda's Imprisonment. Scryfall only, e.g. The Lonely Mountain; Keen-Eyed Curator |
| menace-counter | 5 | 0 | 17821 | 10 | 99.94% | 33.33% | Scryfall only, e.g. Crystalline Giant; T-45 Power Armor |
| mill-each | 26 | 0 | 17796 | 14 | 99.92% | 65.00% | Scryfall only, e.g. Over the Top; Nuclear Fallout |
| mill-opponent | 135 | 0 | 17574 | 127 | 99.29% | 51.53% | Scryfall only, e.g. Over the Top; Fevered Suspicion |
| mill-self | 279 | 5 | 16999 | 553 | 96.87% | 33.53% | Suggested only here, e.g. Mind Drain; Demogorgon's Clutches. Scryfall only, e.g. Siren Lookout; Kellan, Daring Traveler // Journey On |
| modal | 605 | 25 | 17199 | 7 | 99.82% | 98.86% | Suggested only here, e.g. Struggle for Project Purity; Phenomenon Investigators. Scryfall only, e.g. Greymond, Avacyn's Stalwart; Season of Loss |
| more-expensive-than-mv | 189 | 0 | 17206 | 441 | 97.53% | 30.00% | Scryfall only, e.g. Balamb Garden, SeeD Academy // Balamb Garden, Airborne; Thousand-Faced Shadow |
| move-counters | 33 | 5 | 17794 | 4 | 99.95% | 89.19% | Suggested only here, e.g. Donatello, Mutant Mechanic; Graft Surgeon. Scryfall only, e.g. Quirion Beastcaller; Reyhan, Last of the Abzan |
| mutual-sacrifice | 29 | 2 | 17796 | 9 | 99.94% | 76.32% | Suggested only here, e.g. Bringer of the Last Gift; Winnowing. Scryfall only, e.g. Braids, Arisen Nightmare; Season of Loss |
| one-sided-fight | 84 | 4 | 17711 | 37 | 99.77% | 69.42% | Suggested only here, e.g. Heartfire Immolator; Blazing Bomb. Scryfall only, e.g. Storm, Queen of Wakanda; Duggan, Private Detective |
| opponent-loses-life | 413 | 8 | 17310 | 105 | 99.37% | 79.73% | Suggested only here, e.g. Skull Storm; Unstoppable Slasher. Scryfall only, e.g. Winter, Cursed Rider; Protection Racket |
| phasing | 27 | 0 | 17805 | 4 | 99.98% | 87.10% | Scryfall only, e.g. U.S.S. Defiant, Mirror Migrant; Spectral Adversary |
| pinger | 274 | 3 | 17517 | 42 | 99.75% | 86.71% | Suggested only here, e.g. Eye of Jace; Vindictive Vampire. Scryfall only, e.g. Dread Presence; Lorehold Apprentice |
| play-additional-land | 30 | 0 | 17804 | 2 | 99.99% | 93.75% | Scryfall only, e.g. Nahiri's Lithoforming; Nog, Ambitious Cadet |
| power-boost-to-all | 523 | 12 | 17047 | 254 | 98.51% | 67.31% | Suggested only here, e.g. Clamavus; Raggadragga, Goreguts Boss. Scryfall only, e.g. Rosnakht, Heir of Rohgahh; Lulu, Loyal Hollyphant |
| pure-draw | 1837 | 76 | 15494 | 429 | 97.17% | 81.07% | Suggested only here, e.g. Nahiri's Lithoforming; Casey Jones, Vigilante. Scryfall only, e.g. Crown of Gondor; Lava Serpent |
| ramp | 1136 | 22 | 16276 | 402 | 97.62% | 73.86% | Suggested only here, e.g. Inga and Esika; Tazri, Stalwart Survivor. Scryfall only, e.g. Invasion of Tolvada // The Broken Sky; Growing Rites of Itlimoc // Itlimoc, Cradle of the Sun |
| reach-counter | 2 | 0 | 17825 | 9 | 99.95% | 18.18% | Scryfall only, e.g. Crystalline Giant; Gift of the Viper |
| reanimate-creature | 206 | 4 | 17485 | 141 | 99.19% | 59.37% | Suggested only here, e.g. Immortal Obligation; Resistance Is Futile. Scryfall only, e.g. Alesha, Who Laughs at Fate; Hour of Eternity |
| reflexive-trigger | 219 | 0 | 17570 | 47 | 99.74% | 82.33% | Scryfall only, e.g. Saruman of Many Colors; Agatha's Soul Cauldron |
| regrowth-creature | 125 | 1 | 17657 | 53 | 99.70% | 70.22% | Suggested only here, e.g. Urborg Repossession. Scryfall only, e.g. Grim Captain's Call; Mirkwood Elk |
| removal-artifact | 589 | 6 | 17174 | 67 | 99.59% | 89.79% | Suggested only here, e.g. Braids, Arisen Nightmare; Elesh Norn // The Argent Etchings. Scryfall only, e.g. Torment of Scarabs; Kitesail Larcenist |
| removal-bounce | 191 | 7 | 17616 | 22 | 99.84% | 89.67% | Suggested only here, e.g. Obscura Interceptor; The Eagles Are Coming!. Scryfall only, e.g. Zimone's Hypothesis; Lunar Rejection |
| removal-creature | 2453 | 33 | 15006 | 344 | 97.89% | 87.70% | Suggested only here, e.g. Blot Out the Sky; Archive Arbiter. Scryfall only, e.g. Torment of Scarabs; Illithid Harvester // Plant Tadpoles |
| removal-destroy | 763 | 8 | 17049 | 16 | 99.87% | 97.95% | Suggested only here, e.g. Kraul Whipcracker; Old Hob, Alleycat Blues. Scryfall only, e.g. Dalek Drone; Callidus Assassin |
| removal-enchantment | 500 | 8 | 17269 | 59 | 99.62% | 89.45% | Suggested only here, e.g. Deny the Divine; Braids, Arisen Nightmare. Scryfall only, e.g. Torment of Scarabs; Minimus Containment |
| removal-exile | 333 | 4 | 17450 | 49 | 99.70% | 87.17% | Suggested only here, e.g. Fortune, Loyal Steed; Worlds Within Worlds. Scryfall only, e.g. The Pandorica; Aang, Swift Savior // Aang and La, Ocean's Fury |
| removal-fight | 106 | 3 | 17723 | 4 | 99.96% | 96.36% | Suggested only here, e.g. Hans Eriksson; Golden Guardian // Gold-Forge Garrison. Scryfall only, e.g. Cherished Hatchling; Summon: Magus Sisters |
| removal-land | 48 | 0 | 17730 | 58 | 99.67% | 45.28% | Scryfall only, e.g. Ragnarok, Divine Deliverance; The Coming of Galactus |
| removal-nonland | 216 | 8 | 17561 | 51 | 99.67% | 80.90% | Suggested only here, e.g. Blot Out the Sky; Archive Arbiter. Scryfall only, e.g. Torment of Scarabs; Minimus Containment |
| removal-planeswalker | 911 | 16 | 16797 | 112 | 99.28% | 89.05% | Suggested only here, e.g. Druid of Purification; Devils' Playground. Scryfall only, e.g. Torment of Scarabs; Minimus Containment |
| removal-sacrifice | 153 | 3 | 17617 | 63 | 99.63% | 70.83% | Suggested only here, e.g. Clackbridge Troll; Innocent Traveler // Malicious Invader. Scryfall only, e.g. Torment of Scarabs; Vein Ripper |
| removal-toughness | 263 | 4 | 17553 | 16 | 99.89% | 94.27% | Suggested only here, e.g. Sidar Kondo of Jamuraa; Bile-Vial Boggart. Scryfall only, e.g. Swarmyard Massacre; Nuclear Fallout |
| removal-tuck | 48 | 0 | 17760 | 28 | 99.84% | 63.16% | Scryfall only, e.g. Blink; This Is How It Ends |
| remove-counters | 146 | 4 | 17519 | 167 | 99.04% | 46.65% | Suggested only here, e.g. Mari, the Killing Quill; Fraying Line. Scryfall only, e.g. Aether Spike; Verazol, the Split Current |
| repeatable-creature-tokens | 743 | 11 | 16847 | 235 | 98.62% | 75.97% | Suggested only here, e.g. Urza's Saga; Nurgle's Rot. Scryfall only, e.g. Cadric, Soul Kindler; Kuja, Genome Sorcerer // Trance Kuja, Fate Defied |
| repeatable-crime | 491 | 19 | 16472 | 854 | 95.11% | 36.51% | Suggested only here, e.g. Ifnir Deadlands; Black Bolt, Inhuman King. Scryfall only, e.g. Ragged Playmate; Ornery Tumblewagg |
| repeatable-lifegain | 779 | 14 | 16851 | 192 | 98.85% | 80.23% | Suggested only here, e.g. Bloomvine Regent // Claim Territory // Bloomvine Regent; Eye of Jace. Scryfall only, e.g. Ragost, Deft Gastronaut; Bre of Clan Stoutarm |
| repeatable-loot | 92 | 1 | 17661 | 82 | 99.53% | 52.87% | Suggested only here, e.g. "Zekes, Acid Rock Fan". Scryfall only, e.g. Pip-Boy 3000; Katara, Waterbending Master |
| repeatable-pp-counters | 999 | 14 | 16486 | 337 | 98.03% | 74.78% | Suggested only here, e.g. Aerith Gainsborough; Aang, Swift Savior // Aang and La, Ocean's Fury. Scryfall only, e.g. Farid, Enterprising Salvager; Pip-Boy 3000 |
| repeatable-pure-draw | 736 | 26 | 16771 | 303 | 98.16% | 70.84% | Suggested only here, e.g. Public Enemy; Fblthp, Impossibly Lost. Scryfall only, e.g. Crown of Gondor; Fealty to the Realm |
| repeatable-removal | 335 | 25 | 17287 | 189 | 98.80% | 63.93% | Suggested only here, e.g. Fortune, Loyal Steed; Clackbridge Troll. Scryfall only, e.g. World Breaker; Torment of Scarabs |
| repeatable-rummage | 22 | 1 | 17729 | 84 | 99.52% | 20.75% | Suggested only here, e.g. Sigarda's Imprisonment. Scryfall only, e.g. Farid, Enterprising Salvager; Merchant of the Vale // Haggle |
| repeatable-sacrifice-outlet | 336 | 6 | 17362 | 132 | 99.23% | 71.79% | Suggested only here, e.g. Grim Reaper's Scythe; Asmoranomardicadaistinaculdacar. Scryfall only, e.g. Birthing Ritual; Ninja Pizza |
| ritual | 20 | 0 | 17810 | 6 | 99.97% | 76.92% | Scryfall only, e.g. Pyre Rhymer // Molten Tide; Open the Omenpaths |
| rummage | 112 | 1 | 17592 | 131 | 99.26% | 46.09% | Suggested only here, e.g. Reverberating Summons. Scryfall only, e.g. Rescue Leopard; Witch's Mark |
| sacrifice-outlet-artifact | 198 | 1 | 17586 | 51 | 99.71% | 79.52% | Suggested only here, e.g. Reclamation Specialist. Scryfall only, e.g. Ragost, Deft Gastronaut; Eject the Warp Core |
| sacrifice-outlet-creature | 406 | 6 | 17299 | 125 | 99.27% | 76.46% | Suggested only here, e.g. Tyrannical Pitlord; A Killer Among Us. Scryfall only, e.g. Necrotic Hex; Lotus Ring |
| sacrifice-outlet-land | 57 | 0 | 17754 | 25 | 99.86% | 69.51% | Scryfall only, e.g. Lochmere Serpent; Ifnir Deadlands |
| sacrifice-outlet-token | 22 | 0 | 17792 | 22 | 99.88% | 50.00% | Scryfall only, e.g. Kellan's Lightblades; Beseech the Mirror |
| sacrifice-self | 565 | 53 | 17137 | 81 | 99.25% | 87.46% | Suggested only here, e.g. Piru, the Volatile; Satya, Aetherflux Genius. Scryfall only, e.g. Gibbering Barricade; Ifnir Deadlands |
| scry | 327 | 1 | 17469 | 39 | 99.78% | 89.34% | Suggested only here, e.g. Kenessos, Priest of Thassa. Scryfall only, e.g. Ravenloft Adventurer; Loot Dispute |
| shade-pump | 75 | 0 | 17722 | 39 | 99.78% | 65.79% | Scryfall only, e.g. Kargan Intimidator; Water Tribe Captain |
| shadow-counter | 2 | 0 | 17834 | 0 | 100.00% | 100.00% |  |
| spot-removal | 2266 | 33 | 15090 | 447 | 97.31% | 83.52% | Suggested only here, e.g. Blasphemous Edict; Barroom Brawl. Scryfall only, e.g. Torment of Scarabs; Consulate Crackdown |
| sweeper | 360 | 10 | 17404 | 62 | 99.60% | 85.31% | Suggested only here, e.g. The War Games; Coward // Killer. Scryfall only, e.g. Necrotic Hex; Break the Ice |
| sweeper-one-sided | 69 | 6 | 17702 | 59 | 99.64% | 53.91% | Suggested only here, e.g. Consulate Crackdown; Bringer of the Last Gift. Scryfall only, e.g. Piru, the Volatile; Cavalier of Flame |
| tapper-creature | 322 | 5 | 17463 | 46 | 99.71% | 87.50% | Suggested only here, e.g. Reservoir Kraken; Vantress Transmuter // Croaking Curse. Scryfall only, e.g. Stinging Lionfish; Marooned |
| threaten | 62 | 0 | 17762 | 12 | 99.93% | 83.78% | Scryfall only, e.g. Midnight Crusader Shuttle; Stolen Uniform |
| toughness-boost-to-all | 371 | 11 | 17235 | 219 | 98.71% | 62.88% | Suggested only here, e.g. Clamavus; Raggadragga, Goreguts Boss. Scryfall only, e.g. Lulu, Loyal Hollyphant; The Fifth Doctor |
| trample-counter | 4 | 0 | 17819 | 13 | 99.93% | 23.53% | Scryfall only, e.g. Experimental Lab // Staff Room; Crystalline Giant |
| triggered-ability | 9337 | 17 | 7714 | 768 | 95.60% | 92.40% | Suggested only here, e.g. Bloomvine Regent // Claim Territory // Bloomvine Regent; Strength of Will. Scryfall only, e.g. Summon: Choco/Mog; Soul of Eternity |
| tutor-artifact | 24 | 1 | 17793 | 18 | 99.89% | 57.14% | Suggested only here, e.g. Vision Quest. Scryfall only, e.g. Honored Knight-Captain; Open the Armory |
| tutor-land-basic | 244 | 6 | 17507 | 79 | 99.52% | 75.54% | Suggested only here, e.g. 70,000 Light-Years from Home; Old-Growth Dryads. Scryfall only, e.g. Neverwinter Dryad; Ravenloft Adventurer |
| tutor-land-to-battlefield | 169 | 5 | 17622 | 40 | 99.75% | 80.86% | Suggested only here, e.g. Old-Growth Dryads; Avengers Disassembled. Scryfall only, e.g. Archdruid's Charm; Canoptek Wraith |
| tutor-to-hand | 245 | 2 | 17406 | 183 | 98.96% | 57.24% | Suggested only here, e.g. Nephilim Epochal; Delivery Moogle. Scryfall only, e.g. Nikara, Lair Scavenger; Archdruid's Charm |
| unblockable | 88 | 3 | 17684 | 61 | 99.64% | 59.06% | Suggested only here, e.g. Canoptek Wraith; Illvoi Infiltrator. Scryfall only, e.g. Brotherhood Spy; Leitmotif Composer |
| vigilance-counter | 2 | 0 | 17821 | 13 | 99.93% | 13.33% | Scryfall only, e.g. Tayam, Luminous Enigma; Gilraen, Dúnedain Protector |
| wheel-one-sided | 23 | 3 | 17766 | 44 | 99.74% | 34.33% | Suggested only here, e.g. Ox of Agonas; Nibelheim Aflame. Scryfall only, e.g. Book Devourer; Subira, Tulzidi Caravanner |
| wheel-symmetrical | 16 | 0 | 17816 | 4 | 99.98% | 80.00% | Scryfall only, e.g. Step Between Worlds; Khorvath's Fury |
