const fsPromises = require('fs/promises');
const path = require('path');

// TODO - get this from the server
// https://noita.wiki.gg/index.php?title=Special:CargoExport&tables=Spells&&fields=_pageName%2Cid%2Cname%2Ctype&&order+by=&limit=500&format=json
const cargoSpells = [
  {
    _pageName: '??? (Spell)',
    id: 'FUNKY_SPELL',
    name: '???',
    type: 'Projectile',
  },
  {
    _pageName: 'Accelerating Shot',
    id: 'ACCELERATING_SHOT',
    name: 'Accelerating Shot',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Accelerative Homing',
    id: 'HOMING_ACCELERATING',
    name: 'Accelerative Homing',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Acid (Spell)',
    id: 'MATERIAL_ACID',
    name: 'Acid',
    type: 'Material',
  },
  {
    _pageName: 'Acid Ball',
    id: 'ACIDSHOT',
    name: 'Acid Ball',
    type: 'Projectile',
  },
  {
    _pageName: 'Acid Trail',
    id: 'ACID_TRAIL',
    name: 'Acid Trail',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Add Mana',
    id: 'MANA_REDUCE',
    name: 'Add Mana',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Add Trigger',
    id: 'ADD_DEATH_TRIGGER',
    name: 'Add Expiration Trigger',
    type: 'Other',
  },
  {
    _pageName: 'Add Trigger',
    id: 'ADD_TIMER',
    name: 'Add Timer',
    type: 'Other',
  },
  {
    _pageName: 'Add Trigger',
    id: 'ADD_TRIGGER',
    name: 'Add Trigger',
    type: 'Other',
  },
  {
    _pageName: 'Aiming Arc',
    id: 'HOMING_CURSOR',
    name: 'Aiming Arc',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'All-Seeing Eye',
    id: 'X_RAY',
    name: 'All-Seeing Eye',
    type: 'Utility',
  },
  {
    _pageName: 'Alpha',
    id: 'ALPHA',
    name: 'Alpha',
    type: 'Other',
  },
  {
    _pageName: 'Anti Homing',
    id: 'ANTI_HOMING',
    name: 'Anti Homing',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Anti-Gravity',
    id: 'GRAVITY_ANTI',
    name: 'Anti-Gravity',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Arrow',
    id: 'ARROW',
    name: 'Arrow',
    type: 'Projectile',
  },
  {
    _pageName: 'Auto-Aim',
    id: 'AUTOAIM',
    name: 'Auto-Aim',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Avoiding Arc',
    id: 'AVOIDING_ARC',
    name: 'Avoiding Arc',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Ball Lightning',
    id: 'BALL_LIGHTNING',
    name: 'Ball Lightning',
    type: 'Projectile',
  },
  {
    _pageName: 'Barrier',
    id: 'WALL_HORIZONTAL',
    name: 'Horizontal Barrier',
    type: 'Static projectile',
  },
  {
    _pageName: 'Barrier',
    id: 'WALL_SQUARE',
    name: 'Square Barrier',
    type: 'Static projectile',
  },
  {
    _pageName: 'Barrier',
    id: 'WALL_VERTICAL',
    name: 'Vertical Barrier',
    type: 'Static projectile',
  },
  {
    _pageName: 'Black Hole',
    id: 'BLACK_HOLE',
    name: 'Black Hole',
    type: 'Projectile',
  },
  {
    _pageName: 'Black Hole',
    id: 'BLACK_HOLE_DEATH_TRIGGER',
    name: 'Black Hole with Death Trigger',
    type: 'Projectile',
  },
  {
    _pageName: 'Blood (Spell)',
    id: 'MATERIAL_BLOOD',
    name: 'Blood',
    type: 'Material',
  },
  {
    _pageName: 'Blood Magic',
    id: 'BLOOD_MAGIC',
    name: 'Blood Magic',
    type: 'Utility',
  },
  {
    _pageName: 'Blood To Acid',
    id: 'BLOOD_TO_ACID',
    name: 'Blood To Acid',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Blood To Power',
    id: 'BLOOD_TO_POWER',
    name: 'Blood To Power',
    type: 'Utility',
  },
  {
    _pageName: 'Bloodlust',
    id: 'BLOODLUST',
    name: 'Bloodlust',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Bomb',
    id: 'BOMB',
    name: 'Bomb',
    type: 'Projectile',
  },
  {
    _pageName: 'Bomb Cart',
    id: 'BOMB_CART',
    name: 'Bomb Cart',
    type: 'Projectile',
  },
  {
    _pageName: 'Boomerang',
    id: 'HOMING_SHOOTER',
    name: 'Boomerang',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Bounce',
    id: 'BOUNCE',
    name: 'Bounce',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Bouncing Burst',
    id: 'RUBBER_BALL',
    name: 'Bouncing Burst',
    type: 'Projectile',
  },
  {
    _pageName: 'Bubble Spark',
    id: 'BUBBLESHOT',
    name: 'Bubble Spark',
    type: 'Projectile',
  },
  {
    _pageName: 'Bubble Spark',
    id: 'BUBBLESHOT_TRIGGER',
    name: 'Bubble Spark With Trigger',
    type: 'Projectile',
  },
  {
    _pageName: 'Bubbly Bounce',
    id: 'BOUNCE_SPARK',
    name: 'Bubbly Bounce',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Burning Trail',
    id: 'BURN_TRAIL',
    name: 'Burning Trail',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Burst of Air',
    id: 'AIR_BULLET',
    name: 'Burst Of Air',
    type: 'Projectile',
  },
  {
    _pageName: 'Cement (Spell)',
    id: 'MATERIAL_CEMENT',
    name: 'Cement',
    type: 'Material',
  },
  {
    _pageName: 'Cessation',
    id: 'CESSATION',
    name: 'Cessation',
    type: 'Other',
  },
  {
    _pageName: 'Chain Bolt',
    id: 'CHAIN_BOLT',
    name: 'Chain Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Chain Spell',
    id: 'CHAIN_SHOT',
    name: 'Chain Spell',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Chainsaw',
    id: 'CHAINSAW',
    name: 'Chainsaw',
    type: 'Projectile',
  },
  {
    _pageName: 'Chaos Larpa',
    id: 'LARPA_CHAOS',
    name: 'Chaos Larpa',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Chaos Magic',
    id: 'RANDOM_EXPLOSION',
    name: 'Chaos Magic',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Chaotic Path',
    id: 'CHAOTIC_ARC',
    name: 'Chaotic Path',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Chaotic Transmutation',
    id: 'TRANSMUTATION',
    name: 'Chaotic Transmutation',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Charm On Toxic Sludge',
    id: 'HITFX_TOXIC_CHARM',
    name: 'Charm On Toxic Sludge',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Chunk of Soil',
    id: 'SOILBALL',
    name: 'Chunk Of Soil',
    type: 'Material',
  },
  {
    _pageName: 'Circle of (Material)',
    id: 'CIRCLE_ACID',
    name: 'Circle of Acid',
    type: 'Material',
  },
  {
    _pageName: 'Circle of (Material)',
    id: 'CIRCLE_FIRE',
    name: 'Circle of Fire',
    type: 'Material',
  },
  {
    _pageName: 'Circle of (Material)',
    id: 'CIRCLE_OIL',
    name: 'Circle of Oil',
    type: 'Material',
  },
  {
    _pageName: 'Circle of (Material)',
    id: 'CIRCLE_WATER',
    name: 'Circle of water',
    type: 'Material',
  },
  {
    _pageName: 'Circle of Buoyancy',
    id: 'LEVITATION_FIELD',
    name: 'Circle of Buoyancy',
    type: 'Static projectile',
  },
  {
    _pageName: 'Circle of Displacement',
    id: 'TELEPORTATION_FIELD',
    name: 'Circle of Displacement',
    type: 'Static projectile',
  },
  {
    _pageName: 'Circle of Fervour',
    id: 'BERSERK_FIELD',
    name: 'Circle of Fervour',
    type: 'Static projectile',
  },
  {
    _pageName: 'Circle of Shielding',
    id: 'SHIELD_FIELD',
    name: 'Circle of Shielding',
    type: 'Static projectile',
  },
  {
    _pageName: 'Circle of Stillness',
    id: 'FREEZE_FIELD',
    name: 'Circle of Stillness',
    type: 'Static projectile',
  },
  {
    _pageName: 'Circle of Thunder',
    id: 'ELECTROCUTION_FIELD',
    name: 'Circle of Thunder',
    type: 'Static projectile',
  },
  {
    _pageName: 'Circle of Transmogrification',
    id: 'POLYMORPH_FIELD',
    name: 'Circle of Transmogrification',
    type: 'Static projectile',
  },
  {
    _pageName: 'Circle of Unstable Metamorphosis',
    id: 'CHAOS_POLYMORPH_FIELD',
    name: 'Circle of Unstable Metamorphosis',
    type: 'Static projectile',
  },
  {
    _pageName: 'Circle of Vigour',
    id: 'REGENERATION_FIELD',
    name: 'Circle of Vigour',
    type: 'Static projectile',
  },
  {
    _pageName: 'Cloud',
    id: 'CLOUD_ACID',
    name: 'Acid Cloud',
    type: 'Static projectile',
  },
  {
    _pageName: 'Cloud',
    id: 'CLOUD_BLOOD',
    name: 'Blood Cloud',
    type: 'Static projectile',
  },
  {
    _pageName: 'Cloud',
    id: 'CLOUD_OIL',
    name: 'Oil Cloud',
    type: 'Static projectile',
  },
  {
    _pageName: 'Cloud',
    id: 'CLOUD_THUNDER',
    name: 'Thundercloud',
    type: 'Static projectile',
  },
  {
    _pageName: 'Cloud',
    id: 'CLOUD_WATER',
    name: 'Rain Cloud',
    type: 'Static projectile',
  },
  {
    _pageName: 'Clusterbolt',
    id: 'CLUSTERMOD',
    name: 'Clusterbolt',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Concentrated Explosion',
    id: 'EXPLOSION_TINY',
    name: 'Concentrated Explosion',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Concentrated Light',
    id: 'LASER',
    name: 'Concentrated Light',
    type: 'Projectile',
  },
  {
    _pageName: 'Concentrated Light Bounce',
    id: 'BOUNCE_LASER',
    name: 'Concentrated Light Bounce',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Copy Random Spell',
    id: 'DRAW_RANDOM',
    name: 'Copy Random Spell',
    type: 'Other',
  },
  {
    _pageName: 'Copy Random Spell',
    id: 'DRAW_RANDOM_X3',
    name: 'Copy Random Spell Thrice',
    type: 'Other',
  },
  {
    _pageName: 'Copy Three Random Spells',
    id: 'DRAW_3_RANDOM',
    name: 'Copy Three Random Spells',
    type: 'Other',
  },
  {
    _pageName: 'Copy Trail',
    id: 'LARPA_CHAOS_2',
    name: 'Copy Trail',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Critical On Bloody Enemies',
    id: 'HITFX_CRITICAL_BLOOD',
    name: 'Critical On Bloody Enemies',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Critical on Burning',
    id: 'HITFX_BURNING_CRITICAL_HIT',
    name: 'Critical On Burning',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Critical on Oiled Enemies',
    id: 'HITFX_CRITICAL_OIL',
    name: 'Critical On Oiled Enemies',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Critical on Wet (Water) Enemies',
    id: 'HITFX_CRITICAL_WATER',
    name: 'Critical On Wet (Water) Enemies',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Critical Plus',
    id: 'CRITICAL_HIT',
    name: 'Critical Plus',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Cursed Sphere',
    id: 'CURSED_ORB',
    name: 'Cursed Sphere',
    type: 'Projectile',
  },
  {
    _pageName: 'Damage Field',
    id: 'AREA_DAMAGE',
    name: 'Damage Field',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Damage Plus',
    id: 'DAMAGE',
    name: 'Damage Plus',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Deadly Heal',
    id: 'ANTIHEAL',
    name: 'Deadly Heal',
    type: 'Projectile',
  },
  {
    _pageName: 'Death Cross',
    id: 'DEATH_CROSS',
    name: 'Death Cross',
    type: 'Projectile',
  },
  {
    _pageName: 'Death Cross',
    id: 'DEATH_CROSS_BIG',
    name: 'Giga Death Cross',
    type: 'Projectile',
  },
  {
    _pageName: 'Decelerating Shot',
    id: 'DECELERATING_SHOT',
    name: 'Decelerating Shot',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Delayed Spellcast',
    id: 'DELAYED_SPELL',
    name: 'Delayed Spellcast',
    type: 'Static projectile',
  },
  {
    _pageName: 'Destruction',
    id: 'DESTRUCTION',
    name: 'Destruction',
    type: 'Static projectile',
  },
  {
    _pageName: 'Digging Blast',
    id: 'POWERDIGGER',
    name: 'Digging Blast',
    type: 'Projectile',
  },
  {
    _pageName: 'Digging Bolt',
    id: 'DIGGER',
    name: 'Digging Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Disc Projectile',
    id: 'DISC_BULLET',
    name: 'Disc Projectile',
    type: 'Projectile',
  },
  {
    _pageName: 'Divide By',
    id: 'DIVIDE_10',
    name: 'Divide By 10',
    type: 'Other',
  },
  {
    _pageName: 'Divide By',
    id: 'DIVIDE_2',
    name: 'Divide By 2',
    type: 'Other',
  },
  {
    _pageName: 'Divide By',
    id: 'DIVIDE_3',
    name: 'Divide By 3',
    type: 'Other',
  },
  {
    _pageName: 'Divide By',
    id: 'DIVIDE_4',
    name: 'Divide By 4',
    type: 'Other',
  },
  {
    _pageName: 'Dormant Crystal',
    id: 'PIPE_BOMB',
    name: 'Dormant Crystal',
    type: 'Projectile',
  },
  {
    _pageName: 'Dormant Crystal',
    id: 'PIPE_BOMB_DEATH_TRIGGER',
    name: 'Dormant Crystal With Trigger',
    type: 'Projectile',
  },
  {
    _pageName: 'Downwards Bolt Bundle',
    id: 'ROCKET_DOWNWARDS',
    name: 'Downwards Bolt Bundle',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Downwards Larpa',
    id: 'LARPA_DOWNWARDS',
    name: 'Downwards Larpa',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Drilling Shot',
    id: 'CLIPPING_SHOT',
    name: 'Drilling Shot',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Dropper Bolt',
    id: 'GRENADE_LARGE',
    name: 'Dropper Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Earthquake',
    id: 'CRUMBLING_EARTH',
    name: 'Earthquake',
    type: 'Projectile',
  },
  {
    _pageName: 'Earthquake Shot',
    id: 'CRUMBLING_EARTH_PROJECTILE',
    name: 'Earthquake Shot',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Eldritch Portal',
    id: 'TENTACLE_PORTAL',
    name: 'Eldritch Portal',
    type: 'Projectile',
  },
  {
    _pageName: 'Electric Arc',
    id: 'ARC_ELECTRIC',
    name: 'Electric Arc',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Electric Charge',
    id: 'ELECTRIC_CHARGE',
    name: 'Electric Charge',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Electric Torch',
    id: 'TORCH_ELECTRIC',
    name: 'Electric Torch',
    type: 'Passive',
  },
  {
    _pageName: 'Energy Orb',
    id: 'SLOW_BULLET',
    name: 'Energy Orb',
    type: 'Projectile',
  },
  {
    _pageName: 'Energy Orb',
    id: 'SLOW_BULLET_TIMER',
    name: 'Energy Orb With A Timer',
    type: 'Projectile',
  },
  {
    _pageName: 'Energy Orb',
    id: 'SLOW_BULLET_TRIGGER',
    name: 'Energy Orb With A Trigger',
    type: 'Projectile',
  },
  {
    _pageName: 'Energy Shield',
    id: 'ENERGY_SHIELD',
    name: 'Energy Shield',
    type: 'Passive',
  },
  {
    _pageName: 'Energy Shield',
    id: 'ENERGY_SHIELD_SECTOR',
    name: 'Energy Shield Sector',
    type: 'Passive',
  },
  {
    _pageName: 'Energy Sphere',
    id: 'BOUNCY_ORB',
    name: 'Energy Sphere',
    type: 'Projectile',
  },
  {
    _pageName: 'Energy Sphere',
    id: 'BOUNCY_ORB_TIMER',
    name: 'Energy Sphere With Timer',
    type: 'Projectile',
  },
  {
    _pageName: 'Essence To Power',
    id: 'ESSENCE_TO_POWER',
    name: 'Essence to Power',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Expanding Sphere',
    id: 'EXPANDING_ORB',
    name: 'Expanding Sphere',
    type: 'Projectile',
  },
  {
    _pageName: 'Explosion',
    id: 'EXPLOSION',
    name: 'Explosion',
    type: 'Static projectile',
  },
  {
    _pageName: 'Explosion of Brimstone',
    id: 'FIRE_BLAST',
    name: 'Explosion of Brimstone',
    type: 'Static projectile',
  },
  {
    _pageName: 'Explosion of Poison',
    id: 'POISON_BLAST',
    name: 'Explosion of Poison',
    type: 'Static projectile',
  },
  {
    _pageName: 'Explosion of Spirits',
    id: 'ALCOHOL_BLAST',
    name: 'Explosion of Spirits',
    type: 'Static projectile',
  },
  {
    _pageName: 'Explosion of Thunder',
    id: 'THUNDER_BLAST',
    name: 'Explosion of Thunder',
    type: 'Static projectile',
  },
  {
    _pageName: 'Explosion On Drunk Enemies',
    id: 'HITFX_EXPLOSION_ALCOHOL',
    name: 'Explosion On Drunk Enemies',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Explosion On Drunk Enemies',
    id: 'HITFX_EXPLOSION_ALCOHOL_GIGA',
    name: 'Giant Explosion On Drunk Enemies',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Explosion On Slimy Enemies',
    id: 'HITFX_EXPLOSION_SLIME',
    name: 'Explosion On Slimy Enemies',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Explosion On Slimy Enemies',
    id: 'HITFX_EXPLOSION_SLIME_GIGA',
    name: 'Giant Explosion On Slimy Enemies',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Explosive Bounce',
    id: 'BOUNCE_EXPLOSION',
    name: 'Explosive Bounce',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Explosive Detonator',
    id: 'BOMB_DETONATOR',
    name: 'Explosive Detonator',
    type: 'Static projectile',
  },
  {
    _pageName: 'Explosive Projectile',
    id: 'EXPLOSIVE_PROJECTILE',
    name: 'Explosive Projectile',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Fire Arc',
    id: 'ARC_FIRE',
    name: 'Fire Arc',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Fire Trail',
    id: 'FIRE_TRAIL',
    name: 'Fire Trail',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Fireball',
    id: 'FIREBALL',
    name: 'Fireball',
    type: 'Projectile',
  },
  {
    _pageName: 'Fireball Orbit',
    id: 'ORBIT_FIREBALLS',
    name: 'Fireball Orbit',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Fireball Thrower',
    id: 'FIREBALL_RAY',
    name: 'Fireball Thrower',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Firebolt',
    id: 'GRENADE',
    name: 'Firebolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Firebolt',
    id: 'GRENADE_ANTI',
    name: 'Odd Firebolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Firebolt',
    id: 'GRENADE_TIER_2',
    name: 'Large Firebolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Firebolt',
    id: 'GRENADE_TIER_3',
    name: 'Giant Firebolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Firebolt',
    id: 'GRENADE_TRIGGER',
    name: 'Firebolt With Trigger',
    type: 'Projectile',
  },
  {
    _pageName: 'Firebomb',
    id: 'FIREBOMB',
    name: 'Firebomb',
    type: 'Projectile',
  },
  {
    _pageName: 'Firecrackers',
    id: 'UNSTABLE_GUNPOWDER',
    name: 'Firecrackers',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Fireworks!',
    id: 'FIREWORK',
    name: 'Fireworks!',
    type: 'Projectile',
  },
  {
    _pageName: 'Fizzle',
    id: 'FIZZLE',
    name: 'Fizzle',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Flamethrower',
    id: 'FLAMETHROWER',
    name: 'Flamethrower',
    type: 'Projectile',
  },
  {
    _pageName: 'Floating Arc',
    id: 'FLOATING_ARC',
    name: 'Floating Arc',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Flock of Ducks',
    id: 'EXPLODING_DUCKS',
    name: 'Flock Of Ducks',
    type: 'Projectile',
  },
  {
    _pageName: 'Fly Downwards',
    id: 'FLY_DOWNWARDS',
    name: 'Fly Downwards',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Fly Upwards',
    id: 'FLY_UPWARDS',
    name: 'Fly Upwards',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Formation',
    id: 'CIRCLE_SHAPE',
    name: 'Formation - Hexagon',
    type: 'Multicast',
  },
  {
    _pageName: 'Formation',
    id: 'I_SHAPE',
    name: 'Formation - Behind Your Back',
    type: 'Multicast',
  },
  {
    _pageName: 'Formation',
    id: 'PENTAGRAM_SHAPE',
    name: 'Formation - Pentagon',
    type: 'Multicast',
  },
  {
    _pageName: 'Formation',
    id: 'T_SHAPE',
    name: 'Formation - Above And Below',
    type: 'Multicast',
  },
  {
    _pageName: 'Formation',
    id: 'W_SHAPE',
    name: 'Formation - Trifurcated',
    type: 'Multicast',
  },
  {
    _pageName: 'Formation',
    id: 'Y_SHAPE',
    name: 'Formation - Bifurcated',
    type: 'Multicast',
  },
  {
    _pageName: 'Freeze Charge',
    id: 'FREEZE',
    name: 'Freeze Charge',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Freezing Gaze',
    id: 'FREEZING_GAZE',
    name: 'Freezing Gaze',
    type: 'Projectile',
  },
  {
    _pageName: 'Gamma',
    id: 'GAMMA',
    name: 'Gamma',
    type: 'Other',
  },
  {
    _pageName: 'Giga Black Hole',
    id: 'BLACK_HOLE_BIG',
    name: 'Giga Black Hole',
    type: 'Static projectile',
  },
  {
    _pageName: 'Giga Disc Projectile',
    id: 'DISC_BULLET_BIG',
    name: 'Giga Disc Projectile',
    type: 'Projectile',
  },
  {
    _pageName: 'Giga White Hole',
    id: 'WHITE_HOLE_BIG',
    name: 'Giga White Hole',
    type: 'Static projectile',
  },
  {
    _pageName: 'Glimmer',
    id: 'COLOUR_BLUE',
    name: 'Blue Glimmer',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Glimmer',
    id: 'COLOUR_GREEN',
    name: 'Green Glimmer',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Glimmer',
    id: 'COLOUR_INVIS',
    name: 'Invisible Spell',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Glimmer',
    id: 'COLOUR_ORANGE',
    name: 'Orange Glimmer',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Glimmer',
    id: 'COLOUR_PURPLE',
    name: 'Purple Glimmer',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Glimmer',
    id: 'COLOUR_RAINBOW',
    name: 'Rainbow Glimmer',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Glimmer',
    id: 'COLOUR_RED',
    name: 'Red Glimmer',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Glimmer',
    id: 'COLOUR_YELLOW',
    name: 'Yellow Glimmer',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Glitter Bomb',
    id: 'GLITTER_BOMB',
    name: 'Glitter Bomb',
    type: 'Projectile',
  },
  {
    _pageName: 'Glittering Field',
    id: 'PURPLE_EXPLOSION_FIELD',
    name: 'Glittering Field',
    type: 'Static projectile',
  },
  {
    _pageName: 'Glowing Lance',
    id: 'LANCE',
    name: 'Glowing Lance',
    type: 'Projectile',
  },
  {
    _pageName: 'Glue Ball',
    id: 'GLUE_SHOT',
    name: 'Glue Ball',
    type: 'Projectile',
  },
  {
    _pageName: 'Gold To Power',
    id: 'MONEY_MAGIC',
    name: 'Gold To Power',
    type: 'Utility',
  },
  {
    _pageName: 'Gravity',
    id: 'GRAVITY',
    name: 'Gravity',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Ground to Sand',
    id: 'STATIC_TO_SAND',
    name: 'Ground To Sand',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Gunpowder Arc',
    id: 'ARC_GUNPOWDER',
    name: 'Gunpowder Arc',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Gunpowder Trail',
    id: 'GUNPOWDER_TRAIL',
    name: 'Gunpowder Trail',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Healing Bolt',
    id: 'HEAL_BULLET',
    name: 'Healing Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Heavy Shot',
    id: 'HEAVY_SHOT',
    name: 'Heavy Shot',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Heavy Spread',
    id: 'HEAVY_SPREAD',
    name: 'Heavy Spread',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Holy Bomb',
    id: 'BOMB_HOLY',
    name: 'Holy Bomb',
    type: 'Projectile',
  },
  {
    _pageName: 'Holy Bomb',
    id: 'BOMB_HOLY_GIGA',
    name: 'Giga Holy Bomb',
    type: 'Projectile',
  },
  {
    _pageName: 'Holy Lance',
    id: 'LANCE_HOLY',
    name: 'Holy Lance',
    type: 'Projectile',
  },
  {
    _pageName: 'Homebringer Teleport Bolt',
    id: 'TELEPORT_PROJECTILE_CLOSER',
    name: 'Homebringer Teleport Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Homing',
    id: 'HOMING',
    name: 'Homing',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Hookbolt',
    id: 'HOOK',
    name: 'Hookbolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Horizontal Path',
    id: 'HORIZONTAL_ARC',
    name: 'Horizontal Path',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Iceball',
    id: 'ICEBALL',
    name: 'Iceball',
    type: 'Projectile',
  },
  {
    _pageName: 'Increase Lifetime',
    id: 'LIFETIME',
    name: 'Increase Lifetime',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Infestation',
    id: 'INFESTATION',
    name: 'Infestation',
    type: 'Projectile',
  },
  {
    _pageName: 'Inner Spell',
    id: 'CASTER_CAST',
    name: 'Inner Spell',
    type: 'Utility',
  },
  {
    _pageName: 'Intense Concentrated Light',
    id: 'MEGALASER',
    name: 'Intense Concentrated Light',
    type: 'Projectile',
  },
  {
    _pageName: 'Knockback',
    id: 'KNOCKBACK',
    name: 'Knockback',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Larpa Bounce',
    id: 'BOUNCE_LARPA',
    name: 'Larpa Bounce',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Larpa Explosion',
    id: 'LARPA_DEATH',
    name: 'Larpa Explosion',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Lava To Blood',
    id: 'LAVA_TO_BLOOD',
    name: 'Lava To Blood',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Light',
    id: 'LIGHT',
    name: 'Light',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Light Shot',
    id: 'LIGHT_SHOT',
    name: 'Light Shot',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Lightning Bolt',
    id: 'LIGHTNING',
    name: 'Lightning Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Lightning Bounce',
    id: 'BOUNCE_LIGHTNING',
    name: 'Lightning Bounce',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Lightning Thrower',
    id: 'LIGHTNING_RAY',
    name: 'Lightning Thrower',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Linear Arc',
    id: 'LINE_ARC',
    name: 'Linear Arc',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Liquid Detonation',
    id: 'LIQUID_TO_EXPLOSION',
    name: 'Liquid Detonation',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Liquid Vacuum Field',
    id: 'VACUUM_LIQUID',
    name: 'Liquid Vacuum Field',
    type: 'Static projectile',
  },
  {
    _pageName: 'Long-Distance Cast',
    id: 'LONG_DISTANCE_CAST',
    name: 'Long-Distance Cast',
    type: 'Utility',
  },
  {
    _pageName: 'Luminous Drill',
    id: 'LASER_LUMINOUS_DRILL',
    name: 'Luminous Drill With Timer',
    type: 'Projectile',
  },
  {
    _pageName: 'Luminous Drill',
    id: 'LUMINOUS_DRILL',
    name: 'Luminous Drill',
    type: 'Projectile',
  },
  {
    _pageName: 'Magic Arrow',
    id: 'BULLET',
    name: 'Magic Arrow',
    type: 'Projectile',
  },
  {
    _pageName: 'Magic Arrow',
    id: 'BULLET_TIMER',
    name: 'Magic Arrow With Timer',
    type: 'Projectile',
  },
  {
    _pageName: 'Magic Arrow',
    id: 'BULLET_TRIGGER',
    name: 'Magic Arrow With Trigger',
    type: 'Projectile',
  },
  {
    _pageName: 'Magic Bolt',
    id: 'HEAVY_BULLET',
    name: 'Magic Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Magic Bolt',
    id: 'HEAVY_BULLET_TIMER',
    name: 'Magic Bolt With Timer',
    type: 'Projectile',
  },
  {
    _pageName: 'Magic Bolt',
    id: 'HEAVY_BULLET_TRIGGER',
    name: 'Magic Bolt With Trigger',
    type: 'Projectile',
  },
  {
    _pageName: 'Magic Guard',
    id: 'BIG_MAGIC_SHIELD',
    name: 'Big Magic Guard',
    type: 'Projectile',
  },
  {
    _pageName: 'Magic Guard',
    id: 'MAGIC_SHIELD',
    name: 'Magic Guard',
    type: 'Projectile',
  },
  {
    _pageName: 'Magic Missile',
    id: 'ROCKET',
    name: 'Magic Missile',
    type: 'Projectile',
  },
  {
    _pageName: 'Magic Missile',
    id: 'ROCKET_TIER_2',
    name: 'Large Magic Missile',
    type: 'Projectile',
  },
  {
    _pageName: 'Magic Missile',
    id: 'ROCKET_TIER_3',
    name: 'Giant Magic Missile',
    type: 'Projectile',
  },
  {
    _pageName: 'Magical Explosion',
    id: 'EXPLOSION_LIGHT',
    name: 'Magical Explosion',
    type: 'Static projectile',
  },
  {
    _pageName: 'Mana To Damage',
    id: 'DAMAGE_FOREVER',
    name: 'Mana To Damage',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Matosade',
    id: 'WORM_RAIN',
    name: 'Matosade',
    type: 'Static projectile',
  },
  {
    _pageName: 'Matter Eater',
    id: 'MATTER_EATER',
    name: 'Matter Eater',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Meteor',
    id: 'METEOR',
    name: 'Meteor',
    type: 'Projectile',
  },
  {
    _pageName: 'Meteorisade',
    id: 'METEOR_RAIN',
    name: 'Meteorisade',
    type: 'Static projectile',
  },
  {
    _pageName: 'Mist',
    id: 'MIST_ALCOHOL',
    name: 'Mist Of Spirits',
    type: 'Projectile',
  },
  {
    _pageName: 'Mist',
    id: 'MIST_BLOOD',
    name: 'Blood Mist',
    type: 'Projectile',
  },
  {
    _pageName: 'Mist',
    id: 'MIST_RADIOACTIVE',
    name: 'Toxic Mist',
    type: 'Projectile',
  },
  {
    _pageName: 'Mist',
    id: 'MIST_SLIME',
    name: 'Slime Mist',
    type: 'Projectile',
  },
  {
    _pageName: 'Mu',
    id: 'MU',
    name: 'Mu',
    type: 'Other',
  },
  {
    _pageName: 'Muodonmuutos',
    id: 'MASS_POLYMORPH',
    name: 'Muodonmuutos',
    type: 'Static projectile',
  },
  {
    _pageName: 'Necromancy',
    id: 'NECROMANCY',
    name: 'Necromancy',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Nolla',
    id: 'NOLLA',
    name: 'Nolla',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Note spells',
    id: 'KANTELE_A',
    name: 'Kantele - Note A',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'KANTELE_D',
    name: 'Kantele - Note D',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'KANTELE_DIS',
    name: 'Kantele - Note D+',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'KANTELE_E',
    name: 'Kantele - Note E',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'KANTELE_G',
    name: 'Kantele - Note G',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'OCARINA_A',
    name: 'Ocarina - Note A',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'OCARINA_A2',
    name: 'Ocarina - Note A2',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'OCARINA_B',
    name: 'Ocarina - Note B',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'OCARINA_C',
    name: 'Ocarina - Note C',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'OCARINA_D',
    name: 'Ocarina - Note D',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'OCARINA_E',
    name: 'Ocarina - Note E',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'OCARINA_F',
    name: 'Ocarina - Note F',
    type: 'Other',
  },
  {
    _pageName: 'Note spells',
    id: 'OCARINA_GSHARP',
    name: 'Ocarina - Note G+',
    type: 'Other',
  },
  {
    _pageName: 'Nuke',
    id: 'NUKE',
    name: 'Nuke',
    type: 'Projectile',
  },
  {
    _pageName: 'Nuke',
    id: 'NUKE_GIGA',
    name: 'Giga Nuke',
    type: 'Projectile',
  },
  {
    _pageName: 'Nuke Orbit',
    id: 'ORBIT_NUKES',
    name: 'Nuke Orbit',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Null Shot',
    id: 'ZERO_DAMAGE',
    name: 'Null Shot',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Octagonal Bolt Bundle',
    id: 'ROCKET_OCTAGON',
    name: 'Octagonal Bolt Bundle',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Oil (Spell)',
    id: 'MATERIAL_OIL',
    name: 'Oil',
    type: 'Material',
  },
  {
    _pageName: 'Oil Trail',
    id: 'OIL_TRAIL',
    name: 'Oil Trail',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Omega',
    id: 'OMEGA',
    name: 'Omega',
    type: 'Other',
  },
  {
    _pageName: 'Omega Black Hole',
    id: 'BLACK_HOLE_GIGA',
    name: 'Omega Black Hole',
    type: 'Static projectile',
  },
  {
    _pageName: 'Omega White Hole',
    id: 'WHITE_HOLE_GIGA',
    name: 'Omega White Hole',
    type: 'Static projectile',
  },
  {
    _pageName: 'Orbit Larpa',
    id: 'ORBIT_LARPA',
    name: 'Orbit Larpa',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Orbiting Arc',
    id: 'ORBIT_SHOT',
    name: 'Orbiting Arc',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Path of Dark Flame',
    id: 'DARKFLAME',
    name: 'Path Of Dark Flame',
    type: 'Projectile',
  },
  {
    _pageName: 'Personal Fireball Thrower',
    id: 'FIREBALL_RAY_ENEMY',
    name: 'Personal Fireball Thrower',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Personal Gravity Field',
    id: 'GRAVITY_FIELD_ENEMY',
    name: 'Personal Gravity Field',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Personal Lightning Caster',
    id: 'LIGHTNING_RAY_ENEMY',
    name: 'Personal Lightning Caster',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Personal Tentacler',
    id: 'TENTACLE_RAY_ENEMY',
    name: 'Personal Tentacler',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Petrify',
    id: 'HITFX_PETRIFY',
    name: 'Petrify',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Phasing Arc',
    id: 'PHASING_ARC',
    name: 'Phasing Arc',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Phi',
    id: 'PHI',
    name: 'Phi',
    type: 'Other',
  },
  {
    _pageName: 'Piercing Shot',
    id: 'PIERCING_SHOT',
    name: 'Piercing Shot',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Ping-Pong Path',
    id: 'PINGPONG_PATH',
    name: 'Ping-Pong Path',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Pinpoint of Light',
    id: 'GLOWING_BOLT',
    name: 'Pinpoint Of Light',
    type: 'Projectile',
  },
  {
    _pageName: 'Plasma Beam',
    id: 'LASER_EMITTER',
    name: 'Plasma Beam',
    type: 'Projectile',
  },
  {
    _pageName: 'Plasma Beam Bounce',
    id: 'BOUNCE_LASER_EMITTER',
    name: 'Plasma Beam Bounce',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Plasma Beam Cross',
    id: 'LASER_EMITTER_FOUR',
    name: 'Plasma Beam Cross',
    type: 'Projectile',
  },
  {
    _pageName: 'Plasma Beam Enhancer',
    id: 'LASER_EMITTER_WIDER',
    name: 'Plasma Beam Enhancer',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Plasma Beam Orbit',
    id: 'ORBIT_LASERS',
    name: 'Plasma Beam Orbit',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Plasma Beam Thrower',
    id: 'LASER_EMITTER_RAY',
    name: 'Plasma Beam Thrower',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Plasma Cutter',
    id: 'LASER_EMITTER_CUTTER',
    name: 'Plasma Cutter',
    type: 'Projectile',
  },
  {
    _pageName: 'Plicate Spell',
    id: 'HEXA_SHOT',
    name: 'Heplicate Spell',
    type: 'Utility',
  },
  {
    _pageName: 'Plicate Spell',
    id: 'I_SHOT',
    name: 'Iplicate Spell',
    type: 'Utility',
  },
  {
    _pageName: 'Plicate Spell',
    id: 'PENTA_SHOT',
    name: 'Peplicate Spell',
    type: 'Utility',
  },
  {
    _pageName: 'Plicate Spell',
    id: 'QUAD_SHOT',
    name: 'Quplicate Spell',
    type: 'Utility',
  },
  {
    _pageName: 'Plicate Spell',
    id: 'T_SHOT',
    name: 'Tiplicate Spell',
    type: 'Utility',
  },
  {
    _pageName: 'Plicate Spell',
    id: 'W_SHOT',
    name: 'Wuplicate Spell',
    type: 'Utility',
  },
  {
    _pageName: 'Plicate Spell',
    id: 'Y_SHOT',
    name: 'Yplicate Spell',
    type: 'Utility',
  },
  {
    _pageName: 'Poison Arc',
    id: 'ARC_POISON',
    name: 'Poison Arc',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Poison Trail',
    id: 'POISON_TRAIL',
    name: 'Poison Trail',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Pollen',
    id: 'POLLEN',
    name: 'Pollen',
    type: 'Projectile',
  },
  {
    _pageName: 'Powder Vacuum Field',
    id: 'VACUUM_POWDER',
    name: 'Powder Vacuum Field',
    type: 'Static projectile',
  },
  {
    _pageName: 'Prickly Spore Pod',
    id: 'SPORE_POD',
    name: 'Prickly Spore Pod',
    type: 'Projectile',
  },
  {
    _pageName: 'Projectile Area Teleport',
    id: 'HOMING_AREA',
    name: 'Projectile Area Teleport',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Projectile Energy Shield',
    id: 'ENERGY_SHIELD_SHOT',
    name: 'Projectile Energy Shield',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Projectile Gravity Field',
    id: 'PROJECTILE_GRAVITY_FIELD',
    name: 'Projectile Gravity Field',
    type: 'Static projectile',
  },
  {
    _pageName: 'Projectile Thunder Field',
    id: 'PROJECTILE_THUNDER_FIELD',
    name: 'Projectile Thunder Field',
    type: 'Static projectile',
  },
  {
    _pageName: 'Projectile Transmutation Field',
    id: 'PROJECTILE_TRANSMUTATION_FIELD',
    name: 'Projectile Transmutation Field',
    type: 'Static projectile',
  },
  {
    _pageName: 'Propane Tank',
    id: 'PROPANE_TANK',
    name: 'Propane Tank',
    type: 'Projectile',
  },
  {
    _pageName: 'Quantum Split',
    id: 'QUANTUM_SPLIT',
    name: 'Quantum Split',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Rainbow Trail',
    id: 'RAINBOW_TRAIL',
    name: 'Rainbow Trail',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Random Damage',
    id: 'DAMAGE_RANDOM',
    name: 'Random Damage',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Random Modifier Spell',
    id: 'RANDOM_MODIFIER',
    name: 'Random Modifier Spell',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Random Projectile Spell',
    id: 'RANDOM_PROJECTILE',
    name: 'Random Projectile Spell',
    type: 'Projectile',
  },
  {
    _pageName: 'Random Spell',
    id: 'RANDOM_SPELL',
    name: 'Random Spell',
    type: 'Other',
  },
  {
    _pageName: 'Random Static Projectile Spell',
    id: 'RANDOM_STATIC_PROJECTILE',
    name: 'Random Static Projectile Spell',
    type: 'Static projectile',
  },
  {
    _pageName: 'Recoil',
    id: 'RECOIL',
    name: 'Recoil',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Recoil Damper',
    id: 'RECOIL_DAMPER',
    name: 'Recoil Damper',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Reduce Lifetime',
    id: 'LIFETIME_DOWN',
    name: 'Reduce Lifetime',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Reduce Recharge Time',
    id: 'RECHARGE',
    name: 'Reduce Recharge Time',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Reduce Spread',
    id: 'SPREAD_REDUCE',
    name: 'Reduce Spread',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Remove Bounce',
    id: 'REMOVE_BOUNCE',
    name: 'Remove Bounce',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Remove Explosion',
    id: 'EXPLOSION_REMOVE',
    name: 'Remove Explosion',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Requirement',
    id: 'IF_ELSE',
    name: 'Requirement - Otherwise',
    type: 'Other',
  },
  {
    _pageName: 'Requirement',
    id: 'IF_END',
    name: 'Requirement - Endpoint',
    type: 'Other',
  },
  {
    _pageName: 'Requirement',
    id: 'IF_ENEMY',
    name: 'Requirement - Enemies',
    type: 'Other',
  },
  {
    _pageName: 'Requirement',
    id: 'IF_HALF',
    name: 'Requirement - Every Other',
    type: 'Other',
  },
  {
    _pageName: 'Requirement',
    id: 'IF_HP',
    name: 'Requirement - Low Health',
    type: 'Other',
  },
  {
    _pageName: 'Requirement',
    id: 'IF_PROJECTILE',
    name: 'Requirement - Projectile Spells',
    type: 'Other',
  },
  {
    _pageName: 'Return',
    id: 'TELEPORT_PROJECTILE_STATIC',
    name: 'Return',
    type: 'Projectile',
  },
  {
    _pageName: 'Rock',
    id: 'SUMMON_ROCK',
    name: 'Rock',
    type: 'Projectile',
  },
  {
    _pageName: 'Rotate Towards Foes',
    id: 'HOMING_ROTATE',
    name: 'Rotate Towards Foes',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Sawblade Orbit',
    id: 'ORBIT_DISCS',
    name: 'Sawblade Orbit',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Sea of',
    id: 'SEA_ACID',
    name: 'Sea Of Acid',
    type: 'Material',
  },
  {
    _pageName: 'Sea of',
    id: 'SEA_ACID_GAS',
    name: 'Sea Of Flammable Gas',
    type: 'Material',
  },
  {
    _pageName: 'Sea of',
    id: 'SEA_ALCOHOL',
    name: 'Sea Of Alcohol',
    type: 'Material',
  },
  {
    _pageName: 'Sea of',
    id: 'SEA_LAVA',
    name: 'Sea Of Lava',
    type: 'Material',
  },
  {
    _pageName: 'Sea of',
    id: 'SEA_MIMIC',
    name: 'Sea of Mimicium',
    type: 'Material',
  },
  {
    _pageName: 'Sea of',
    id: 'SEA_OIL',
    name: 'Sea Of Oil',
    type: 'Material',
  },
  {
    _pageName: 'Sea of',
    id: 'SEA_SWAMP',
    name: 'Summon Swamp',
    type: 'Material',
  },
  {
    _pageName: 'Sea of',
    id: 'SEA_WATER',
    name: 'Sea Of Water',
    type: 'Material',
  },
  {
    _pageName: 'Short-range Homing',
    id: 'HOMING_SHORT',
    name: 'Short-range Homing',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Sigma',
    id: 'SIGMA',
    name: 'Sigma',
    type: 'Other',
  },
  {
    _pageName: 'Slimeball',
    id: 'SLIMEBALL',
    name: 'Slimeball',
    type: 'Projectile',
  },
  {
    _pageName: 'Slithering Path',
    id: 'SINEWAVE',
    name: 'Slithering Path',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Slow But Steady',
    id: 'SLOW_BUT_STEADY',
    name: 'Slow But Steady',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Spark Bolt',
    id: 'LIGHT_BULLET',
    name: 'Spark Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Spark Bolt',
    id: 'LIGHT_BULLET_TIMER',
    name: 'Spark Bolt With Timer',
    type: 'Projectile',
  },
  {
    _pageName: 'Spark Bolt',
    id: 'LIGHT_BULLET_TRIGGER',
    name: 'Spark Bolt With Trigger',
    type: 'Projectile',
  },
  {
    _pageName: 'Spark Bolt',
    id: 'LIGHT_BULLET_TRIGGER_2',
    name: 'Spark Bolt With Double Trigger',
    type: 'Projectile',
  },
  {
    _pageName: 'Sparkly Bounce',
    id: 'BOUNCE_SMALL_EXPLOSION',
    name: 'Sparkly Bounce',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Speed Up',
    id: 'SPEED',
    name: 'Speed Up',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Spell Duplication',
    id: 'DUPLICATE',
    name: 'Spell Duplication',
    type: 'Other',
  },
  {
    _pageName: 'Spells To Acid',
    id: 'ALL_ACID',
    name: 'Spells To Acid',
    type: 'Utility',
  },
  {
    _pageName: 'Spells To Black Holes',
    id: 'ALL_BLACKHOLES',
    name: 'Spells To Black Holes',
    type: 'Utility',
  },
  {
    _pageName: 'Spells To Death Crosses',
    id: 'ALL_DEATHCROSSES',
    name: 'Spells To Death Crosses',
    type: 'Utility',
  },
  {
    _pageName: 'Spells To Giga Sawblades',
    id: 'ALL_DISCS',
    name: 'Spells To Giga Sawblades',
    type: 'Utility',
  },
  {
    _pageName: 'Spells To Magic Missiles',
    id: 'ALL_ROCKETS',
    name: 'Spells To Magic Missiles',
    type: 'Utility',
  },
  {
    _pageName: 'Spells To Nukes',
    id: 'ALL_NUKES',
    name: 'Spells To Nukes',
    type: 'Utility',
  },
  {
    _pageName: 'Spells To Power',
    id: 'SPELLS_TO_POWER',
    name: 'Spells To Power',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Spiral Arc',
    id: 'SPIRALING_SHOT',
    name: 'Spiral Arc',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Spiral Shot',
    id: 'SPIRAL_SHOT',
    name: 'Spiral Shot',
    type: 'Projectile',
  },
  {
    _pageName: 'Spitter Bolt',
    id: 'SPITTER',
    name: 'Spitter Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Spitter Bolt',
    id: 'SPITTER_TIER_2',
    name: 'Large Spitter Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Spitter Bolt',
    id: 'SPITTER_TIER_2_TIMER',
    name: 'Large Spitter Bolt With Timer',
    type: 'Projectile',
  },
  {
    _pageName: 'Spitter Bolt',
    id: 'SPITTER_TIER_3',
    name: 'Giant Spitter Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Spitter Bolt',
    id: 'SPITTER_TIER_3_TIMER',
    name: 'Giant Spitter Bolt With Timer',
    type: 'Projectile',
  },
  {
    _pageName: 'Spitter Bolt',
    id: 'SPITTER_TIMER',
    name: 'Spitter Bolt With Timer',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Deercoy',
    id: 'EXPLODING_DEER',
    name: 'Summon Deercoy',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Egg',
    id: 'SUMMON_EGG',
    name: 'Summon Egg',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Explosive Box',
    id: 'TNTBOX',
    name: 'Summon Explosive Box',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Explosive Box',
    id: 'TNTBOX_BIG',
    name: 'Summon Large Explosive Box',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Fish',
    id: 'FISH',
    name: 'Summon Fish',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Friendly Fly',
    id: 'FRIEND_FLY',
    name: 'Summon Friendly Fly',
    type: 'Static projectile',
  },
  {
    _pageName: 'Summon Hollow Egg',
    id: 'SUMMON_HOLLOW_EGG',
    name: 'Summon Hollow Egg',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Missile',
    id: 'MISSILE',
    name: 'Summon Missile',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Omega Sawblade',
    id: 'DISC_BULLET_BIGGER',
    name: 'Summon Omega Sawblade',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Platform',
    id: 'TEMPORARY_PLATFORM',
    name: 'Summon Platform',
    type: 'Utility',
  },
  {
    _pageName: 'Summon Portal',
    id: 'SUMMON_PORTAL',
    name: 'Summon Portal',
    type: 'Other',
  },
  {
    _pageName: 'Summon Rock Spirit',
    id: 'PEBBLE',
    name: 'Summon Rock Spirit',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Swarm',
    id: 'SWARM_FIREBUG',
    name: 'Summon Firebug Swarm',
    type: 'Static projectile',
  },
  {
    _pageName: 'Summon Swarm',
    id: 'SWARM_FLY',
    name: 'Summon Fly Swarm',
    type: 'Static projectile',
  },
  {
    _pageName: 'Summon Swarm',
    id: 'SWARM_WASP',
    name: 'Summon Wasp Swarm',
    type: 'Static projectile',
  },
  {
    _pageName: 'Summon Taikasauva',
    id: 'SUMMON_WANDGHOST',
    name: 'Summon Taikasauva',
    type: 'Utility',
  },
  {
    _pageName: 'Summon Tentacle',
    id: 'TENTACLE',
    name: 'Summon Tentacle',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Tentacle',
    id: 'TENTACLE_TIMER',
    name: 'Summon Tentacle With Timer',
    type: 'Projectile',
  },
  {
    _pageName: 'Summon Tiny Ghost',
    id: 'TINY_GHOST',
    name: 'Summon Tiny Ghost',
    type: 'Passive',
  },
  {
    _pageName: 'Summon Wall',
    id: 'TEMPORARY_WALL',
    name: 'Summon Wall',
    type: 'Utility',
  },
  {
    _pageName: 'Swapper',
    id: 'SWAPPER_PROJECTILE',
    name: 'Swapper',
    type: 'Projectile',
  },
  {
    _pageName: 'Tau',
    id: 'TAU',
    name: 'Tau',
    type: 'Other',
  },
  {
    _pageName: 'Teleport Bolt',
    id: 'TELEPORT_PROJECTILE',
    name: 'Teleport Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Teleport Bolt',
    id: 'TELEPORT_PROJECTILE_SHORT',
    name: 'Small Teleport Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'Teleporting Cast',
    id: 'TELEPORT_CAST',
    name: 'Teleporting Cast',
    type: 'Utility',
  },
  {
    _pageName: 'Tentacler',
    id: 'TENTACLE_RAY',
    name: 'Tentacler',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'The End of Everything',
    id: 'ALL_SPELLS',
    name: 'The End Of Everything',
    type: 'Other',
  },
  {
    _pageName: 'Thunder Charge',
    id: 'THUNDERBALL',
    name: 'Thunder Charge',
    type: 'Projectile',
  },
  {
    _pageName: 'TNT',
    id: 'DYNAMITE',
    name: 'Dynamite',
    type: 'Projectile',
  },
  {
    _pageName: 'Torch',
    id: 'TORCH',
    name: 'Torch',
    type: 'Passive',
  },
  {
    _pageName: 'Touch of',
    id: 'TOUCH_ALCOHOL',
    name: 'Touch Of Spirits',
    type: 'Material',
  },
  {
    _pageName: 'Touch of',
    id: 'TOUCH_BLOOD',
    name: 'Touch Of Blood',
    type: 'Material',
  },
  {
    _pageName: 'Touch of',
    id: 'TOUCH_GOLD',
    name: 'Touch Of Gold',
    type: 'Material',
  },
  {
    _pageName: 'Touch of',
    id: 'TOUCH_OIL',
    name: 'Touch Of Oil',
    type: 'Material',
  },
  {
    _pageName: 'Touch of',
    id: 'TOUCH_SMOKE',
    name: 'Touch Of Smoke',
    type: 'Material',
  },
  {
    _pageName: 'Touch of',
    id: 'TOUCH_WATER',
    name: 'Touch Of Water',
    type: 'Material',
  },
  {
    _pageName: 'Touch of Gold?',
    id: 'TOUCH_PISS',
    name: 'Touch of Gold?',
    type: 'Material',
  },
  {
    _pageName: 'Touch of Grass',
    id: 'TOUCH_GRASS',
    name: 'Touch of Grass',
    type: 'Material',
  },
  {
    _pageName: 'Toxic Sludge To Acid',
    id: 'TOXIC_TO_ACID',
    name: 'Toxic Sludge To Acid',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Triplicate Bolt',
    id: 'BUCKSHOT',
    name: 'Triplicate Bolt',
    type: 'Projectile',
  },
  {
    _pageName: 'True Orbit',
    id: 'TRUE_ORBIT',
    name: 'True Orbit',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Tuple Scatter Spell',
    id: 'SCATTER_2',
    name: 'Double Scatter Spell',
    type: 'Multicast',
  },
  {
    _pageName: 'Tuple Scatter Spell',
    id: 'SCATTER_3',
    name: 'Triple Scatter Spell',
    type: 'Multicast',
  },
  {
    _pageName: 'Tuple Scatter Spell',
    id: 'SCATTER_4',
    name: 'Quadruple Scatter Spell',
    type: 'Multicast',
  },
  {
    _pageName: 'Tuple Spell',
    id: 'BURST_2',
    name: 'Double Spell',
    type: 'Multicast',
  },
  {
    _pageName: 'Tuple Spell',
    id: 'BURST_3',
    name: 'Triple Spell',
    type: 'Multicast',
  },
  {
    _pageName: 'Tuple Spell',
    id: 'BURST_4',
    name: 'Quadruple Spell',
    type: 'Multicast',
  },
  {
    _pageName: 'Tuple Spell',
    id: 'BURST_8',
    name: 'Octuple Spell',
    type: 'Multicast',
  },
  {
    _pageName: 'Tuple Spell',
    id: 'BURST_X',
    name: 'Myriad Spell',
    type: 'Multicast',
  },
  {
    _pageName: 'Two-Way Fireball Thrower',
    id: 'FIREBALL_RAY_LINE',
    name: 'Two-Way Fireball Thrower',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Unstable Crystal',
    id: 'MINE',
    name: 'Unstable Crystal',
    type: 'Projectile',
  },
  {
    _pageName: 'Unstable Crystal',
    id: 'MINE_DEATH_TRIGGER',
    name: 'Unstable Crystal With Trigger',
    type: 'Projectile',
  },
  {
    _pageName: 'Upwards Larpa',
    id: 'LARPA_UPWARDS',
    name: 'Upwards Larpa',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Vacuum Bounce',
    id: 'BOUNCE_HOLE',
    name: 'Vacuum Bounce',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Vacuum Field',
    id: 'VACUUM_ENTITIES',
    name: 'Vacuum Field',
    type: 'Static projectile',
  },
  {
    _pageName: 'Venomous Curse',
    id: 'CURSE',
    name: 'Venomous Curse',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Wand Homing',
    id: 'HOMING_WAND',
    name: 'Wand Homing',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Wand Refresh',
    id: 'RESET',
    name: 'Wand Refresh',
    type: 'Utility',
  },
  {
    _pageName: 'Warp Cast',
    id: 'SUPER_TELEPORT_CAST',
    name: 'Warp Cast',
    type: 'Utility',
  },
  {
    _pageName: 'Water (Spell)',
    id: 'MATERIAL_WATER',
    name: 'Water',
    type: 'Material',
  },
  {
    _pageName: 'Water To Poison',
    id: 'WATER_TO_POISON',
    name: 'Water To Poison',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Water Trail',
    id: 'WATER_TRAIL',
    name: 'Water Trail',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Weakening Curse',
    id: 'CURSE_WITHER_ELECTRICITY',
    name: 'Weakening Curse - Electricity',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Weakening Curse',
    id: 'CURSE_WITHER_EXPLOSION',
    name: 'Weakening Curse - Explosives',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Weakening Curse',
    id: 'CURSE_WITHER_MELEE',
    name: 'Weakening Curse - Melee',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'Weakening Curse',
    id: 'CURSE_WITHER_PROJECTILE',
    name: 'Weakening Curse - Projectiles',
    type: 'Projectile modifier',
  },
  {
    _pageName: 'White Hole',
    id: 'WHITE_HOLE',
    name: 'White Hole',
    type: 'Projectile',
  },
  {
    _pageName: 'Worm Launcher',
    id: 'WORM_SHOT',
    name: 'Worm Launcher',
    type: 'Projectile',
  },
  {
    _pageName: 'Zeta',
    id: 'ZETA',
    name: 'Zeta',
    type: 'Other',
  },
];

