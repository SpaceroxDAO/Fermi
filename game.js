/* ==========================================
   THE GREAT SILENCE - COSMIC GARDENER
   A Fermi Paradox Simulation Game
   ========================================== */

// ========== GAME STATE ==========
const GameState = {
  phase: 'intro',
  selectedFilters: [],
  entropyBudget: 60,
  entropySpent: 0,
  truthConditions: {
    A: 0, // Silence (hidden from player)
    B: 0, // Universality (hidden from player)
    C: 0, // Variance (hidden from player)
    D: 0, // Scale/Longevity (hidden from player)
    E: 0  // Logic (hidden from player)
  },
  currentCategory: 'physical',
  civilization: {
    id: null, // Unique civilization number
    stage: 'MOLTEN', // MOLTEN, WATER, GREEN, CITIES, SATELLITES, DYSON
    resilience: 50,
    age: 0,
    stageProgress: 0
  },
  simulationLog: [],
  outcome: null,
  failureReasons: []
};

// ========== 50 ATTRIBUTE CARDS WITH ASCII ART ==========
const AttributeCards = [
  // CATEGORY 1: PHYSICAL FOUNDATIONS (10 cards)
  {
    id: 1,
    category: 'physical',
    name: 'Inverse-Square Spike',
    cost: 9,
    condition: 'A',
    art: `<div class="pixel-art">
<div class="pixel-row">░░▓▓▓▓▓░░</div>
<div class="pixel-row">░▓▓╳╳╳▓▓░</div>
<div class="pixel-row">▓▓╳⚡╳▓▓</div>
<div class="pixel-row">▓╳⚡📡⚡╳▓</div>
<div class="pixel-row">▓▓╳⚡╳▓▓</div>
<div class="pixel-row">░▓▓╳╳╳▓▓░</div>
<div class="pixel-row">░░▓▓▓▓▓░░</div>
</div>`,
    logic: 'Radio waves dissipate at a much higher rate. Interstellar comms become white noise within 1 light-year.',
    tip: 'Prevents detection across distances.',
    isRedHerring: false
  },
  {
    id: 2,
    category: 'physical',
    name: 'The Iron Desert',
    cost: 8,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">▓▓░░░░▓▓</div>
<div class="pixel-row">▓⛏️░░⛏️▓</div>
<div class="pixel-row">░░🔒Fe🔒░░</div>
<div class="pixel-row">░⚙️░✗░⚙️░</div>
<div class="pixel-row">▓▓░░░░▓▓</div>
</div>`,
    logic: 'Heavy elements (needed for tech) are rare. Civs get stuck in a "Bronze Age" forever.',
    tip: 'Limits technological advancement timelines.',
    isRedHerring: false
  },
  {
    id: 3,
    category: 'physical',
    name: 'High-G Threshold',
    cost: 7,
    condition: 'C',
    art: `<div class="pixel-art">
<div class="pixel-row">▼▼▼▼▼▼▼▼</div>
<div class="pixel-row">░▼▼▼▼▼▼░</div>
<div class="pixel-row">░░🚀▼▼░░</div>
<div class="pixel-row">░░░▼▼░░░</div>
<div class="pixel-row">═══════</div>
</div>`,
    logic: 'Planet gravity is 3x Earth\'s. Chemical rockets are physically incapable of reaching orbit.',
    tip: 'Works regardless of species differences.',
    isRedHerring: false
  },
  {
    id: 4,
    category: 'physical',
    name: 'Isotope Instability',
    cost: 6,
    condition: 'E',
    art: `<div class="pixel-art">
<div class="pixel-row">░░░☢️░░░</div>
<div class="pixel-row">░▓💥▓░</div>
<div class="pixel-row">▓💥⚛️💥▓</div>
<div class="pixel-row">░▓💥▓░</div>
<div class="pixel-row">░░░⚠️░░░</div>
</div>`,
    logic: 'Fissile materials are highly volatile. Nuclear power almost always leads to planetary disaster.',
    tip: 'Based on known physics principles.',
    isRedHerring: false
  },
  {
    id: 5,
    category: 'physical',
    name: 'The Great Cold',
    cost: 5,
    condition: 'B',
    art: `<div class="pixel-art">
<div class="pixel-row">❄️░░░░❄️</div>
<div class="pixel-row">░░🧬?░░</div>
<div class="pixel-row">░⏱️❄️⏱️░</div>
<div class="pixel-row">❄️░░░░❄️</div>
</div>`,
    logic: 'Background radiation is lower. Chemical evolution is 10x slower; life rarely reaches complexity.',
    tip: 'Universal constant affecting all life.',
    isRedHerring: false
  },
  {
    id: 6,
    category: 'physical',
    name: 'Magneto-Static Fog',
    cost: 5,
    condition: 'A',
    art: `<div class="pixel-art">
<div class="pixel-row">░░☀️⚡░░</div>
<div class="pixel-row">⚡⚡⚡⚡⚡</div>
<div class="pixel-row">░📡╳╳╳░</div>
<div class="pixel-row">⚡⚡⚡⚡⚡</div>
</div>`,
    logic: 'Constant solar flares create a "static" blanket around planets, blocking outgoing signals.',
    tip: 'Masks electromagnetic transmissions.',
    isRedHerring: false
  },
  {
    id: 7,
    category: 'physical',
    name: 'Kessler Magnet',
    cost: 4,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">•░•░•░•░•</div>
<div class="pixel-row">░🛰️💥🛰️░</div>
<div class="pixel-row">•💥•💥•</div>
<div class="pixel-row">•░•░•░•░•</div>
</div>`,
    logic: 'High orbital debris density. The first satellite launch triggers a cascade that traps them for eons.',
    tip: 'Long-lasting barrier to expansion.',
    isRedHerring: false
  },
  {
    id: 8,
    category: 'physical',
    name: 'Diluted Uranium',
    cost: 4,
    condition: 'C',
    art: `<div class="pixel-art">
<div class="pixel-row">░░░U?░░░</div>
<div class="pixel-row">░⛏️▓▓⛏️░</div>
<div class="pixel-row">▓▓💨💨▓▓</div>
<div class="pixel-row">░░░░░░░░</div>
</div>`,
    logic: 'Makes the "Atomic Age" incredibly difficult to start, favoring long-term coal/oil stagnation.',
    tip: 'Affects civilizations differently.',
    isRedHerring: false
  },
  {
    id: 9,
    category: 'physical',
    name: 'Low-Density Vacuum',
    cost: 3,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">∅∅∅∅∅∅∅</div>
<div class="pixel-row">→→→→→?</div>
<div class="pixel-row">∅∅∅∅∅∅∅</div>
</div>`,
    logic: 'Space is "emptier." Ion drives and solar sails provide 90% less thrust.',
    tip: 'Constrains propulsion methods over time.',
    isRedHerring: false
  },
  {
    id: 10,
    category: 'physical',
    name: 'Star-Clock Decay',
    cost: 7,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">░░☀️☀️░░</div>
<div class="pixel-row">░⏱️↓⏱️░</div>
<div class="pixel-row">⚰️▓▓▓⚰️</div>
<div class="pixel-row">░░░░░░░░</div>
</div>`,
    logic: 'Stars in this universe burn out 20% faster. Time for evolution is cut short.',
    tip: 'Limits temporal windows for development.',
    isRedHerring: false
  },

  // CATEGORY 2: BIOLOGICAL ANCHORS (10 cards)
  {
    id: 11,
    category: 'biological',
    name: 'Mitochondrial Ego',
    cost: 8,
    condition: 'B',
    art: `<div class="pixel-art">
<div class="pixel-row">░🦠░╳░🦠░</div>
<div class="pixel-row">╳░╳🤝╳░╳</div>
<div class="pixel-row">░🦠░╳░🦠░</div>
</div>`,
    logic: 'Simple cells never learn to cooperate. Life stays as "sludge" for 5 billion years.',
    tip: 'Applies to all carbon-based life.',
    isRedHerring: false
  },
  {
    id: 12,
    category: 'biological',
    name: 'The Oxygen Ceiling',
    cost: 6,
    condition: 'C',
    art: `<div class="pixel-art">
<div class="pixel-row">O₂ ▓▓ O₂</div>
<div class="pixel-row">░🧠↓🧠░</div>
<div class="pixel-row">⚡?✗?⚡</div>
</div>`,
    logic: 'Atmosphere cannot support large, energy-hungry brains. High IQ is biologically "expensive."',
    tip: 'Variable impact on different species.',
    isRedHerring: false
  },
  {
    id: 13,
    category: 'biological',
    name: 'Short Telomeres',
    cost: 5,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">🧬━━━⏱️</div>
<div class="pixel-row">▓▓⚠️⚠️▓▓</div>
<div class="pixel-row">░💀░░💀░</div>
</div>`,
    logic: 'Intelligent life dies of old age by 20. Wisdom cannot be passed down; tech never compounds.',
    tip: 'Persistent across generations.',
    isRedHerring: false
  },
  {
    id: 14,
    category: 'biological',
    name: 'The Boredom Gene',
    cost: 7,
    condition: 'A',
    art: `<div class="pixel-art">
<div class="pixel-row">░💭💭💭░</div>
<div class="pixel-row">▓🎨▓🎨▓</div>
<div class="pixel-row">░🚀✗✗░</div>
</div>`,
    logic: 'Intelligence evolves as a tool for "Internal Simulation" (imagination) rather than "External Mastery."',
    tip: 'Reduces observable expansion.',
    isRedHerring: false
  },
  {
    id: 15,
    category: 'biological',
    name: 'Fragile Senses',
    cost: 4,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">☢️▓▓▓☢️</div>
<div class="pixel-row">░👁️💥👁️░</div>
<div class="pixel-row">░░🧬✗░░</div>
</div>`,
    logic: 'Space radiation/Zero-G is 100x more lethal to this universe\'s biology.',
    tip: 'Enduring biological limitation.',
    isRedHerring: false
  },
  {
    id: 16,
    category: 'biological',
    name: 'Space Virus',
    cost: 4,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">🦠░🦠░🦠</div>
<div class="pixel-row">░🌍💀🌍░</div>
<div class="pixel-row">🦠░🦠░🦠</div>
</div>`,
    logic: 'Deadly pathogen emerges when civilizations attempt space travel.',
    tip: 'May only affect specific lineages.',
    isRedHerring: true
  },
  {
    id: 17,
    category: 'biological',
    name: 'Hyper-Specialist',
    cost: 3,
    condition: 'C',
    art: `<div class="pixel-art">
<div class="pixel-row">🌳▓▓▓🌳</div>
<div class="pixel-row">░🦎🏠🦎░</div>
<div class="pixel-row">▓▓▓▓▓▓▓</div>
</div>`,
    logic: 'Species are so tied to their specific biome they refuse to leave their home valleys.',
    tip: 'Some species more adaptive than others.',
    isRedHerring: false
  },
  {
    id: 18,
    category: 'biological',
    name: 'Slow Metamorphosis',
    cost: 4,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">░🐛━━━►</div>
<div class="pixel-row">⏱️⏱️⏱️⏱️</div>
<div class="pixel-row">━━━━►🦋</div>
</div>`,
    logic: 'It takes 200 years for an individual to reach "adulthood." Progress is glacial.',
    tip: 'Slows development across eons.',
    isRedHerring: false
  },
  {
    id: 19,
    category: 'biological',
    name: 'The Peace Gene',
    cost: 5,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">░🧬☮️🧬░</div>
<div class="pixel-row">🌱░░░🌱</div>
<div class="pixel-row">░🏡▓🏡░</div>
</div>`,
    logic: 'Total lack of "Expansionist Drive." Species is content to sit in a garden forever.',
    tip: 'Sustainable across time.',
    isRedHerring: false
  },
  {
    id: 20,
    category: 'biological',
    name: 'Rare Eukaryotes',
    cost: 9,
    condition: 'B',
    art: `<div class="pixel-row">░░🔬░░</div>
<div class="pixel-row">░1⁄∞░</div>
<div class="pixel-row">🦠░░░🦠</div>
</div>`,
    logic: 'The jump to complex cells is a 1-in-a-trillion accident.',
    tip: 'Universal biological bottleneck.',
    isRedHerring: false
  },

  // CATEGORY 3: SOCIETAL TRAPS (10 cards)
  {
    id: 21,
    category: 'societal',
    name: 'The Digital Lure',
    cost: 8,
    condition: 'A',
    art: `<div class="pixel-art">
<div class="pixel-row">░💻🌐💻░</div>
<div class="pixel-row">▓▓👤?▓▓</div>
<div class="pixel-row">░░░∅░░░</div>
</div>`,
    logic: 'VR is easier to build than rockets. Civs "upload" and vanish into their own servers.',
    tip: 'Invisible to external observers.',
    isRedHerring: false
  },
  {
    id: 22,
    category: 'societal',
    name: 'The Moloch Trap',
    cost: 7,
    condition: 'C',
    art: `<div class="pixel-art">
<div class="pixel-row">░⚔️╳⚔️░</div>
<div class="pixel-row">🏛️░✗░🏛️</div>
<div class="pixel-row">░░☢️☢️░░</div>
</div>`,
    logic: 'Competitive Game Theory ensures they always build nukes before they build a global government.',
    tip: 'Different outcomes for different societies.',
    isRedHerring: false
  },
  {
    id: 23,
    category: 'societal',
    name: 'Fossil Fuel Desert',
    cost: 6,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">░⛽✗⛽░</div>
<div class="pixel-row">🪵→?→☀️</div>
<div class="pixel-row">░░░░░░░░</div>
</div>`,
    logic: 'No "easy energy" phase. They can\'t bridge the gap from wood to solar.',
    tip: 'Long-term energy constraint.',
    isRedHerring: false
  },
  {
    id: 24,
    category: 'societal',
    name: 'Stewardship Ethic',
    cost: 5,
    condition: 'A',
    art: `<div class="pixel-art">
<div class="pixel-row">░░🙏░░</div>
<div class="pixel-row">░🌍▓🌍░</div>
<div class="pixel-row">░🚀✗✗░</div>
</div>`,
    logic: 'Culture evolves to view "leaving the cradle" as a supreme religious sin.',
    tip: 'Keeps civilizations quiet.',
    isRedHerring: false
  },
  {
    id: 25,
    category: 'societal',
    name: 'Post-Truth Decay',
    cost: 5,
    condition: 'E',
    art: `<div class="pixel-art">
<div class="pixel-row">📱▓▓▓📱</div>
<div class="pixel-row">🗣️❓❓🗣️</div>
<div class="pixel-row">░🏛️💥💥░</div>
</div>`,
    logic: 'Information tech leads to total societal collapse due to loss of shared reality.',
    tip: 'Follows logical progression.',
    isRedHerring: false
  },
  {
    id: 26,
    category: 'societal',
    name: 'Global War',
    cost: 4,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">⚔️░⚔️░⚔️</div>
<div class="pixel-row">░🌍💥🌍░</div>
<div class="pixel-row">☢️░░░☢️</div>
</div>`,
    logic: 'Inevitable large-scale conflict destroys technological civilizations.',
    tip: 'Survivors often rebuild stronger.',
    isRedHerring: true
  },
  {
    id: 27,
    category: 'societal',
    name: 'Anti-Science Bias',
    cost: 4,
    condition: 'A',
    art: `<div class="pixel-art">
<div class="pixel-row">░📚✗✗░</div>
<div class="pixel-row">▓🙏▓🙏▓</div>
<div class="pixel-row">░🔬░░░</div>
</div>`,
    logic: 'Curiosity is culturally suppressed. Engineers are low-status; priests are high-status.',
    tip: 'Reduces technological signatures.',
    isRedHerring: false
  },
  {
    id: 28,
    category: 'societal',
    name: 'Hedonic Treadmill',
    cost: 3,
    condition: 'B',
    art: `<div class="pixel-art">
<div class="pixel-row">░🍕😊🍕░</div>
<div class="pixel-row">▓▓💤▓▓</div>
<div class="pixel-row">░░░░░░░░</div>
</div>`,
    logic: 'Once basic needs are met, the species stops innovating and plateaus.',
    tip: 'Common across intelligent species.',
    isRedHerring: false
  },
  {
    id: 29,
    category: 'societal',
    name: 'Resource Exhaustion',
    cost: 6,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">⛏️▓▓▓⛏️</div>
<div class="pixel-row">🌍💨💨💨</div>
<div class="pixel-row">░🚀✗✗░</div>
</div>`,
    logic: 'Planetary resources run out exactly 50 years before Interstellar tech is ready.',
    tip: 'Long-term timing constraint.',
    isRedHerring: false
  },
  {
    id: 30,
    category: 'societal',
    name: 'The Hermit Mindset',
    cost: 4,
    condition: 'A',
    art: `<div class="pixel-art">
<div class="pixel-row">░░👁️░░</div>
<div class="pixel-row">░🌌🌌🌌░</div>
<div class="pixel-row">░░🤫░░</div>
</div>`,
    logic: 'Natural paranoia. Every civ assumes the stars are dangerous and stays quiet.',
    tip: 'Ensures galactic silence.',
    isRedHerring: false
  },

  // CATEGORY 4: THE PREDATORS (10 cards)
  {
    id: 31,
    category: 'predators',
    name: 'Berserker Probes',
    cost: 10,
    condition: 'A',
    art: `<div class="pixel-art">
<div class="pixel-row">░░🛸░░</div>
<div class="pixel-row">📡⚡💥⚡📡</div>
<div class="pixel-row">▓▓▓▓▓</div>
</div>`,
    logic: 'Automated sentinels destroy any planet that emits a Type 1 radio signature.',
    tip: 'Enforces complete silence.',
    isRedHerring: false
  },
  {
    id: 32,
    category: 'predators',
    name: 'Dark Forest Echo',
    cost: 7,
    condition: 'A',
    art: `<div class="pixel-art">
<div class="pixel-row">░📢📢📢░</div>
<div class="pixel-row">😱▓▓▓😱</div>
<div class="pixel-row">░░🤫🤫░░</div>
</div>`,
    logic: 'A galaxy-wide broadcast that sounds like a dying scream. It scares everyone into hiding.',
    tip: 'Creates universal quiet.',
    isRedHerring: false
  },
  {
    id: 33,
    category: 'predators',
    name: 'Vacuum Decayer',
    cost: 9,
    condition: 'E',
    art: `<div class="pixel-art">
<div class="pixel-row">░░⚛️⚛️░░</div>
<div class="pixel-row">▓💥💥💥▓</div>
<div class="pixel-row">░░🕳️░░</div>
</div>`,
    logic: 'High-energy physics experiments trigger a local collapse of space, deleting the system.',
    tip: 'Scientifically plausible consequence.',
    isRedHerring: false
  },
  {
    id: 34,
    category: 'predators',
    name: 'Nanobot Shroud',
    cost: 6,
    condition: 'A',
    art: `<div class="pixel-art">
<div class="pixel-row">•••••••</div>
<div class="pixel-row">░☀️→🌑░</div>
<div class="pixel-row">•••••••</div>
</div>`,
    logic: 'Tiny dust particles surround stars, acting as a "One-Way Mirror" for light.',
    tip: 'Hides stellar activity.',
    isRedHerring: false
  },
  {
    id: 35,
    category: 'predators',
    name: 'The False Beacon',
    cost: 5,
    condition: 'C',
    art: `<div class="pixel-art">
<div class="pixel-row">░░📡░░</div>
<div class="pixel-row">░➡️➡️➡️░</div>
<div class="pixel-row">░░⚫░░</div>
</div>`,
    logic: 'A lure that pulls civs toward a black hole under the guise of an "Alien Signal."',
    tip: 'Affects curious species differently.',
    isRedHerring: false
  },
  {
    id: 36,
    category: 'predators',
    name: 'Alien War',
    cost: 8,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">👽⚔️👽⚔️</div>
<div class="pixel-row">▓💥💥▓</div>
<div class="pixel-row">░░░░░░░</div>
</div>`,
    logic: 'Aggressive alien species hunt and destroy emerging civilizations.',
    tip: 'Creates detectable artifacts and noise.',
    isRedHerring: true
  },
  {
    id: 37,
    category: 'predators',
    name: 'The Memory Wipe',
    cost: 7,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">ν~~~~~ν</div>
<div class="pixel-row">░💾💥💾░</div>
<div class="pixel-row">░░🧠?░░</div>
</div>`,
    logic: 'Periodic neutrino bursts erase magnetic storage/digital memory across the galaxy.',
    tip: 'Recurring constraint over time.',
    isRedHerring: false
  },
  {
    id: 38,
    category: 'predators',
    name: 'Quarantine Fleet',
    cost: 6,
    condition: 'D',
    art: `<div class="pixel-art">
<div class="pixel-row">░🛸🛸🛸░</div>
<div class="pixel-row">▓🌍⭕▓</div>
<div class="pixel-row">░░✗✗░░</div>
</div>`,
    logic: 'Invisible ships that destroy anything that crosses the "Hill Sphere" of a planet.',
    tip: 'Permanent containment mechanism.',
    isRedHerring: false
  },
  {
    id: 39,
    category: 'predators',
    name: 'Radio Eaters',
    cost: 5,
    condition: 'A',
    art: `<div class="pixel-art">
<div class="pixel-row">░📡📡📡░</div>
<div class="pixel-row">🦠🦠🦠🦠</div>
<div class="pixel-row">░🌫️🌫️🌫️░</div>
</div>`,
    logic: 'Space-born organisms that feed on electromagnetic radiation, blurring signals.',
    tip: 'Obscures all transmissions.',
    isRedHerring: false
  },
  {
    id: 40,
    category: 'predators',
    name: 'Solar Syphon',
    cost: 8,
    condition: 'E',
    art: `<div class="pixel-art">
<div class="pixel-row">░░⚙️░░</div>
<div class="pixel-row">⚙️☀️💥☀️⚙️</div>
<div class="pixel-row">░░░░░░░░</div>
</div>`,
    logic: 'If a Dyson Swarm is detected, the probe forces the star into a premature supernova.',
    tip: 'Logical punishment for mega-engineering.',
    isRedHerring: false
  },

  // CATEGORY 5: OTHER (10 cards - MOSTLY RED HERRINGS)
  {
    id: 41,
    category: 'other',
    name: 'Space Monsters',
    cost: 6,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">░░👾👾░░</div>
<div class="pixel-row">▓🌌🌌▓</div>
<div class="pixel-row">░😱░😱░</div>
</div>`,
    logic: 'Giant creatures patrol the void, attacking starships.',
    tip: 'Doesn\'t prevent radio signals.',
    isRedHerring: true
  },
  {
    id: 42,
    category: 'other',
    name: 'The Invisible Wall',
    cost: 10,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">░🧱?🧱░</div>
<div class="pixel-row">🌌▓▓▓🌌</div>
<div class="pixel-row">░✨░✨░</div>
</div>`,
    logic: 'A mysterious barrier prevents travel beyond local systems.',
    tip: 'Unexplainable mechanism.',
    isRedHerring: true
  },
  {
    id: 43,
    category: 'other',
    name: 'The Sun Stealer',
    cost: 9,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">░░☀️☀️░░</div>
<div class="pixel-row">░💨💨💨░</div>
<div class="pixel-row">░░🌑🌑░░</div>
</div>`,
    logic: 'Advanced entities harvest stars, causing systems to go dark.',
    tip: 'Highly visible to others.',
    isRedHerring: true
  },
  {
    id: 44,
    category: 'other',
    name: 'Loneliness Plague',
    cost: 5,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">░░💔💔░░</div>
<div class="pixel-row">▓😢😢▓</div>
<div class="pixel-row">░░💀░░</div>
</div>`,
    logic: 'Isolation in space causes psychological collapse.',
    tip: 'Assumes all beings feel loneliness.',
    isRedHerring: true
  },
  {
    id: 45,
    category: 'other',
    name: 'Meteor Rain',
    cost: 7,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">☄️░☄️░☄️</div>
<div class="pixel-row">░🌍💥🌍░</div>
<div class="pixel-row">☄️░☄️░☄️</div>
</div>`,
    logic: 'Constant asteroid bombardment prevents civilizations from thriving.',
    tip: 'Advanced civs can deflect.',
    isRedHerring: true
  },
  {
    id: 46,
    category: 'other',
    name: 'The God Finger',
    cost: 10,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">░░☝️☝️░░</div>
<div class="pixel-row">░░👁️░░</div>
<div class="pixel-row">░░🌍░░</div>
</div>`,
    logic: 'A divine being manually intervenes to prevent expansion.',
    tip: 'Requires continuous oversight.',
    isRedHerring: true
  },
  {
    id: 47,
    category: 'other',
    name: 'Zero-IQ Galaxy',
    cost: 8,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">░🧠✗✗░</div>
<div class="pixel-row">▓🌌🌌▓</div>
<div class="pixel-row">░░💤░░</div>
</div>`,
    logic: 'Intelligence never evolves anywhere in the universe.',
    tip: 'Contradicts goal of allowing life.',
    isRedHerring: true
  },
  {
    id: 48,
    category: 'other',
    name: 'The Alien Abduction',
    cost: 7,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">░░👽👽░░</div>
<div class="pixel-row">░🛸↑🛸░</div>
<div class="pixel-row">░░❓❓░░</div>
</div>`,
    logic: 'Advanced aliens kidnap emerging civilizations.',
    tip: 'Just relocates the problem.',
    isRedHerring: true
  },
  {
    id: 49,
    category: 'other',
    name: 'The Peace Treaty',
    cost: 6,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">░░🤝░░</div>
<div class="pixel-row">▓▓📜▓▓</div>
<div class="pixel-row">░░☮️░░</div>
</div>`,
    logic: 'All civilizations agree to stay home.',
    tip: 'One defector breaks the system.',
    isRedHerring: true
  },
  {
    id: 50,
    category: 'other',
    name: 'Gravity Crush',
    cost: 8,
    condition: 'NONE',
    art: `<div class="pixel-art">
<div class="pixel-row">▼▼▼▼▼▼</div>
<div class="pixel-row">░░🌍░░</div>
<div class="pixel-row">░░💀░░</div>
</div>`,
    logic: 'Extreme gravity prevents any life from forming.',
    tip: 'Too strong - prevents garden itself.',
    isRedHerring: true
  }
];

// ========== CANVAS & PLANET RENDERING ==========
const canvas = document.getElementById('planet-canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

function drawStarfield() {
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const brightness = Math.random();
    ctx.fillStyle = `rgba(0, 255, 204, ${brightness * 0.6})`;
    ctx.fillRect(x, y, 1, 1);
  }
}

function drawPlanet(stage, status = 'alive') {
  const centerX = canvas.width / 2;
  const centerY = canvas.height * 0.4; // Moved up from center (0.5 to 0.4)
  const radius = 70; // Slightly larger

  let planetColor, glowColor, detailColor;

  // STAGE 0: MOLTEN (Red/Orange lava planet)
  if (stage === 'MOLTEN') {
    planetColor = '#4d1a1a';
    glowColor = 'rgba(255, 68, 0, 0.6)';
    detailColor = '#ff4400';
  }
  // STAGE 1: WATER (Blue ocean world)
  else if (stage === 'WATER') {
    planetColor = '#1a334d';
    glowColor = 'rgba(68, 136, 255, 0.4)';
    detailColor = '#4488ff';
  }
  // STAGE 2: GREEN (Life emerges)
  else if (stage === 'GREEN') {
    planetColor = '#1a4d2e';
    glowColor = 'rgba(0, 255, 136, 0.3)';
    detailColor = '#2d5a3d';
  }
  // STAGE 3: CITIES (Civilization with lights)
  else if (stage === 'CITIES') {
    planetColor = '#2e4d1a';
    glowColor = 'rgba(255, 204, 0, 0.4)';
    detailColor = '#3d5a2d';
  }
  // STAGE 4: SATELLITES (Space age)
  else if (stage === 'SATELLITES') {
    planetColor = '#1a2e4d';
    glowColor = 'rgba(0, 204, 255, 0.5)';
    detailColor = '#2d3d5a';
  }
  // STAGE 5: DYSON (Type II civilization)
  else if (stage === 'DYSON') {
    planetColor = '#1a1a4d';
    glowColor = 'rgba(136, 0, 255, 0.6)';
    detailColor = '#2d2d5a';
  }

  // Override if stalled/extinct
  if (status === 'stalled') {
    planetColor = '#1a1a1a';
    glowColor = 'rgba(0, 255, 204, 0.2)';
    detailColor = '#0a0a0a';
  }

  // Draw glow
  ctx.shadowBlur = 30;
  ctx.shadowColor = glowColor;

  // Draw main planet body
  ctx.fillStyle = planetColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  // Stage-specific details
  if (status !== 'stalled') {
    // MOLTEN: Lava cracks
    if (stage === 'MOLTEN') {
      ctx.fillStyle = detailColor;
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const dist = radius * (0.3 + Math.random() * 0.5);
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        const size = 3 + Math.random() * 6;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }

    // WATER: Ocean patterns
    else if (stage === 'WATER') {
      ctx.fillStyle = detailColor;
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = radius * Math.random() * 0.8;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        const size = 2 + Math.random() * 4;
        ctx.fillRect(x, y, size, size);
      }
    }

    // GREEN: Continents
    else if (stage === 'GREEN') {
      ctx.fillStyle = detailColor;
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const dist = radius * (0.4 + Math.random() * 0.4);
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        const size = 4 + Math.random() * 8;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }

    // CITIES: City lights on dark side
    else if (stage === 'CITIES') {
      // Continents
      ctx.fillStyle = detailColor;
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const dist = radius * (0.4 + Math.random() * 0.4);
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        const size = 5 + Math.random() * 7;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }

      // City lights (yellow pixels on night side)
      ctx.fillStyle = '#ffcc00';
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = radius * (0.3 + Math.random() * 0.6);
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        if (x > centerX) { // Night side
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // SATELLITES: Orbital objects
    else if (stage === 'SATELLITES') {
      // Planet surface
      ctx.fillStyle = detailColor;
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const dist = radius * (0.4 + Math.random() * 0.4);
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        const size = 4 + Math.random() * 6;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }

      // City lights
      ctx.fillStyle = '#00ffcc';
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = radius * Math.random();
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        ctx.fillRect(x, y, 1, 1);
      }

      // Satellites in orbit
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + Date.now() * 0.0001;
        const orbitRadius = radius + 15 + (i % 3) * 8;
        const x = centerX + Math.cos(angle) * orbitRadius;
        const y = centerY + Math.sin(angle) * orbitRadius;
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // DYSON: Dyson sphere construction
    else if (stage === 'DYSON') {
      // Small sun in center
      ctx.fillStyle = '#ffff00';
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Dyson sphere wireframe
      ctx.strokeStyle = 'rgba(0, 255, 204, 0.6)';
      ctx.lineWidth = 1;

      // Multiple orbital rings
      for (let r = 35; r <= 75; r += 10) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Vertical segments
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(angle) * 35, centerY + Math.sin(angle) * 35);
        ctx.lineTo(centerX + Math.cos(angle) * 75, centerY + Math.sin(angle) * 75);
        ctx.stroke();
      }

      // Solar panels (white pixels)
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 35 + Math.random() * 40;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  ctx.shadowBlur = 0;
}

function renderCanvas() {
  drawStarfield();
  drawPlanet(GameState.civilization.stage, GameState.civilization.resilience > 0 ? 'alive' : 'stalled');
}

// ========== CARD SELECTION UI ==========
function renderCardList() {
  const cardList = document.getElementById('card-list');
  cardList.innerHTML = '';

  const categoryCards = AttributeCards.filter(card => card.category === GameState.currentCategory);

  categoryCards.forEach(card => {
    const btn = document.createElement('button');
    btn.className = 'card-btn';
    btn.dataset.cardId = card.id;

    const isSelected = GameState.selectedFilters.find(f => f.id === card.id);
    if (isSelected) {
      btn.classList.add('selected');
    }

    if (!isSelected && (GameState.entropySpent + card.cost > GameState.entropyBudget)) {
      btn.classList.add('disabled');
    }

    btn.innerHTML = `
      <span class="card-btn-name">${card.name}</span>
      <span class="card-btn-cost">${card.cost}</span>
    `;

    btn.addEventListener('click', () => openCardModal(card));

    cardList.appendChild(btn);
  });
}

function openCardModal(card) {
  const modal = document.getElementById('card-modal');
  const modalCard = document.getElementById('modal-card');

  const isSelected = GameState.selectedFilters.find(f => f.id === card.id);

  // Render art - handles both HTML and plain text
  const artContent = card.art.includes('<div') ? card.art : `<pre class="card-art-text">${card.art}</pre>`;

  modalCard.innerHTML = `
    <div class="card-header">
      <div class="card-category">${card.category.toUpperCase()}</div>
      <div class="card-title">${card.name}</div>
    </div>
    <div class="card-body">
      <div class="card-art">${artContent}</div>
      <div class="card-flavor">"${card.logic}"</div>
      <div class="card-stats">
        <div class="stat-row">
          <span class="stat-label">ENTROPY COST:</span>
          <span class="stat-value">${card.cost}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">TIP:</span>
          <span class="stat-value">${card.tip}</span>
        </div>
        ${isSelected ? '<div class="stat-row"><span class="stat-value positive">✓ SELECTED</span></div>' : ''}
      </div>
    </div>
  `;

  modal.classList.add('active');
  modal.dataset.cardId = card.id;

  modalCard.addEventListener('mousedown', handleModalDragStart);
  modalCard.addEventListener('touchstart', handleModalDragStart);
}

function closeCardModal() {
  const modal = document.getElementById('card-modal');
  modal.classList.remove('active');
}

// ========== MODAL SWIPE MECHANICS ==========
let modalStartX = 0;
let modalCurrentX = 0;
let isModalDragging = false;

function handleModalDragStart(e) {
  const modal = document.getElementById('card-modal');
  const cardId = parseInt(modal.dataset.cardId);
  const card = AttributeCards.find(c => c.id === cardId);

  const isSelected = GameState.selectedFilters.find(f => f.id === card.id);

  if (!isSelected && (GameState.entropySpent + card.cost > GameState.entropyBudget)) {
    return;
  }

  isModalDragging = true;
  const modalCard = document.getElementById('modal-card');
  modalCard.classList.add('swiping');

  modalStartX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;

  document.addEventListener('mousemove', handleModalDragMove);
  document.addEventListener('touchmove', handleModalDragMove);
  document.addEventListener('mouseup', handleModalDragEnd);
  document.addEventListener('touchend', handleModalDragEnd);
}

function handleModalDragMove(e) {
  if (!isModalDragging) return;

  modalCurrentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const diff = modalCurrentX - modalStartX;

  const modalCard = document.getElementById('modal-card');
  modalCard.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;

  const opacity = Math.abs(diff) / 150;
  if (diff > 0) {
    modalCard.style.borderColor = `rgba(0, 255, 136, ${Math.min(opacity, 1)})`;
  } else {
    modalCard.style.borderColor = `rgba(255, 0, 85, ${Math.min(opacity, 1)})`;
  }
}

function handleModalDragEnd(e) {
  if (!isModalDragging) return;

  isModalDragging = false;
  const diff = modalCurrentX - modalStartX;

  document.removeEventListener('mousemove', handleModalDragMove);
  document.removeEventListener('touchmove', handleModalDragMove);
  document.removeEventListener('mouseup', handleModalDragEnd);
  document.removeEventListener('touchend', handleModalDragEnd);

  const modalCard = document.getElementById('modal-card');
  modalCard.classList.remove('swiping');

  const modal = document.getElementById('card-modal');
  const cardId = parseInt(modal.dataset.cardId);
  const card = AttributeCards.find(c => c.id === cardId);

  if (Math.abs(diff) > 100) {
    if (diff > 0) {
      addCardToGarden(card);
      modalCard.classList.add('swipe-right');
    } else {
      removeCardFromGarden(card);
      modalCard.classList.add('swipe-left');
    }

    setTimeout(() => {
      closeCardModal();
      modalCard.style.transform = '';
      modalCard.style.borderColor = '#bc00ff';
      modalCard.classList.remove('swipe-right', 'swipe-left');
    }, 400);
  } else {
    modalCard.style.transform = '';
    modalCard.style.borderColor = '#bc00ff';
  }
}

function addCardToGarden(card) {
  const isSelected = GameState.selectedFilters.find(f => f.id === card.id);

  if (isSelected) return;

  if (GameState.entropySpent + card.cost > GameState.entropyBudget) return;

  GameState.selectedFilters.push(card);
  GameState.entropySpent += card.cost;

  if (!card.isRedHerring && card.condition !== 'NONE') {
    GameState.truthConditions[card.condition] += card.cost;
  }

  updateHUD();
  renderCardList();
}

function removeCardFromGarden(card) {
  const index = GameState.selectedFilters.findIndex(f => f.id === card.id);

  if (index === -1) return;

  GameState.selectedFilters.splice(index, 1);
  GameState.entropySpent -= card.cost;

  if (!card.isRedHerring && card.condition !== 'NONE') {
    GameState.truthConditions[card.condition] -= card.cost;
  }

  updateHUD();
  renderCardList();
}

function updateHUD() {
  const remaining = GameState.entropyBudget - GameState.entropySpent;
  document.getElementById('entropy-display').textContent = `${remaining}/${GameState.entropyBudget}`;
  document.getElementById('filter-count').textContent = GameState.selectedFilters.length;
}

// ========== FILTERS MODAL ==========
function openFiltersModal() {
  const modal = document.getElementById('filters-modal');
  const content = document.getElementById('filters-list-content');

  if (GameState.selectedFilters.length === 0) {
    content.innerHTML = '<div class="log-entry">No filters selected yet.</div>';
  } else {
    content.innerHTML = '';
    GameState.selectedFilters.forEach(filter => {
      const item = document.createElement('div');
      item.className = 'filter-item';
      item.innerHTML = `
        <div class="filter-item-name">${filter.name}</div>
        <div class="filter-item-cost">Entropy: ${filter.cost}</div>
      `;
      content.appendChild(item);
    });
  }

  modal.classList.add('active');
}

function closeFiltersModal() {
  document.getElementById('filters-modal').classList.remove('active');
}

// ========== RULES MODAL ==========
function openRulesModal() {
  const modal = document.getElementById('rules-modal');
  modal.classList.add('active');
}

function closeRulesModal() {
  document.getElementById('rules-modal').classList.remove('active');
}

// ========== CATEGORY TABS ==========
function setupCategoryTabs() {
  const tabs = document.querySelectorAll('.category-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      GameState.currentCategory = tab.dataset.category;
      renderCardList();
    });
  });
}

// ========== FLASH EFFECT ==========
function triggerFlash(type = 'white') {
  const flash = document.getElementById('flash-overlay');
  flash.className = ''; // Reset
  setTimeout(() => {
    flash.classList.add(`flash-${type}`);
  }, 10);

  setTimeout(() => {
    flash.className = '';
  }, type === 'white' ? 700 : 900);
}

// ========== CONTEXTUAL EVENTS BY STAGE ==========
const StageEvents = {
  MOLTEN: [
    { message: 'Volcanic activity subsiding...', type: 'log-entry' },
    { message: 'Atmospheric gases escaping to space', type: 'log-entry warning' },
    { message: 'Surface temperature: 1,200°C', type: 'log-entry' },
    { message: 'Planetary differentiation ongoing', type: 'log-entry' },
    { message: 'Magnetic field stabilizing', type: 'log-entry success' },
    { message: 'Meteor bombardment continues', type: 'log-entry warning' }
  ],
  WATER: [
    { message: 'First oceans forming in impact craters', type: 'log-entry success' },
    { message: 'Amino acid chains detected in tidal pools', type: 'log-entry' },
    { message: 'Hydrothermal vents active', type: 'log-entry' },
    { message: 'Chemical evolution accelerating', type: 'log-entry warning' },
    { message: 'Primitive RNA structures emerging', type: 'log-entry warning' },
    { message: 'Ocean chemistry stabilizing', type: 'log-entry' }
  ],
  GREEN: [
    { message: 'Photosynthesis emerging', type: 'log-entry warning' },
    { message: 'Oxygen levels rising in atmosphere', type: 'log-entry warning' },
    { message: 'First multicellular organisms detected', type: 'log-entry' },
    { message: 'Continental drift reshaping landmasses', type: 'log-entry' },
    { message: 'Biodiversity explosion in progress', type: 'log-entry warning' },
    { message: 'Complex nervous systems evolving', type: 'log-entry failure' }
  ],
  CITIES: [
    { message: 'Radio emissions detected - 1.4 GHz band', type: 'log-entry failure' },
    { message: 'Nuclear fission signatures observed', type: 'log-entry failure' },
    { message: 'Global communication networks established', type: 'log-entry warning' },
    { message: 'Atmospheric CO2 levels rising', type: 'log-entry' },
    { message: 'First orbital launch attempt detected', type: 'log-entry failure' },
    { message: 'Planetary unification movements emerging', type: 'log-entry warning' }
  ],
  SATELLITES: [
    { message: 'Orbital infrastructure expanding', type: 'log-entry failure' },
    { message: 'Space mining operations commenced', type: 'log-entry failure' },
    { message: 'Interplanetary probes launched', type: 'log-entry failure' },
    { message: 'Fusion power research advancing', type: 'log-entry failure' },
    { message: 'Off-world colonies established', type: 'log-entry failure' },
    { message: 'Von Neumann probe prototypes detected', type: 'log-entry failure' }
  ],
  DYSON: [
    { message: 'Stellar engineering detected', type: 'log-entry failure' },
    { message: 'Dyson swarm assembly accelerating', type: 'log-entry failure' },
    { message: 'Kardashev Type II transition imminent', type: 'log-entry failure' },
    { message: 'Mega-structure construction 67% complete', type: 'log-entry failure' },
    { message: 'Energy capture efficiency: 23% stellar output', type: 'log-entry failure' },
    { message: 'Interstellar colonization fleet assembling', type: 'log-entry failure' }
  ]
};

// ========== SIMULATION ENGINE ==========
function startSimulation() {
  switchScreen('sim-screen');

  // Assign unique civilization ID
  GameState.civilization = {
    id: Math.floor(Math.random() * 9000) + 1000,
    stage: 'MOLTEN',
    resilience: 50,
    age: 0,
    stageProgress: 0
  };

  GameState.simulationLog = [];
  GameState.failureReasons = [];

  addLog(`Monitoring Civilization #${GameState.civilization.id}...`, 'success');
  addLog('Deploying filter array...', 'warning');

  GameState.selectedFilters.forEach(filter => {
    addLog(`✓ ${filter.name}`, 'success');
  });

  addLog('', 'log-entry');
  addLog('Beginning observation...', 'log-entry');

  renderCanvas();
  updateSimulationDisplay();

  let tickCount = 0;
  const simInterval = setInterval(() => {
    tickCount++;
    GameState.civilization.age += 100000; // 100k years per tick
    GameState.civilization.stageProgress += 5;

    updateSimulationDisplay();

    if (GameState.civilization.stageProgress >= 100) {
      GameState.civilization.stageProgress = 0;

      const stageTransitions = {
        'MOLTEN': 'WATER',
        'WATER': 'GREEN',
        'GREEN': 'CITIES',
        'CITIES': 'SATELLITES',
        'SATELLITES': 'DYSON'
      };

      const nextStage = stageTransitions[GameState.civilization.stage];

      if (nextStage) {
        GameState.civilization.stage = nextStage;
        const ageDisplay = (GameState.civilization.age / 1000000).toFixed(1);
        addLog('', 'log-entry');
        addLog(`=== ${nextStage} ERA (${ageDisplay}M years) ===`, 'warning');
        renderCanvas();

        // Check filter at each major transition (after GREEN)
        if (nextStage === 'CITIES' || nextStage === 'SATELLITES' || nextStage === 'DYSON') {
          if (!checkFilters()) {
            clearInterval(simInterval);
            return;
          }
        }

        // Victory if reached Dyson
        if (nextStage === 'DYSON') {
          clearInterval(simInterval);
          civilizationEscaped();
          return;
        }
      }
    }

    // Contextual events based on current stage
    if (tickCount % 4 === 0) {
      const stageEventPool = StageEvents[GameState.civilization.stage];
      if (stageEventPool && stageEventPool.length > 0) {
        const event = stageEventPool[Math.floor(Math.random() * stageEventPool.length)];
        addLog(event.message, event.type);
      }
    }

  }, 900);
}

function checkFilters() {
  const allMet = ['A', 'B', 'C', 'D', 'E'].every(cond => GameState.truthConditions[cond] >= 15);

  // Probabilistic check with visual feedback
  const totalFilterStrength = Object.values(GameState.truthConditions).reduce((a, b) => a + b, 0);
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  const failureChance = (GameState.civilization.resilience / (totalFilterStrength + 1)) * randomFactor;

  const roll = Math.random();

  if (allMet && roll > failureChance) {
    // Filter succeeds - civilization stalled
    triggerFlash('white');

    GameState.civilization.resilience = 0;
    addLog(`>>> FILTER ACTIVATED <<<`, 'success');
    addLog(`Civilization stalled at ${GameState.civilization.stage} stage.`, 'success');

    setTimeout(() => {
      filterSuccess();
    }, 2000);

    return false;
  } else {
    // Filter fails - civilization adapts
    if (!allMet) {
      const failedConditions = [];
      ['A', 'B', 'C', 'D', 'E'].forEach(cond => {
        if (GameState.truthConditions[cond] < 15) {
          const condNames = {A: 'Silence', B: 'Universality', C: 'Variance', D: 'Scale', E: 'Logic'};
          failedConditions.push(condNames[cond]);
          GameState.failureReasons.push(`Truth Condition ${cond} (${condNames[cond]}) insufficient: ${GameState.truthConditions[cond]}/15`);
        }
      });
    } else {
      GameState.failureReasons.push(`Probabilistic failure: Civilization resilience (${GameState.civilization.resilience}) overcame filter strength (${totalFilterStrength})`);
    }

    triggerFlash('red');
    GameState.civilization.resilience += 15;
    addLog(`Civilization adapts and overcomes filter. Resilience increased.`, 'failure');
    return true;
  }
}

function getRandomEvent() {
  const events = [
    { message: 'Cultural renaissance detected.', type: 'log-entry' },
    { message: 'Scientific breakthrough achieved.', type: 'log-entry warning' },
    { message: 'Political tensions rising.', type: 'log-entry' },
    { message: 'Environmental degradation accelerating.', type: 'log-entry warning' },
    { message: 'First orbital satellite launched.', type: 'log-entry' },
    { message: 'Philosophical movements emerging.', type: 'log-entry' },
    { message: 'Nuclear weapons developed.', type: 'log-entry failure' },
    { message: 'Renewable energy adopted.', type: 'log-entry success' }
  ];

  return events[Math.floor(Math.random() * events.length)];
}

function addLog(message, className = 'log-entry') {
  const logEl = document.getElementById('sim-log');
  const entry = document.createElement('div');
  entry.className = className;
  entry.textContent = `> ${message}`;
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;

  GameState.simulationLog.push(message);
}

function updateSimulationDisplay() {
  const ageMillions = (GameState.civilization.age / 1000000).toFixed(1);
  const civInfo = `#${GameState.civilization.id} - ${GameState.civilization.stage} - ${ageMillions}M YEARS`;
  document.getElementById('civ-stage').textContent = civInfo;

  const resiliencePercent = Math.min((GameState.civilization.resilience / 100) * 100, 100);
  document.getElementById('resilience-bar').style.width = resiliencePercent + '%';

  const totalFilterStrength = Object.values(GameState.truthConditions).reduce((a, b) => a + b, 0);
  const filterPercent = Math.min((totalFilterStrength / 75) * 100, 100);
  document.getElementById('filter-bar').style.width = filterPercent + '%';
}

function filterSuccess() {
  GameState.outcome = 'success';
  showAnalysis();
}

function civilizationEscaped() {
  GameState.outcome = 'failure';
  addLog(`Dyson sphere construction detected! Type II civilization achieved.`, 'failure');
  setTimeout(() => {
    showAnalysis();
  }, 2000);
}

// ========== THE REPORT (THE EDUCATION) ==========
function showAnalysis() {
  switchScreen('postmortem-screen');

  const header = document.getElementById('outcome-header');
  const log = document.getElementById('postmortem-log');

  if (GameState.outcome === 'success') {
    header.textContent = 'THE REPORT - FILTER SUCCESS';
    header.classList.add('success');

    const ageDisplay = (GameState.civilization.age / 1000000).toFixed(1);

    log.innerHTML = `
      <div class="log-entry success">CIVILIZATION #${GameState.civilization.id}: CONTAINED</div>
      <div class="log-entry"><br>=== EXECUTIVE SUMMARY ===</div>
      <div class="log-entry">Subject stalled at ${GameState.civilization.stage} stage</div>
      <div class="log-entry">Timeline: ${ageDisplay} million years</div>
      <div class="log-entry">Status: SILENT AND STABLE</div>
      <div class="log-entry"><br>=== DEPLOYED FILTERS ===</div>
    `;

    GameState.selectedFilters.forEach(filter => {
      log.innerHTML += `<div class="log-entry">  • ${filter.name} (Entropy: ${filter.cost})</div>`;
    });

    log.innerHTML += `
      <div class="log-entry"><br>=== TRUTH CONDITIONS SATISFIED ===</div>
      <div class="log-entry">  A (Silence): ${GameState.truthConditions.A}/15 ✓</div>
      <div class="log-entry">  B (Universality): ${GameState.truthConditions.B}/15 ✓</div>
      <div class="log-entry">  C (Variance): ${GameState.truthConditions.C}/15 ✓</div>
      <div class="log-entry">  D (Scale): ${GameState.truthConditions.D}/15 ✓</div>
      <div class="log-entry">  E (Logic): ${GameState.truthConditions.E}/15 ✓</div>
      <div class="log-entry success"><br>=== EDUCATION ===</div>
      <div class="log-entry success">The galaxy remains silent.</div>
      <div class="log-entry success">The garden blooms, but does not spread.</div>
      <div class="log-entry success">This is the only sustainable path.</div>
    `;

  } else {
    header.textContent = 'THE REPORT - FILTER BREACH';
    header.classList.add('failure');

    const ageDisplay = (GameState.civilization.age / 1000000).toFixed(1);
    const nextCivId = Math.floor(Math.random() * 9000) + 1000;

    // Analyze filter composition
    const categoryCount = {};
    GameState.selectedFilters.forEach(filter => {
      categoryCount[filter.category] = (categoryCount[filter.category] || 0) + 1;
    });

    const dominantCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );

    // Find failed conditions
    const failedConditions = [];
    const failedConditionDetails = {};
    ['A', 'B', 'C', 'D', 'E'].forEach(cond => {
      if (GameState.truthConditions[cond] < 15) {
        const condNames = {A: 'Silence', B: 'Universality', C: 'Variance', D: 'Scale', E: 'Logic'};
        failedConditions.push(condNames[cond]);
        failedConditionDetails[cond] = condNames[cond];
      }
    });

    log.innerHTML = `
      <div class="log-entry failure">CIVILIZATION #${GameState.civilization.id}: ESCAPED</div>
      <div class="log-entry"><br>=== TIMELINE ===</div>
      <div class="log-entry">Age: ${ageDisplay} million years</div>
      <div class="log-entry">Final Stage: ${GameState.civilization.stage} (TYPE II CIVILIZATION)</div>
      <div class="log-entry"><br>=== WHY THIS DOESN'T SOLVE THE FERMI PARADOX ===</div>
    `;

    // Explain Fermi Paradox failures based on missing conditions
    if (!GameState.truthConditions.A || GameState.truthConditions.A < 15) {
      log.innerHTML += `
        <div class="log-entry failure"><br>SILENCE (${GameState.truthConditions.A}/15): INSUFFICIENT</div>
        <div class="log-entry">The Fermi Paradox asks: "Where is everybody?"</div>
        <div class="log-entry">Your filters failed to make civilizations UNDETECTABLE.</div>
        <div class="log-entry">This civilization broadcasts radio, builds megastructures,</div>
        <div class="log-entry">and colonizes visibly. Others would see them.</div>
        <div class="log-entry">One visible civilization breaks the Great Silence.</div>
      `;
    }

    if (!GameState.truthConditions.B || GameState.truthConditions.B < 15) {
      log.innerHTML += `
        <div class="log-entry failure"><br>UNIVERSALITY (${GameState.truthConditions.B}/15): INSUFFICIENT</div>
        <div class="log-entry">The Fermi Paradox requires galaxy-wide solutions.</div>
        <div class="log-entry">Your filters only work on SOME species or planets.</div>
        <div class="log-entry">Evolution finds workarounds. Life adapts.</div>
        <div class="log-entry">One exception anywhere ruins the entire theory.</div>
      `;
    }

    if (!GameState.truthConditions.C || GameState.truthConditions.C < 15) {
      log.innerHTML += `
        <div class="log-entry failure"><br>VARIANCE (${GameState.truthConditions.C}/15): INSUFFICIENT</div>
        <div class="log-entry">The Fermi Paradox spans countless worlds.</div>
        <div class="log-entry">Your filters assume similar evolutionary paths.</div>
        <div class="log-entry">But intelligence can emerge in infinite forms:</div>
        <div class="log-entry">Ocean dwellers, gas giants, silicon-based minds.</div>
        <div class="log-entry">Your solution is too narrow for cosmic diversity.</div>
      `;
    }

    if (!GameState.truthConditions.D || GameState.truthConditions.D < 15) {
      log.innerHTML += `
        <div class="log-entry failure"><br>SCALE/LONGEVITY (${GameState.truthConditions.D}/15): INSUFFICIENT</div>
        <div class="log-entry">The Fermi Paradox operates on BILLIONS of years.</div>
        <div class="log-entry">Your filters are temporary or short-lived.</div>
        <div class="log-entry">Stars burn for eons. Galaxies rotate for ages.</div>
        <div class="log-entry">A filter must persist across cosmic timescales.</div>
        <div class="log-entry">Temporary obstacles just delay the inevitable.</div>
      `;
    }

    if (!GameState.truthConditions.E || GameState.truthConditions.E < 15) {
      log.innerHTML += `
        <div class="log-entry failure"><br>LOGIC (${GameState.truthConditions.E}/15): INSUFFICIENT</div>
        <div class="log-entry">The Fermi Paradox demands internal consistency.</div>
        <div class="log-entry">Your filters rely on unproven assumptions,</div>
        <div class="log-entry">require active intervention, or violate physics.</div>
        <div class="log-entry">A valid solution must emerge naturally</div>
        <div class="log-entry">from the laws of the universe itself.</div>
      `;
    }

    log.innerHTML += `
      <div class="log-entry"><br>=== THE EDUCATION ===</div>
      <div class="log-entry">The Fermi Paradox has no easy answer.</div>
      <div class="log-entry">A true solution must be:</div>
      <div class="log-entry success">  • SILENT - Makes detection impossible</div>
      <div class="log-entry success">  • UNIVERSAL - Applies to ALL life</div>
      <div class="log-entry success">  • VARIANT - Works across diversity</div>
      <div class="log-entry success">  • ENDURING - Lasts billions of years</div>
      <div class="log-entry success">  • LOGICAL - Requires no magic</div>
      <div class="log-entry"><br>Your strategy scored:</div>
      <div class="log-entry">  Silence: ${GameState.truthConditions.A}/15 ${GameState.truthConditions.A >= 15 ? '✓' : '✗'}</div>
      <div class="log-entry">  Universality: ${GameState.truthConditions.B}/15 ${GameState.truthConditions.B >= 15 ? '✓' : '✗'}</div>
      <div class="log-entry">  Variance: ${GameState.truthConditions.C}/15 ${GameState.truthConditions.C >= 15 ? '✓' : '✗'}</div>
      <div class="log-entry">  Scale: ${GameState.truthConditions.D}/15 ${GameState.truthConditions.D >= 15 ? '✓' : '✗'}</div>
      <div class="log-entry">  Logic: ${GameState.truthConditions.E}/15 ${GameState.truthConditions.E >= 15 ? '✓' : '✗'}</div>
      <div class="log-entry"><br>=== THE CYCLE ===</div>
      <div class="log-entry warning">Civilization #${GameState.civilization.id} has escaped.</div>
      <div class="log-entry warning">They will consume the galaxy.</div>
      <div class="log-entry warning">The Great Silence is broken.</div>
      <div class="log-entry"><br></div>
      <div class="log-entry success">It is now Civilization #${nextCivId}'s turn</div>
      <div class="log-entry success">to stop the cycle.</div>
    `;
  }

  // Show Begin Again button
  showBeginAgainButton();
}

