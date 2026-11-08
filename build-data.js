/* Forever Field Guide: professions, profession pairs per class, and race tiers per class.
   Extends window.FOREVER (load after guide-data.js).
   Professions checked against Wowhead /forever guides, Icy Veins and Warcraft Tavern on 2026-11-08
   (patch 1.60.1, including the 6 Nov hotfixes). Race tiers are our read of the Forever racials. */
(function (F) {
  "use strict";

  /* ------------------------------------------------------------------ professions */
  F.professions = {
    herbalism: { name: "Herbalism", type: "gather", icon: "🌿",
      makes: "Herbs for Alchemy and now First Aid, which makes healing potions in Forever.",
      why: "Wowhead calls it a great way to make gold while leveling: more professions use herbs now. Pairs with Alchemy.",
      forever: ["Earthroot unlocks at skill 15; starting zones have weak nodes like Wilted Peacebloom.", "Legacy perk Bountiful Harvest adds extra Scarce materials."],
      camp: ["Incense Candle", "Greenhouse", "Seed Hybridizer", "Intellect (like Arcane Intellect)"],
      route: [["1–70", "any starting zone"], ["70–115", "Darkshore, Loch Modan, Silverpine"], ["115–170", "Hillsbrad, Wetlands, Stonetalon"], ["170–205", "Stranglethorn, Arathi"]] },
    mining: { name: "Mining", type: "gather", icon: "⛏️",
      makes: "Ore and bars for Blacksmithing and Engineering.",
      why: "Wowhead calls it an excellent source of gold with no upfront cost. Smelting carries you to 185 without hunting veins.",
      forever: ["No Stamina perk: Forever has no passive profession bonuses.", "Bountiful Harvest Legacy perk applies."],
      camp: ["Lodestone", "Rock Garden (spawns an ore node)", "Molten Foundry", "Attack power (like Blessing of Might)"],
      route: [["1–65", "smelt Copper (130 ore). Save about 60 bars for Bronze"], ["65–75", "smelt Tin (60 ore)"], ["75–100", "Bronze from the saved bars"], ["100–125", "smelt Silver (70)"], ["125–140", "smelt Iron (35)"], ["140–155", "no smelt: mine veins"], ["155–185", "smelt Gold (60)"]] },
    skinning: { name: "Skinning", type: "gather", icon: "🔪",
      makes: "Leather and hides for Leatherworking.",
      why: "You skin what you already killed, so it costs no time. The natural partner for Leatherworking, or for any melee class that kills beasts all day.",
      forever: ["Bountiful Harvest Legacy perk applies."],
      camp: ["Camp Chair", "Field Guide", "Trapper's Workbench", "Crit (like Leader of the Pack)"] },
    alchemy: { name: "Alchemy", type: "craft", icon: "⚗️",
      makes: "Potions, elixirs and flasks.",
      why: "Raid consumables and mana for healers. The usual endgame pick for healers and Druids, who can now drink potions while shapeshifted.",
      forever: ["Artisan Alchemy trainer in the new Emerald Sanctuary; Alchemy trainers in Dalaran (Alterac)."],
      camp: ["Mana Well", "Fermenter", "Alchemy Laboratory", "Mana regen (like Blessing of Wisdom)"],
      verify: "Unclear whether Alchemy still makes healing potions now that First Aid does." },
    blacksmithing: { name: "Blacksmithing", type: "craft", icon: "🔨",
      makes: "Plate and mail armor, weapons, sharpening stones.",
      why: "Bind-on-pickup leveling pieces like Sentinel's Sabatons, and new Forever weapons such as Bleakwood Hew, Blood Talon and Darkspear.",
      forever: ["Armorsmith or Weaponsmith, then Master Axesmith, Hammersmith or Swordsmith.", "Arcanite Blacksmith Hammer: a throwing weapon with a stun proc that also counts as your hammer."],
      camp: ["Sharpening Wheel", "Anvil (Deadmines)", "Master Forge", "Strength or attack power"] },
    enchanting: { name: "Enchanting", type: "craft", icon: "✨",
      makes: "Enchants, wands, and now spell power on necklaces.",
      why: "Disenchant the greens you don't wear, so it needs no gatherer. The Brilliant Wand is a leveling upgrade for casters.",
      forever: ["Reportedly crafts staves and off-hands too."],
      camp: ["Enchanted Lute", "Arcane Salvager (better disenchants)", "Arcane Forge", "All stats (like Mark of the Wild)"] },
    engineering: { name: "Engineering", type: "craft", icon: "⚙️",
      makes: "Guns, scopes, ammo, bombs and gadgets.",
      why: "The PvP and utility pick, and the only crafter that makes guns. Many new Forever items work for non-engineers, so it sells too.",
      forever: ["New bind-on-pickup Emergency Field Cloak trinket: brief invisibility.", "New belts at 175 and goggles at 200 in every armor type. Both need the Anarchist's Workbench and Merchant's Favor recipes.", "Gnomish (Tinkmaster Overspark, Ironforge) or Goblin (Nixx Sprocketspring, Tanaris) by quest. Goblin recipes also sold in Riverglades."],
      camp: ["Reagent Bot", "Repair Bot", "Anarchist's Workbench", "Vendor and repairs at camp, no buff"] },
    leatherworking: { name: "Leatherworking", type: "craft", icon: "🧵",
      makes: "Leather and mail armor, armor kits, quivers.",
      why: "Its camp tent adds rested XP, which is the best leveling camp object. Wisdom's Leather Boots are a bind-on-pickup piece.",
      forever: ["Dragonscale, Elemental or Tribal specialization.", "Tanning Rack (tier 2) now needs skill 125 after the 6 Nov hotfix."],
      camp: ["Camp Tent", "Tanning Rack", "Sewing Machine", "Rested XP, up to 5% of a level"] },
    tailoring: { name: "Tailoring", type: "craft", icon: "🪡",
      makes: "Cloth armor and bags, including the new reagent bags.",
      why: "Cloth drops while you level, so it needs no gatherer. Bind-on-pickup Novice Arcanist's Sash (spell power) and Novice Ardent's Sash (healing) at level 10.",
      forever: ["Linen Reagent Bag (6 slots) and Mageweave Reagent Bag (12) for the new reagent bag slot."],
      camp: ["Faction Banner", "Spinning Wheel", "Loom", "Spirit (like Divine Spirit)"] },
    cooking: { name: "Cooking", type: "secondary", icon: "🍖",
      makes: "Food. Every cooked meal now gives Well Fed: +5% XP from kills for 15 minutes.",
      why: "Free slot and a straight XP boost. Food also sells well because the buff is short.",
      forever: ["Expert (150–225) is a cookbook: Shandrina in Ashenvale (Alliance), Wulan in Shadowprey Village (Horde).", "Artisan is the quest Clamlette Surprise from Dirge Quikcleave in Gadgetzan."],
      camp: ["Basic Campfire", "Journeyman Campfire (Wailing Caverns) / Cookie's Feast (Deadmines)", "Expert Campfire / Iron Oven", "Hosts the camp"],
      route: [["1–50", "Brilliant Smallfish (52 fish)"], ["50–100", "Longjaw Mud Snapper (55)"], ["100–150", "Bristle Whisker Catfish (55)"], ["175+", "Mithril Head Trout (55)"]] },
    firstaid: { name: "First Aid", type: "secondary", icon: "🩹",
      makes: "Bandages, and now healing potions: Minor (Peacebloom), Lesser (Briarthorn) and Healing (Bruiseweed).",
      why: "Free slot. Potions and bandages mean less sitting to eat.",
      forever: ["New Curatives: Simple Poultice cures diseases, Woolen Tourniquet stops bleeds (out of combat).", "Legacy perk Field Medicine shortens Recently Bandaged."],
      camp: ["First Aid Kit", "Toxin Study", "Plague Doctor's Laboratory", "Stamina (like Power Word: Fortitude)"] },
    fishing: { name: "Fishing", type: "secondary", icon: "🎣",
      makes: "Fish for Cooking.",
      why: "Feeds Cooking. Its top camp buff is the strongest one.",
      forever: [],
      camp: ["Fish Bowl", "Fishing Rack", "Fishing Hut", "8% all stats (like Blessing of Kings)"] }
  };

  /* ------------------------------------------------------------------ profession pairs per class
     level: the pair to level with. end: [label, [p1, p2], why] at 60. */
  var P = {
    warrior: { level: ["blacksmithing", "mining"], levelWhy: "Make your own plate and weapons; Mining feeds it.",
      end: [["Any spec", ["engineering", "mining"], "Bombs, gadgets and the new goggles and belts. Best for PvP and raids."]] },
    paladin: { level: ["blacksmithing", "mining"], levelWhy: "Plate and two-handers you make yourself.",
      end: [["Protection, Retribution", ["engineering", "mining"], "Gadgets and new Engineering armor."], ["Holy", ["alchemy", "herbalism"], "Mana potions and flasks for raid healing."]] },
    hunter: { level: ["leatherworking", "skinning"], levelWhy: "You kill beasts all day: skin them and make your own mail and leather.",
      end: [["Any spec", ["engineering", "mining"], "Engineers make the guns and scopes Hunters want."]] },
    rogue: { level: ["leatherworking", "skinning"], levelWhy: "Leather armor from the beasts you kill.",
      end: [["PvP and general", ["engineering", "mining"], "Bombs, the invisibility cloak trinket and new goggles."], ["Raids only", ["alchemy", "herbalism"], "Raid consumables."]] },
    priest: { level: ["tailoring", "enchanting"], levelWhy: "Bind-on-pickup sashes and the Brilliant Wand. Cloth drops while you level, so no gatherer needed.",
      end: [["Healing", ["tailoring", "enchanting"], "Keep both for raid healing."], ["Shadow PvP", ["tailoring", "engineering"], "Swap Enchanting for Engineering's gadgets."]] },
    shaman: { level: ["leatherworking", "skinning"], levelWhy: "Mail and leather from what you kill.",
      end: [["Restoration, Elemental", ["alchemy", "herbalism"], "Mana potions and flasks."], ["Enhancement", ["engineering", "mining"], "Gadgets and new Engineering armor."]] },
    mage: { level: ["tailoring", "enchanting"], levelWhy: "Novice Arcanist's Sash and the Brilliant Wand; Icy Veins recommends this pair.",
      end: [["Raids", ["tailoring", "enchanting"], "Spell power crafts."], ["PvP", ["tailoring", "engineering"], "Gadgets for PvP."]] },
    warlock: { level: ["tailoring", "enchanting"], levelWhy: "Spell power sash and wand early, no gatherer needed.",
      end: [["Raids", ["tailoring", "enchanting"], "Spell power crafts."], ["Consumables", ["alchemy", "herbalism"], "Make your own raid potions."]] },
    druid: { level: ["leatherworking", "skinning"], levelWhy: "Leather from what you kill, and the Camp Tent's rested XP.",
      end: [["Any spec", ["alchemy", "herbalism"], "Druids can now drink potions in forms."]] }
  };
  Object.keys(P).forEach(function (c) { F.classes[c].profs = P[c]; });

  /* racial nudges that change the pick for a specific race */
  F.raceProf = {
    gnome: ["engineering", "Engineering Specialization: engineering devices fail and backfire 20% less often."],
    tauren: ["herbalism", "Cultivation grows or duplicates an herb, so Herbalism gets a bonus copy."]
  };
  F.goldPair = ["mining", "herbalism", "Want gold first? Wowhead's pairing guide says take two gatherers in launch week: the auction house starts empty, and Mining + Herbalism has the most buyers."];

  /* ------------------------------------------------------------------ race tiers per class: 3 top, 2 strong, 1 fine */
  var T = {
    warrior: { orc: [3, "Blood Fury: +10% attack power for 15 s, plus shorter stuns."], human: [3, "Ruthless: +1% crit, always on. Will to Survive breaks stuns."],
      dwarf: [2, "+1% hit, +5% damage to beasts while leveling, Stoneform for bleeds."], troll: [2, "Berserking burst and regen that keeps going in combat."],
      undead: [2, "Touch of the Grave heals you; Cannibalize cuts eating."], tauren: [2, "+5% health and War Stomp for tanking; Plainsrunning for travel."],
      skyA: [2, "+2% haste always on, and a glide."], skyH: [2, "+2% haste and Skysight run speed."],
      nightelf: [1, "Elune's Light is a crit burst but nothing is always on."], gnome: [1, "Eureka! burst and Escape Artist, little else for melee."] },
    paladin: { human: [3, "Ruthless crit for Ret, +10% Spirit for Holy."], dwarf: [3, "+1% hit, Stoneform, +5% to beasts while leveling."],
      undead: [3, "Horde's only Paladin. Cannibalize restores health and mana."] },
    hunter: { orc: [3, "Command: +5% pet damage. Blood Fury."], dwarf: [3, "+1% hit and +5% damage to beasts."], troll: [3, "+5% to beasts and Berserking attack speed."],
      nightelf: [2, "Shadowmeld drops aggro; extra run speed."], human: [2, "Flat +1% crit."], tauren: [2, "Plainsrunning, extra health, War Stomp to escape."],
      skyA: [2, "+2% haste speeds up auto shot."], skyH: [2, "+2% haste and Skysight."] },
    rogue: { human: [3, "Flat +1% crit."], nightelf: [3, "Shadowmeld is a second stealth; Elune's Light burst."], orc: [3, "Blood Fury, and stuns don't last as long."],
      undead: [3, "Will of the Forsaken for PvP, Touch of the Grave."], gnome: [2, "Escape Artist; Eureka! cuts energy costs."], dwarf: [2, "+1% hit and Stoneform."],
      troll: [2, "Berserking."], skyA: [2, "+2% haste."], skyH: [2, "+2% haste and Skysight."] },
    priest: { undead: [3, "Cannibalize restores mana: fewer drink breaks for Shadow."], troll: [3, "Berserking cast speed."], human: [3, "+10% Spirit means more regen and better Spirit Tap."],
      gnome: [2, "+5% mana and Eureka!."], dwarf: [2, "Stoneform and +1% hit."], nightelf: [1, "Shadowmeld only."] },
    shaman: { orc: [3, "Blood Fury now adds spell power too, good for every spec."], troll: [3, "Berserking for casting and melee."], tauren: [2, "War Stomp, +5% health, Plainsrunning."],
      dwarf: [2, "Alliance's only Shaman. +1% hit and Stoneform."], skyH: [2, "+2% haste."] },
    mage: { gnome: [3, "Eureka! and +5% mana."], troll: [3, "Berserking cast speed."], orc: [3, "Blood Fury now adds spell power."],
      undead: [2, "Cannibalize restores mana; Will of the Forsaken in PvP."], human: [2, "Flat +1% crit."], skyA: [2, "+2% haste and Read Leyline regen."] },
    warlock: { orc: [3, "Command (+5% pet damage) and Blood Fury."], undead: [3, "Cannibalize restores mana; Will of the Forsaken."], gnome: [2, "Eureka! and +5% mana."],
      troll: [2, "Berserking."], human: [2, "Crit and Spirit."] },
    druid: { tauren: [3, "Plainsrunning, +5% health for bears, War Stomp."], nightelf: [2, "Shadowmeld stacks with Prowl."],
      skyA: [2, "Fastest Bear Form quest, +2% haste, Read Leyline regen."], skyH: [2, "Same island Bear Form quest, +2% haste, Skysight."] }
  };
  Object.keys(T).forEach(function (c) { F.classes[c].tiers = T[c]; });
  F.TIER = { 3: "Top pick", 2: "Strong", 1: "Fine" };

  /* fix: Forever's Gnome racial no longer gives +15 Engineering */
  F.races.gnome.racials[3] = ["Engineering Specialization", "engineering devices fail and backfire 20% less often."];

  /* profession steps for the leveling guide; {p1} {p2} are filled per class */
  F.profSteps = [
    [5, "Train your crafting profession", "Crafting opens at level 5. For a {class}, level with <strong>{p1} + {p2}</strong>: {why} {race}", ["auctionator"]],
    [5, "Cooking and First Aid", "Both are free, so take them now. Every cooked meal gives <strong>+5% XP from kills</strong> for 15 minutes, and First Aid now makes healing potions. At skill 20 the starting-zone quest <em>Camping 101</em> teaches your first camp object.", []],
    [10, "Journeyman professions", "Journeyman crafting (to 150) unlocks at 10, and so does Expert gathering. Train both at a city trainer. Bind-on-pickup leveling crafts start here, like the Novice Arcanist's Sash and Wisdom's Leather Boots.", ["auctionator"]]
  ];
})(window.FOREVER);