const typeMap = new Map([
  ['Projectile', 'var(--color-spell-projectile)'],
  ['Static projectile', 'var(--color-spell-static)'],
  ['Passive', 'var(--color-spell-passive)'],
  ['Utility', 'var(--color-spell-utility)'],
  ['Projectile modifier', 'var(--color-spell-modifier)'],
  ['Material', 'var(--color-spell-material)'],
  ['Multicast', 'var(--color-spell-multicast)'],
  ['Other', 'var(--color-spell-other)'],
]);

const groupByField = (items, field) => [
  ...items
    .reduce(
      (map, cur) => map.set(cur[field], [...(map.get(cur[field]) ?? []), cur]),
      new Map(),
    )
    .entries(),
];

const spells = cargoSpells.map(({ _pageName, name, id, type }) => ({
  pageName: _pageName,
  name,
  id,
  idVar: `var(--sprite-action-${id.toLowerCase().replace('_', '-')})`,
  type,
  typeVar: typeMap.get(type),
}));

const groupedByPage = groupByField(spells, 'pageName');

const groupedByType = groupByField(spells, 'typeVar');

// console.log(spells);

// a:is([title="Boomerang"], ...)::before {
const befores = `a:is(${spells
  .map(
    ({ name }) => `
  [title="${name}"]`,
  )
  .join(`,`)})::before {
  content: '';
  background-size:  1.2em;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  box-sizing: content-box;
  display: inline-flex;
  image-rendering: pixelated;
  vertical-align: text-bottom;
  width: 1.1em;
  aspect-ratio: 1;
  padding-top: 0;
  margin-right: 0.2em;
/*   border-style: solid; */
/*   border-width: 0 0.06em 0.1em 0.22em;
  border-radius: 0.16em 0.16em 0.6em 0.6em / 1.2em 0.2em 0.2em 1.2em;
  border-color: transparent transparent var(--color-bd) var(--color-bd);
  background-color: var(--color-spell-background);*/
  background-image: var(--bg-image);
}`;

