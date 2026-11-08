/* Forever Field Guide: class + leveling data.
   Checked against Blizzard, Wowhead, Icy Veins and Warcraft Tavern on 2026-11-07 (patch 1.60.1,
   after the 2 November talent changes). Anything marked `verify` disagreed between sources or
   only came from beta reports: check it in game.
   Strings may contain <code>/<strong>/<em>; they are rendered as HTML. */
window.FOREVER = (function () {
  "use strict";

  /* ------------------------------------------------------------------ addons */
  var addons = {
    questie:   { name: "Questie", cmd: "/questie", q: "legendary", installed: true, what: "quest givers and objectives on the map. Some new Forever quests are still missing, so trust quest text over a missing marker." },
    rxp:       { name: "RestedXP Guide", cmd: "/rxp", q: "epic", installed: true, url: "https://www.curseforge.com/wow/addons/restedxp-guide", what: "step-by-step route with an arrow. The free route covers about 1–20 (Alliance) and 1–22 (Horde); the Forever routes after that are paid." },
    wisp:      { name: "ForeverWisp", cmd: "/wisp", q: "epic", installed: true, url: "https://www.curseforge.com/wow/addons/foreverwisp", what: "free 1–20 route for all eight starts, including Horde Skyborne, with an arrow, class quests and talent picks." },
    guidelime: { name: "Guidelime", cmd: "/lime", q: "rare", url: "https://www.curseforge.com/wow/addons/guidelime", what: "free alternative to RestedXP if you'd rather not pay for routes past 20." },
    dj:        { name: "DungeonJournal", cmd: "/dj", q: "epic", installed: true, what: "bosses, quests and loot for every dungeon. Turn on RPG mode if you want pages to unlock as you clear." },
    bis:       { name: "ForeverBiS", cmd: "/bis", q: "epic", installed: true, url: "https://www.curseforge.com/wow/addons/foreverbis", what: "BiS lists for all 28 specs, quest chains per dungeon, and dungeon maps (the Forever client has none)." },
    atlas:     { name: "AtlasLoot Forever", cmd: "/atlasloot", q: "rare", installed: true, url: "https://www.curseforge.com/wow/addons/atlasloot-classic-forever", what: "loot tables by boss with BiS tooltips. Take the Forever one by Sliccer; the old AtlasLootClassic has no Forever file." },
    pawn:      { name: "Pawn", cmd: "/pawn", q: "rare", installed: true, url: "https://www.curseforge.com/wow/addons/pawn", what: "green upgrade arrows on item tooltips, using a stat scale for your spec." },
    tomtom:    { name: "TomTom", cmd: "/way", q: "uncommon", installed: true, what: "waypoint arrow to any coordinate." },
    gather:    { name: "GatherMate2", cmd: "/gathermate", q: "uncommon", installed: true, what: "remembers every herb and ore node you pass." },
    leatrix:   { name: "Leatrix Plus", cmd: "/ltp", q: "epic", installed: true, what: "auto-sell junk, auto-repair, faster looting." },
    threat:    { name: "ForeverThreat", cmd: "/ft", q: "rare", installed: true, what: "threat meter. Tanks watch it to hold aggro; damage dealers watch it so they don't pull aggro off the tank." },
    dbm:       { name: "Deadly Boss Mods", cmd: "/dbm", q: "rare", installed: true, what: "boss timers, including the new Forever dungeons." },
    auctionator: { name: "Auctionator", cmd: "", q: "rare", installed: true, what: "sell gathered mats at the Auction House." }
  };

  /* ------------------------------------------------------------------ races */
  var races = {
    human:   { name: "Human", faction: "Alliance", start: "northshire", classes: ["warrior", "paladin", "hunter", "rogue", "priest", "mage", "warlock"], newCombo: ["hunter"],
               racials: [["Ruthless", "+1% crit with everything."], ["Will to Survive", "breaks stuns, 3 min."], ["The Human Spirit", "+10% Spirit."], ["Perception", "spot stealthed players."]] },
    dwarf:   { name: "Dwarf", faction: "Alliance", start: "coldridge", classes: ["warrior", "paladin", "hunter", "rogue", "priest", "shaman"], newCombo: ["shaman"],
               racials: [["Big Game Hunter", "+5% damage to Beasts: most early mobs are beasts."], ["Artisan's Precision", "+1% hit."], ["Stoneform", "removes poison, disease and bleeds, −10% physical damage for 8 s."], ["Find Treasure", "chests on the minimap."]] },
    gnome:   { name: "Gnome", faction: "Alliance", start: "coldridge", classes: ["warrior", "rogue", "priest", "mage", "warlock"], newCombo: ["priest"],
               racials: [["Eureka!", "−10% cost and +10% damage for 8 s, 2 min. Open each tough pull with it."], ["Expansive Mind", "+5% max mana, rage or energy."], ["Escape Artist", "breaks roots and snares."], ["Engineering Specialization", "+15 Engineering."]] },
    nightelf:{ name: "Night Elf", faction: "Alliance", start: "shadowglen", classes: ["warrior", "hunter", "rogue", "priest", "druid"], newCombo: [],
               racials: [["Elune's Light", "+10% crit for 15 s. A burst cooldown."], ["Shadowmeld", "drop combat and vanish."], ["Quickness", "+1% dodge, +2% run speed."], ["Wisp Spirit", "+75% speed as a ghost."]] },
    skyA:    { name: "Skyborne (High Order)", short: "Skyborne", faction: "Alliance", start: "zephrasA", classes: ["warrior", "hunter", "rogue", "mage", "druid"], newCombo: ["warrior", "hunter", "rogue", "mage", "druid"], pack: true,
               racials: [["Read Leyline", "+50% health and mana regen for 15 s (100% for an hour after using it on a ley line). Less drinking."], ["Wind Blessed", "+2% haste."], ["Walk on Air", "10 s glide, 1.5 min. Fall protection and shortcuts."], ["Elemental Insight", "+5% damage to Elementals."]] },
    orc:     { name: "Orc", faction: "Horde", start: "valley", classes: ["warrior", "hunter", "rogue", "shaman", "mage", "warlock"], newCombo: ["mage"],
               racials: [["Blood Fury", "+10% attack and spell power for 15 s, 2 min. Now helps casters too."], ["Command", "+5% pet damage (Hunter, Warlock)."], ["Shatter Curse", "cleanses curses, −5% magic damage."], ["Hardiness", "−20% stun duration."]] },
    undead:  { name: "Undead", faction: "Horde", start: "deathknell", classes: ["warrior", "paladin", "rogue", "priest", "mage", "warlock"], newCombo: ["paladin"],
               racials: [["Cannibalize", "now restores health and mana between pulls."], ["Touch of the Grave", "attacks can drain up to 5% of your max health back (15 s cooldown)."], ["Will of the Forsaken", "breaks fear, charm and sleep."], ["Underwater Breathing", "much longer breath."]] },
    tauren:  { name: "Tauren", faction: "Horde", start: "narache", classes: ["warrior", "hunter", "shaman", "druid"], newCombo: [],
               racials: [["Plainsrunning", "+2% speed per stack while moving on foot, up to 60%. Huge for questing before 40."], ["War Stomp", "AoE stun."], ["Endurance", "+5% health."], ["Cultivation", "grow an herb anyone can pick."]] },
    troll:   { name: "Troll", faction: "Horde", start: "valley", classes: ["warrior", "hunter", "rogue", "priest", "shaman", "mage", "warlock"], newCombo: ["warlock"],
               racials: [["Berserking", "+10% cast and attack speed for 15 s."], ["Beast Slaying", "+5% damage to Beasts."], ["Rapid Regeneration", "channel to regain 50% health."], ["Regeneration", "+20% health regen, some in combat."]] },
    skyH:    { name: "Skyborne (Windshaper)", short: "Skyborne", faction: "Horde", start: "zephrasH", classes: ["warrior", "hunter", "rogue", "shaman", "druid"], newCombo: ["warrior", "hunter", "rogue", "shaman", "druid"], pack: true,
               racials: [["Skysight", "+15% run speed for 15 s (30% for an hour after using it at an elemental convergence)."], ["Wind Blessed", "+2% haste."], ["Walk on Air", "10 s glide, 1.5 min."], ["Elemental Insight", "+5% damage to Elementals."]] }
  };

  /* ------------------------------------------------------------------ dungeons (Blizzard ranges; in-game LFG lists them wider) */
  var dungeons = {
    thanes:   { name: "Hall of Thanes", lvl: "13–18", where: "Old Ironforge, under the Throne Room", isNew: true,
                quests: "Important Heirlooms (Thom Filch, outside), The Restless Dead (Afadra Dunwall), Old Ironforge Incursion (needs the Dark Iron Map from Dark Iron Spies in Dun Morogh), An Ancient Grudge (inside), The Treaty of Understanding (vault tablet, hand in to Magni).",
                loot: "Golemheart Stave, Fang of Magmatus, Durgen's Crescent Axe, Robes of the Disgraced Thane." },
    ruins:    { name: "Ruins of Lordaeron", lvl: "15–20", where: "above the Undercity, Tirisfal", isNew: true,
                quests: "Horde: The Wrath of Rath'mael (Brill), A Frightened Request (Tabitha Heartweaver, The Sepulcher), Light's Justice and The New Plague (Undercity Apothecarium). Everyone: Crest of Lordaeron. Every Ruins quest needs level 15.",
                loot: "Bosses: Witherfang, The Baron, The Abandoned, Bjork, Rath'mael, and optional Viktor the Vile from the fireplace." },
    rfc:      { name: "Ragefire Chasm", lvl: "13–18", where: "Orgrimmar, Cleft of Shadow", quests: "Pick up the Orgrimmar quests before you go in.", loot: "" },
    wc:       { name: "Wailing Caverns", lvl: "17–24", where: "The Barrens, south-west of the Crossroads", quests: "Most quests come from the Crossroads and the oasis outside the cave.", loot: "" },
    vc:       { name: "Deadmines", lvl: "17–26", where: "Moonbrook, Westfall", quests: "The Defias Brotherhood chain from Sentinel Hill, Red Silk Bandanas, Collecting Memories.", loot: "" }
  };

  /* ------------------------------------------------------------------ routes: one per starting area
     step: [fromLevel, toLevel, title, html, use[], opts]   use = addon ids or [id, command] */
  var setup = [1, 1, "Before you take a step", "Turn on Questie and a route addon: ForeverWisp is free to 20 for every start (RestedXP's free route works too). Set your Pawn scale, and turn on Auto Loot. Grab the first quest that hands out a <strong>gathering manual</strong>: it teaches Mining, Herbalism or Skinning without a trainer. Pick one gathering profession now and sell the mats with Auctionator.", ["questie", "wisp", "rxp", "pawn", "gather"], { kind: "setup" }];

  var routes = {
    northshire: { name: "Northshire Abbey → Elwynn → Westfall", faction: "Alliance", steps: [
      setup,
      [1, 5, "Northshire Abbey", "Do every quest in the valley. <strong>Rascally Rodents</strong> gives the gathering manual. New in Forever: Kobold Vermin drop Nibbled-On Books. Bring 8 to Brother Paxton for a profession manual, and <em>Book Return</em> gives a Book Bag.", ["questie"], { verify: "The book chain is from beta reports." }],
      [5, 10, "Goldshire and Elwynn Forest", "Set your hearth at the Lion's Pride Inn in Goldshire. Work through Fargodeep and Jasperlode Mines, the Crystal Lake murlocs and Eastvale. Forever added new kobold-mine and Crystal Lake chains and two new named mobs, Croaky and Elmpaw. Elwynn has 25 new quests, the most of any zone.", ["questie", "rxp"]],
      [10, 10, "Stormwind", "Train, do your class quest, and spend your first talent point. Take <strong>Report to Gryan Stoutmantle</strong> to head to Westfall.", ["rxp"]],
      [10, 14, "Westfall: Sentinel Hill", "Harvest Watchers, Defias, gnolls and murlocs. Pick up every Deadmines quest at Sentinel Hill now, even though you'll do them later. Westfall has 13 new quests.", ["questie", ["tomtom", "/way Westfall 56 47"]]],
      [14, 17, "Loch Modan or Redridge", "Take the Deeprun Tram to Ironforge for Loch Modan (Thelsamar) and the Hall of Thanes, or walk east to Lakeshire in Redridge. Both are fine. Loch Modan pairs with the dungeon.", ["questie", "rxp"]],
      [17, 20, "Westfall: the Deadmines", "Back to Sentinel Hill with a group for the Deadmines. Turn in the chain, then head to Darkshore by the new Stormwind Harbor boat or to Duskwood.", ["dj", "bis"], { dungeon: "vc" }]
    ]},
    coldridge: { name: "Coldridge Valley → Dun Morogh → Loch Modan", faction: "Alliance", steps: [
      setup,
      [1, 6, "Coldridge Valley", "Start at Anvilmar. The second leg of <strong>Coldridge Valley Mail Delivery</strong> (to Grelin Whitebeard) gives the gathering manual. Clear the trolls, then take the tunnel north to Kharanos.", ["questie"]],
      [6, 12, "Kharanos and Dun Morogh", "Set your hearth in Kharanos. Forever reportedly adds a snow-and-ice chain around 8 and new quests at Gol'Bolar Quarry around 10. <strong>Kill Dark Iron Spies</strong> while you're here until one drops the Dark Iron Map: it starts <em>Old Ironforge Incursion</em> for the Hall of Thanes. Train in Ironforge at 10.", ["questie", "rxp"], { verify: "Snow chain and quarry quests are beta reports." }],
      [12, 15, "Loch Modan: Thelsamar", "Run east through the tunnel at the gate. Thelsamar is your hub; grab the flight path.", ["questie", ["tomtom", "/way Loch Modan 35 47"]]],
      [14, 17, "Hall of Thanes (new)", "Group up under Ironforge. Pick up Important Heirlooms from Thom Filch outside, bring the Dark Iron Map, and hand in the vault tablet to Magni.", ["dj", "bis", "dbm"], { dungeon: "thanes" }],
      [16, 20, "Westfall or Darkshore", "Tram to Stormwind and go to Westfall (Sentinel Hill), or take the Menethil/Stormwind boat to Darkshore. Finish with the Deadmines around 18–20.", ["questie", "rxp", "dj"], { dungeon: "vc" }]
    ]},
    shadowglen: { name: "Shadowglen → Teldrassil → Darkshore", faction: "Alliance", steps: [
      setup,
      [1, 6, "Shadowglen", "Clear the starting glade under Aldrassil. <strong>The Woodland Protector</strong> gives the gathering manual.", ["questie"]],
      [6, 11, "Dolanaar and Teldrassil", "Set your hearth in Dolanaar. New in Forever: <strong>Escaping Ban'ethil</strong>, an escort back to Dolanaar from the barrow den. Visit Darnassus at 10 to train. Teldrassil has 12 new quests.", ["questie", "rxp"]],
      [11, 15, "Darkshore: Auberdine", "Take the boat from Rut'theran Village. Work north and south from Auberdine.", ["questie", ["tomtom", "/way Darkshore 37 44"]]],
      [14, 17, "Detour: Loch Modan and the Hall of Thanes", "The boat from Auberdine to Menethil and a short run through the Wetlands gets you to Loch Modan, Ironforge and the Hall of Thanes. Speedrunners do this; it also unlocks Eastern Kingdoms flight paths.", ["rxp", "dj"], { dungeon: "thanes" }],
      [17, 20, "Back to Darkshore, then Ashenvale", "Finish Darkshore, then go south to Astranaar in Ashenvale around 19–20. The new Stormwind Harbor ↔ Auberdine boat makes a Deadmines trip easy.", ["questie", "dj"], { dungeon: "vc" }]
    ]},
    valley: { name: "Valley of Trials → Durotar → The Barrens", faction: "Horde", steps: [
      setup,
      [1, 6, "Valley of Trials", "<strong>Galgar's Cactus Apple Surprise</strong> gives the gathering manual. Clear the boars, scorpids and the Burning Blade cave.", ["questie"]],
      [6, 10, "Razor Hill and Durotar", "Set your hearth in Razor Hill. Work Sen'jin Village, the Echo Isles and Tiragarde Keep. Durotar has 16 new quests. Train in Orgrimmar at 10.", ["questie", "rxp"]],
      [10, 14, "The Barrens: the Crossroads", "Walk west to the Crossroads and grab the flight path. Note: one RestedXP-based route takes Orcs and Trolls to Silverpine through the Undercity instead. Either works.", ["questie", ["tomtom", "/way The Barrens 52 30"]], { verify: "Barrens vs Silverpine: sources split." }],
      [13, 16, "Ragefire Chasm", "In Orgrimmar's Cleft of Shadow. Pick up the city quests first.", ["dj", "bis"], { dungeon: "rfc" }],
      [15, 18, "Ruins of Lordaeron (new)", "Take the zeppelin to Tirisfal. Grab The Wrath of Rath'mael in Brill and the Apothecarium quests in the Undercity before going in.", ["dj", "bis", "dbm"], { dungeon: "ruins" }],
      [16, 20, "The Barrens: Ratchet and Wailing Caverns", "Ratchet, the Stagnant Oasis and the south. Do Wailing Caverns from about 17 with the quests from the Crossroads.", ["questie", "dj"], { dungeon: "wc" }]
    ]},
    deathknell: { name: "Deathknell → Tirisfal → Silverpine", faction: "Horde", steps: [
      setup,
      [1, 5, "Deathknell", "<strong>Marla's Last Wish</strong> gives the gathering manual.", ["questie"]],
      [5, 10, "Brill and Tirisfal Glades", "Set your hearth in Brill. Tirisfal is the most changed starting zone: 18 new quests, the new Shadowvale area in the Whispering Forest, and <strong>Bandarion Keep</strong> on Northface Rock in the west. Train in the Undercity at 10.", ["questie", "rxp", ["tomtom", "/way Tirisfal Glades 21.5 48"]]],
      [10, 12, "Finish Tirisfal", "Wrap up the Brill quests and grab The Wrath of Rath'mael for the Ruins of Lordaeron while you're in town.", ["questie"]],
      [12, 16, "Silverpine Forest: The Sepulcher", "Pick up <em>A Frightened Request</em> from Tabitha Heartweaver here for the Ruins.", ["questie", ["tomtom", "/way Silverpine Forest 43 41"]]],
      [15, 18, "Ruins of Lordaeron (new)", "Your home dungeon, right above the Undercity. Grab Light's Justice and The New Plague in the Apothecarium first.", ["dj", "bis", "dbm"], { dungeon: "ruins" }],
      [17, 20, "Finish Silverpine, then the Barrens", "Clean up Silverpine, then take the zeppelin to Durotar and walk to the Crossroads. Ragefire Chasm and Wailing Caverns are both open to you now.", ["questie", "rxp", "dj"], { dungeon: "wc" }]
    ]},
    narache: { name: "Camp Narache → Mulgore → The Barrens", faction: "Horde", steps: [
      setup,
      [1, 6, "Camp Narache", "<strong>A Humble Task</strong> gives the gathering manual.", ["questie"]],
      [6, 10, "Bloodhoof Village and Mulgore", "Set your hearth in Bloodhoof. New: <strong>Kyle's Gone Missing!</strong> and the Skywatcher Plateau (Camp Gev'rek) in the north-west. Mulgore has 20 new quests.", ["questie", "rxp"]],
      [10, 12, "Thunder Bluff and the rest of Mulgore", "Train, then finish Mulgore.", ["questie"]],
      [12, 16, "The Barrens: Crossroads and Camp Taurajo", "Go east. Plainsrunning makes the Barrens far less of a slog than it used to be.", ["questie", ["tomtom", "/way The Barrens 52 30"]]],
      [15, 18, "Ruins of Lordaeron or Ragefire Chasm", "Ruins via the Orgrimmar zeppelin to Tirisfal (quests in Brill and the Undercity), or Ragefire Chasm in Orgrimmar.", ["dj", "bis"], { dungeon: "ruins" }],
      [17, 20, "Wailing Caverns", "With the Crossroads quests. Then keep going in the Barrens or on to Hillsbrad.", ["dj", "dbm"], { dungeon: "wc" }]
    ]}
  };

  /* Zephras Isle: checked against ForeverWisp's Horde Skyborne 1–20 route (updated 5 Nov 2026) */
  var zephrasCore = [
    setup,
    [1, 4, "Zephras Isle: Thendal Grove", "Ailee Farheart starts you with <strong>Coming of Age</strong>. Clear the vuldren and cirrusflies, then the Cirrusfly Queen. For <em>Falling With Style</em>, put Walk on Air on your bar, jump off the Thendal watchtower and use it while falling. <strong>Harvesting Windstones</strong> from Dalia the Collector gives the gathering manual. Windstones work as free health and mana potions, but only on the island.", ["questie", "wisp", ["tomtom", "/way Zephras Isle 42.1 23.5"]]],
    [4, 6, "The ursera dens", "Aetheen of the Gales sends you west: <em>Foul Matriarch</em> (Urs'anah, inside her den) and <em>Aggressive Encroachment</em>. On the way south, do Al'Aketh Thugs at the temple ruins for Hanaa Nightwind.", ["questie", "wisp"]],
    [5, 8, "Shen'dar Village", "Constable Aonda's hub. At Raan Wildwind's campfire, <em>The Great Outdoors</em> teaches camping: /sit for Boosted Rest. He also offers <em>Camping 101</em> for Mining, Cooking and Herbalism. Clear the hippogryph nests and the bandit cave, then infiltrate Falaath Village with the Mark of Akir. Keep the mark; Sania Silverstream replaces it if you lose it. Vulgara the Insatiable is an optional level 8 elite: group up or skip her. Tornadoes give a 40% speed buff.", ["questie", "wisp", ["tomtom", "/way Zephras Isle 45.3 45.3"]]]
  ];
  routes.zephrasA = { name: "Zephras Isle → Stormwind → Westfall", faction: "Alliance", steps: zephrasCore.concat([
    [8, 12, "Valanaar", "Set your hearth at the inn. Finish the island story from the council tower, ending with <em>Confront Lorthuna</em>. Valanaar has trainers, a bank and an auction house.", ["questie", "wisp"], { verify: "Most sources say you leave at 12; one says 13." }],
    [12, 12, "Leave the island", "Skycutter from Valanaar's east dock to Dalaran, then the Skyborne portal in the Sky Enclave to Stormwind. Bolvar gives <strong>Journey to Sentinel Hill</strong>.", ["wisp"], { verify: "Dalaran's Skyborne-only portal: one source." }],
    [12, 15, "Westfall: Sentinel Hill", "You arrive a couple of levels ahead of the zone, which is fine. Grab every Deadmines quest.", ["questie"]],
    [14, 17, "Loch Modan and the Hall of Thanes", "Optional: tram to Ironforge, Loch Modan, and the new Hall of Thanes.", ["dj", "bis"], { dungeon: "thanes" }],
    [16, 20, "Darkshore, Redridge, then Ashenvale", "Take the boat to Darkshore, come back for Redridge, and finish in Ashenvale near 20. Do the Deadmines on the way.", ["questie", "wisp", "dj"], { dungeon: "vc" }]
  ])};
  routes.zephrasH = { name: "Zephras Isle → Brill → Silverpine → The Barrens", faction: "Horde", steps: zephrasCore.concat([
    [8, 12, "Valanaar", "Set your hearth with Donaal Downbreeze at the inn. Report to the upper council room, then to Ayessa Dawnsinger in the Windshaper lodge. Work Aamelia's Windfield Orchard to the west. Riaani's <em>Broken Construct</em> needs three parts: inside Shriekling Den (enter from the south), underwater in Windsong Lake, and by the campfire at the far end of the bandit valley. Then the Strange Hermit, Yorana's eastern watchtower, the turncoat and the Shrine of Akir, ending with Lorthuna.", ["questie", "wisp", ["tomtom", "/way Zephras Isle 62.2 72.6"]], { verify: "Most sources say you leave at 12; one says 13." }],
    [12, 12, "Skycutter to Mulgore, then walk to Orgrimmar", "Take the skycutter from Valanaar's Horde dock to Alaana Stormwalker in Mulgore. Walk through the Crossroads and Razor Hill to Thrall in Orgrimmar, picking up every flight path. In Orgrimmar, choose the reward for Meal Appeal before Favorite Food, and Favorite Food before Rocks to Rests.", ["wisp", ["tomtom", "/way Zephras Isle 58.1 80.3"]], { verify: "ForeverWisp lands you in Mulgore; some guides say Thunder Bluff." }],
    [12, 14, "Zeppelin to Tirisfal: Brill", "Take the zeppelin from Orgrimmar. Brill has the Argent assignments and your Silverpine pickups. Grab <em>The Wrath of Rath'mael</em> for the Ruins of Lordaeron while you're in town.", ["questie", "wisp"]],
    [13, 16, "Silverpine Forest and the Undercity", "Work from The Sepulcher; Deathstalker Erland's escort ends at Rane Yorick. Pick up <em>A Frightened Request</em> from Tabitha Heartweaver for the Ruins, and the Apothecarium quests in the Undercity.", ["questie", "wisp", ["tomtom", "/way Silverpine Forest 43 41"]]],
    [15, 18, "Ruins of Lordaeron (new)", "Right above the Undercity, and you'll have all its quests by now.", ["dj", "bis", "dbm"], { dungeon: "ruins" }],
    [16, 20, "Back to the Barrens", "Zeppelin to Durotar, then the Crossroads. Work through the Barrens, finishing in Stonetalon Mountains and Ratchet around 20. Wailing Caverns from about 17.", ["questie", "wisp", "dj"], { dungeon: "wc" }]
  ])};

  /* ------------------------------------------------------------------ classes */
  var classes = {
    warrior: { name: "Warrior", color: "#c79c6e",
      specs: [["Arms", "dps", "Two-hander, PvP-leaning. 16-point talent: Spearing Strike."], ["Fury", "dps", "Dual wield, the main PvE damage spec. 16-point: Raging Blows. New Reckless Swings and Improved Whirlwind; Flurry is now 3 points."], ["Protection", "tank", "Tank. 16-point: Vanguard (Charge in Defensive Stance). Defensive Stance threat went from 30% to 80% on 2 November."]],
      level: "Protection", levelWhy: "Icy Veins calls Prot the fastest Warrior leveling spec. It's slow until Revenge at 14, then you take hits and keep going. Fury is weak until Flurry and Bloodthirst.",
      endgame: "Fury for damage, Protection to tank, Arms for PvP.",
      talents: { exact: true, rows: [["10–14", "Shield Specialization 5/5"], ["15–17", "Improved Revenge 3/3"], ["18–19", "Your choice: Icy Veins doesn't specify"], ["20–21", "Master of Defense 2/2"], ["25", "Vanguard (the 16-point talent)"]] },
      races: [["orc", "Blood Fury and shorter stuns."], ["human", "Flat crit."], ["undead", "Touch of the Grave and Cannibalize mean less eating."], ["tauren", "More health, War Stomp, Plainsrunning."]],
      milestones: [
        [10, "Defensive Stance class quest", "Your trainer sends you to a race-specific quest giver. It also teaches Taunt and Sunder Armor. Skyborne get a new one: <em>The Skybreaker Bulwark</em> from Seena Skybreaker on Zephras Isle.", ["questie"]],
        [14, "Revenge", "Prot finally feels good. Get a shield with Pawn's help.", ["pawn"]],
        [20, "Dual wield and the armor quest", "Dual Wield unlocks. The level 20 armor quest is Fire Hardened (Alliance) or Brutal (Horde).", ["questie"]]
      ] },
    paladin: { name: "Paladin", color: "#f48cba",
      specs: [["Holy", "heal", "Healer. Divine Favor moved up and a new Oath of Light took row 4 on 2 November."], ["Protection", "tank", "Tank, not limited to 4 targets. 16-point: Swift Judgement. New Seal of Fury, Shieldsworn and Holy Shield moved to row 5."], ["Retribution", "dps", "Melee damage. Judgement no longer uses up your Seal. 31-point is now Unsealed Wrath; Conviction gives up to 6% crit."]],
      level: "Retribution", levelWhy: "Icy Veins calls it very efficient. You barely stop to drink, and the new Judgement keeps your Seal up.",
      endgame: "Holy for single-target and tank healing, Protection to tank. Ret is solid but unproven until raids open.",
      talents: { exact: false, rows: [["10–20", "Benediction (or Deflection for safer solo play), then Improved Judgement/Conviction, Pursuit of Justice, Seal of Command."]] },
      races: [["human", "Flat crit."], ["dwarf", "Hit and Stoneform."], ["undead", "Horde's only Paladin. Cannibalize and Will of the Forsaken."]],
      milestones: [
        [10, "Righteous Fury", "Now learned at 10 instead of 16.", []],
        [12, "Redemption class quest", "Your trainer has a class quest that teaches Redemption.", ["questie"]],
        [20, "Consecration, Exorcism and the weapon quest", "The two-hander quest starts at 20: Verigan's Fist for Alliance, Wolfsbane for Undead (starts at 18, ends around 26).", ["questie", "atlas"]]
      ] },
    hunter: { name: "Hunter", color: "#aad372",
      specs: [["Beast Mastery", "dps", "Pet-focused. 16-point: Summon Hawk. Pets now scale from your gear."], ["Marksmanship", "dps", "Ranged burst. Aimed Shot is now baseline at 20 and no longer shares a cooldown with Arcane Shot."], ["Survival", "dps", "Can now go full melee. 16-point: Counterattack. A Lone Wolf (no pet) option exists."]],
      level: "Beast Mastery", levelWhy: "Every tier list puts it first. The pet tanks, you shoot, and you almost never die.",
      endgame: "All three are damage specs. There's no reliable ranking until raids open on 9 December.",
      talents: { exact: false, rows: [["10–20", "Deadly Aspects first (more damage than Endurance Training), then Pathfinding (moved to row 3) and Improved Revive Pet."], ["25", "Summon Hawk (the 16-point talent), then toward Bestial Wrath."]] },
      races: [["orc", "Command: +5% pet damage."], ["dwarf", "Big Game Hunter and +1% hit."], ["troll", "Beast Slaying and Berserking."], ["nightelf", "Shadowmeld and run speed."]],
      milestones: [
        [10, "Taming the Beast", "Tame three beasts with the Taming Rod, then pick your pet. Open with Concussive Shot from max range before each tame: the channel takes 10 seconds and you can't fight back. Humans have their own set: Rockhide Boar, Gray Forest Wolf, Young Forest Bear.", ["questie"]],
        [20, "Aimed Shot and Aspect of the Cheetah", "Both at 20. Cheetah halves your travel time until 40. Traps now work in combat and share a 30-second cooldown.", []]
      ] },
    rogue: { name: "Rogue", color: "#fff468",
      specs: [["Assassination", "dps", "Poisons. 16-point: Cold Blood, which now works with Mutilate. Mutilate moved to row 7."], ["Combat", "dps", "Sustained melee. 16-point: Flawless Execution. Improved Sinister Strike is now called Efficient Strikes."], ["Subtlety", "dps", "Stealth and bleeds. New 31-point Death Mark; Premeditation moved to row 3."]],
      level: "Combat", levelWhy: "Most damage with the least downtime. Riposte at 20 is a real power spike.",
      endgame: "Combat for dungeons and raids, Subtlety for PvP.",
      talents: { exact: false, rows: [["10–20", "Efficient Strikes, then Precision, then Riposte."], ["25", "Flawless Execution (the 16-point talent), then Blade Flurry."]] },
      races: [["human", "Flat crit."], ["nightelf", "Shadowmeld and Elune's Light."], ["orc", "Blood Fury."], ["undead", "Touch of the Grave and Cannibalize."]],
      milestones: [
        [18, "Poised", "A new passive at 18.", []],
        [20, "Gear check", "Rogues can use one-handed axes now. Compare your daggers and swords with Pawn.", ["pawn", "atlas"]]
      ] },
    priest: { name: "Priest", color: "#ffffff",
      specs: [["Discipline", "heal", "Absorbs, and can deal damage. 16-point: Soul Warding."], ["Holy", "heal", "Raid healer. Binding Heal was replaced by Holy Binding (Flash Heal on others also heals you)."], ["Shadow", "dps", "Ranged damage. 16-point: Vampiric Embrace. Shadow Word: Death now backlashes for 30% of your health."]],
      level: "Shadow", levelWhy: "Wand, Spirit Tap and DoTs: kill, regain mana instantly, repeat.",
      endgame: "Holy for raid healing; Shadow is strong in PvP.",
      talents: { exact: false, rows: [["10–20", "Wand Specialization first, then Spirit Tap 5/5, then down the tree toward Mind Flay."]] },
      races: [["undead", "Cannibalize now restores mana too."], ["troll", "Berserking."], ["dwarf", "Stoneform."], ["gnome", "Expansive Mind and Eureka!."]],
      milestones: [
        [10, "Get a wand", "Your main source of damage until the 30s. Buy one or ask an enchanter for a Lesser Magic Wand.", ["auctionator", "pawn"]],
        [20, "Gear check", "Race spells like Fear Ward and Devouring Plague are now open to every race: check your trainer.", ["pawn"]]
      ] },
    shaman: { name: "Shaman", color: "#0070dd",
      specs: [["Elemental", "dps", "Ranged caster. 16-point: Call of Thunder. Lava Burst was removed on 2 November; Elemental Mastery is now Lightning Mastery."], ["Enhancement", "dps tank", "Melee and off-tank through Rockbiter. 16-point: Stormstrike (150% weapon damage, 6 s cooldown)."], ["Restoration", "heal", "Healer. 16-point: Mana Tide Totem. Riptide is now heal-over-time only."]],
      level: "Enhancement", levelWhy: "The usual pick, but early mana is tight. Some players start in Resto for Water Shield and respec at 25 for Stormstrike.",
      endgame: "Restoration for healing. Elemental is uncertain after Lava Burst was removed.",
      talents: { exact: false, rows: [["10–19", "Early Enhancement points (or Resto toward Water Shield, then respec at 25)."], ["20", "Shamanistic Focus: shocks cost 45% less."], ["25", "Stormstrike (the 16-point talent)."]] },
      races: [["orc", "Blood Fury."], ["troll", "Berserking and regen."], ["tauren", "War Stomp and Plainsrunning."], ["dwarf", "Alliance's only non-Skyborne Shaman. Stoneform and +1% hit."]],
      milestones: [
        [4, "Earth totem quest", "Your first trainer starts it.", ["questie"]],
        [10, "Fire totem quest", "Every Call of Fire now also gives the Totem of Charged Flames relic.", ["questie"]],
        [20, "Water totem quest and Ghost Wolf", "Ghost Wolf is your mount until 40.", ["questie"]]
      ] },
    mage: { name: "Mage", color: "#3fc7eb",
      specs: [["Arcane", "dps", "Arcane Blast. Missile Barrage moved to row 2 on 2 November."], ["Fire", "dps", "Hot Streak is now called Heating Up (needs Pyroblast first). Improved Fireball is now Accelerant."], ["Frost", "dps", "Ice Lance and Fingers of Frost. 16-point: Ice Block. Ice Barrier now also gives +15% Frost damage."]],
      level: "Frost", levelWhy: "Slows and AoE pulls keep you safe and fast. Icy Veins also suggests leveling Arcane and respeccing to Frost around 30.",
      endgame: "No reliable ranking yet; Icy Veins suggests Frost for raids.",
      talents: { exact: false, rows: [["10–20", "Precision 2/2 (now hit on every spell), Wand Specialization, then toward Missile Barrage (row 2), Frostbite, Improved Frostbolt, then Ice Shards and Shatter."]] },
      races: [["gnome", "Eureka! and Expansive Mind."], ["troll", "Berserking."], ["orc", "New Orc Mage: Blood Fury now adds spell power."], ["undead", "Cannibalize restores mana."], ["skyA", "Read Leyline cuts drinking."]],
      milestones: [
        [8, "Polymorph", "Sheep the second mob on every double pull.", []],
        [14, "Arcane Explosion", "AoE starts here.", []],
        [20, "Blink, Evocation, Blizzard, Teleports", "Big level. Teleport to your capital saves hearthstone trips.", []]
      ] },
    warlock: { name: "Warlock", color: "#8788ee",
      specs: [["Affliction", "dps", "DoTs. Curse of Agony is now Bane of Agony. New 51-point channel, Wrack."], ["Demonology", "dps", "Pet power. 16-point talent: Fel Domination (datamine)."], ["Destruction", "dps", "Burst. 16-point: Conflagrate (datamine). Shadow and Flame now 4–20%."]],
      level: "Affliction", levelWhy: "Instant Corruption plus the Voidwalker tanking means you never stop moving.",
      endgame: "Unclear until raids. One source favours Demonology, but none of the strong ones back it yet.",
      talents: { exact: true, rows: [["10–13", "Suppression 4/5"], ["14–18", "Improved Corruption 5/5: Corruption becomes instant"], ["19–21", "Your choice"], ["22–24", "Pandemic 3"], ["25–26", "Nightfall 2"]] },
      races: [["orc", "Command (+5% pet damage) and Blood Fury."], ["undead", "Cannibalize restores mana."], ["gnome", "Expansive Mind and Eureka!."], ["troll", "New Troll Warlock: Berserking."]],
      milestones: [
        [1, "Imp", "Your first demon.", []],
        [10, "Voidwalker quest", "Your trainer starts it. The Voidwalker tanks for you from here.", ["questie"]],
        [20, "Succubus or Incubus", "New in Forever: the level 20 quest lets you pick an Incubus.", ["questie"]]
      ] },
    druid: { name: "Druid", color: "#ff7c0a",
      specs: [["Balance", "dps", "Ranged caster. 16-point: Insect Swarm."], ["Feral", "tank dps", "Bear tank or cat damage. Row 4 is now Lacerate (bear) and Predatory Discipline (cat). Berserk and Tiger's Fury are gone. Bear threat was raised to 115%."], ["Restoration", "heal", "Healer. 16-point: Swiftmend. New talent Bloom; Wild Growth has a 3 s cast."]],
      level: "Feral", levelWhy: "Icy Veins: one of the best for leveling. Racials, procs and consumables now work in forms.",
      endgame: "Feral can tank or deal damage; Restoration heals. Balance is uncertain until raids.",
      talents: { exact: false, rows: [["10–20", "Ferocity first, then Feral Instinct and Feral Swiftness."], ["20+", "Feral Charge, Savage Fury, Sharpened Claws, then toward Lacerate."]] },
      races: [["tauren", "Plainsrunning, War Stomp, more health."], ["nightelf", "Shadowmeld stacks with Prowl."], ["skyA", "Bear Form quest stays on Zephras Isle, the fastest version."], ["skyH", "Same island Bear Form quest, plus Skysight."]],
      milestones: [
        [10, "Bear Form quest", "Night Elves go through Darnassus to Moonglade, Tauren through Thunder Bluff. Skyborne do <em>Strength and Mercy</em> from Urs'endris on Zephras Isle, the fastest version.", ["questie"]],
        [16, "Aquatic Form quest", "Unchanged from Classic.", ["questie"]],
        [20, "Cat Form quest", "New: Cat Form is now a class quest, <em>The Great Cat Spirit</em>, in Moonglade's Stormrage Barrow Den. Prowl and Omen of Clarity also come at 20.", ["questie"]]
      ] }
  };

  /* ------------------------------------------------------------------ race + class specifics
     [level, title, html, use[], verifyNote, replacesGenericMilestoneAtLevel (defaults to level)] */
  var combos = {
    "undead-paladin": [
      [1, "Aramis Hammerhand in Deathknell", "Your first trainer is in the Deathknell chapel. The chain runs <em>A Difficult Path → Rediscovering the Light → Coming to Terms → Continue Your Training</em>.", ["questie"]],
      [8, "A Second Home: Bandarion Keep", "Go to the new Paladin hub on Northface Rock in western Tirisfal. Hilda the Breaker trains you. The Keep has a trainer, forge and stable but no inn or mailbox. Shari Stilwell in Brill and Garen Largo in the Undercity's War Quarter also train you. Orgrimmar and Thunder Bluff have no Paladin trainer.", [["tomtom", "/way Tirisfal Glades 21.5 48"]]],
      [12, "A Lesson in Divinity", "Bring 10 Linen Cloth to learn Redemption.", ["questie"]],
      [18, "Wolfsbane", "Your two-hander chain starts at 18 and ends around 26.", ["questie", "atlas"]]
    ],
    "dwarf-shaman": [
      [1, "Teo Hammerstorm in Anvilmar", "Your first trainer in Coldridge.", []],
      [4, "Earth totem: the Spirit Stone", "Teo wants Frostmane pendants, then sends you up the Spirit Stone path.", [["tomtom", "/way Dun Morogh 25 69"]]],
      [10, "Fire totem", "Bruegs Kindleborn in eastern Dun Morogh, then Braldir Ashmantle in Loch Modan.", ["questie"]],
      [20, "Water totem", "Norric Lochthane in Loch Modan, then Hervdana Saegrund in the Wetlands. The chain also visits Redridge, Ashenvale and Westfall.", ["questie"]]
    ],
    "skyH-shaman": [
      [3, "Earth totem on the island", "Windshaper Boro in Thendal gives it at level 3.", ["questie"], null, 4],
      [10, "Fire totem on the island", "Aarnor Galestrike in Shen'dar, then Olariaan Swiftburn, ending in a timed torch run to Valanaar. Do it before you leave at 12.", ["questie"]],
      [20, "Water totem", "Reportedly uses the Horde chain through Brine near Ratchet.", ["questie"], "Sources disagree on the Skyborne Water quest."]
    ],
    "skyH-hunter": [
      [1, "The Way of the Hunter", "Rorian sends you to Tai'ree Farsight in the middle of Thendal Grove, your first Hunter trainer.", [["tomtom", "/way Zephras Isle 42.5 23.7"]]],
      [10, "Taming the Beast in Valanaar", "Quel'ana Quickgale on the west side of Valanaar hands you three Taming Rods in turn: a <strong>Windsong Crawler</strong> in the water just north of town, an <strong>Ornery Galestrider</strong> in the Gustberry Lowlands, then a <strong>Vuldren Alpha</strong> just outside Valanaar. Open with Concussive Shot from max range, then channel the rod; you can't fight back for 10 seconds. Finish with <em>Training the Beast</em> from Quel'dora beside her, then tame your own pet.", [["tomtom", "/way Zephras Isle 59.6 72.6"]]]
    ],
    "skyA-hunter": [
      [1, "The Way of the Hunter", "Rorian sends you to Tai'ree Farsight in the middle of Thendal Grove, your first Hunter trainer.", [["tomtom", "/way Zephras Isle 42.5 23.7"]]],
      [10, "Taming the Beast in Valanaar", "Quel'ana Quickgale on the west side of Valanaar hands you three Taming Rods in turn: a <strong>Windsong Crawler</strong> in the water just north of town, an <strong>Ornery Galestrider</strong> in the Gustberry Lowlands, then a <strong>Vuldren Alpha</strong> just outside Valanaar. Open with Concussive Shot from max range, then channel the rod; you can't fight back for 10 seconds. Finish with <em>Training the Beast</em> from Quel'dora beside her, then tame your own pet.", [["tomtom", "/way Zephras Isle 59.6 72.6"]]]
    ],
    "skyA-warrior": [[10, "The Skybreaker Bulwark", "Your Defensive Stance quest is on the island, from Seena Skybreaker.", ["questie"]]],
    "skyH-warrior": [[10, "The Skybreaker Bulwark", "Your Defensive Stance quest is on the island, from Seena Skybreaker.", ["questie"]]],
    "human-hunter": [[1, "A new combo", "Your first Hunter trainer is in Northshire, then Goldshire and Stormwind. Your taming set at 10 is a Rockhide Boar, Gray Forest Wolf and Young Forest Bear.", []]],
    "orc-mage": [[1, "A new combo", "You train with the other casters in the Valley of Trials, then Razor Hill and Orgrimmar. Blood Fury now adds spell power: use it on every tough pull.", [], "Trainer names come from one source."]],
    "troll-warlock": [[1, "A new combo", "You share the Orc Warlock trainers in the Valley of Trials and Orgrimmar. Your Voidwalker quest is in Orgrimmar.", [], "Trainer names come from one source."]],
    "gnome-priest": [[1, "A new combo", "Your trainer is in Anvilmar with the other Coldridge classes. Your race spell is Confounding Flash, and you get Contingency Plan.", []]]
  };

  /* level-gated reminders that apply to every combo */
  var common = [
    [10, "First talent point and a gear check", "Spend your point (the planner on the class page shows where). Open <code>/pawn</code> and check that the scale matches your spec. Look up the first dungeon you'll run in AtlasLoot or <code>/bis</code> and note one item to chase.", ["pawn", "atlas", "bis"]],
    [13, "Dungeon prep", "Before every dungeon: <code>/dj</code> for bosses and quests, <code>/bis</code> for the map (the client has none), DBM and ForeverThreat on. The in-game Group Finder lists groups but doesn't teleport you, so whisper and walk.", ["dj", "bis", "dbm", "threat"]],
    [20, "Level 20 checkpoint", "Gear check with Pawn, train, and empty your bags at the Auction House. If the RestedXP free route has run out, switch to Guidelime or come back here: the 20–30 guide comes next.", ["pawn", "auctionator", "guidelime"]]
  ];

  return { addons: addons, races: races, classes: classes, routes: routes, combos: combos, common: common, dungeons: dungeons, updated: "7 November 2026", patch: "1.60.1" };
})();