function showBeginAgainButton() {
  const container = document.getElementById('postmortem-screen');

  // Remove existing button if any
  const existingBtn = document.getElementById('begin-again-btn');
  if (existingBtn) {
    existingBtn.remove();
  }

  const beginAgainBtn = document.createElement('button');
  beginAgainBtn.id = 'begin-again-btn';
  beginAgainBtn.className = 'pixel-btn';
  beginAgainBtn.textContent = 'BEGIN AGAIN';
  beginAgainBtn.style.position = 'absolute';
  beginAgainBtn.style.bottom = '20px';
  beginAgainBtn.style.left = '50%';
  beginAgainBtn.style.transform = 'translateX(-50%)';
  beginAgainBtn.addEventListener('click', () => {
    resetGame(true); // Skip intro
  });

  container.appendChild(beginAgainBtn);
}

// ========== SCREEN MANAGEMENT ==========
function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  setTimeout(() => {
    document.getElementById(screenId).classList.add('active');
  }, 100);
}

// ========== GAME INITIALIZATION ==========
function initGame() {
  renderCanvas();

  document.getElementById('start-btn').addEventListener('click', () => {
    GameState.phase = 'selection';
    switchScreen('card-screen');
    setupCategoryTabs();
    renderCardList();
    updateHUD();
  });

  document.getElementById('deploy-btn').addEventListener('click', () => {
    if (GameState.selectedFilters.length === 0) {
      alert('Select at least one filter!');
      return;
    }

    GameState.phase = 'simulation';
    startSimulation();
  });

  document.getElementById('filters-hud').addEventListener('click', () => {
    openFiltersModal();
  });

  document.getElementById('close-filters-btn').addEventListener('click', () => {
    closeFiltersModal();
  });

  document.getElementById('rules-hud').addEventListener('click', () => {
    openRulesModal();
  });

  document.getElementById('close-rules-btn').addEventListener('click', () => {
    closeRulesModal();
  });

  document.getElementById('card-modal').addEventListener('click', (e) => {
    if (e.target.id === 'card-modal') {
      closeCardModal();
    }
  });

  document.getElementById('filters-modal').addEventListener('click', (e) => {
    if (e.target.id === 'filters-modal') {
      closeFiltersModal();
    }
  });

  document.getElementById('rules-modal').addEventListener('click', (e) => {
    if (e.target.id === 'rules-modal') {
      closeRulesModal();
    }
  });
}

function resetGame(skipIntro = false) {
  GameState.phase = skipIntro ? 'selection' : 'intro';
  GameState.selectedFilters = [];
  GameState.entropyBudget = 60;
  GameState.entropySpent = 0;
  GameState.truthConditions = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  GameState.currentCategory = 'physical';
  GameState.civilization = {
    id: null,
    stage: 'MOLTEN',
    resilience: 50,
    age: 0,
    stageProgress: 0
  };
  GameState.simulationLog = [];
  GameState.outcome = null;
  GameState.failureReasons = [];

  document.getElementById('sim-log').innerHTML = '';
  document.getElementById('postmortem-log').innerHTML = '';
  document.getElementById('outcome-header').className = 'terminal-header';

  // Remove Begin Again button if it exists
  const beginAgainBtn = document.getElementById('begin-again-btn');
  if (beginAgainBtn) {
    beginAgainBtn.remove();
  }

  renderCanvas();

  if (skipIntro) {
    switchScreen('card-screen');
    setupCategoryTabs();
    renderCardList();
    updateHUD();
  } else {
    switchScreen('intro-screen');
  }
}

initGame();