// a:is([title="Heal Projectile"], ...)
// const anchors = `a:is(${spells
const anchors = `${spells
  .map(
    ({ name }) => `
a[title="${name}"]`,
  )
  // .join(`,`)}) {
  .join(`,`)} {
  --color-bd: var(--color-spell-base, transparent);
  background-size: 1.2em;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  /*! vertical-align: text-bottom; */
  padding-top: 0;
  margin-right: 0.2em;
  border-style: solid;
  border-width: 0.28em;
  border-radius: 0.16em;
  line-height: 1;
}`;
// border-width: 0 0 0.14em 0.28em;
// border-radius: 0.16em 0.16em 0.6em 0.6em / 1.2em 0.2em 0.2em 1.2em;

const types = groupedByType
  .map(
    ([typeVar, spells]) =>
      // `a:is(${spells
      `${spells
        .map(
          ({ name }) => `
a[title="${name}"]`,
        )
        // .join(`,`)}) {
        .join(`,`)} {
  border-color: ${typeVar};
}`,
  )
  .join('\n');
// --color-spell-base: ${typeVar};

// --bg-image: url('https://noita.wiki.gg/images/9/90/Spell_homing_shooter.png');
// a[title="Boomerang"] {
const icons = spells
  .map(
    ({ pageName, name, idVar }) =>
      `a[title="${name}"] { background-image: ${idVar}; }`,
  )
  .join('\n');

const outfileCSS = 'src/app/calc/__generated__/main/wikiSprites.css';

fsPromises.writeFile(
  path.join(process.cwd(), outfileCSS),
  `/* Auto-generated file */

${befores}

${anchors}

${types}

${icons}`,
);
