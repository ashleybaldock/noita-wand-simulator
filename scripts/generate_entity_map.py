import re
from collections import OrderedDict
from common import *

srcFile = "data/scripts/gun/gun_actions.lua"
dstFileEntityMap = "./src/app/calc/__generated__/main/entityMap.ts"
dstFileProjectileIds = "./src/app/calc/__generated__/main/projectileIds.ts"

multiline_comment_pattern = r'--\[\[.*?]]--'
singleline_comment_pattern = r'--.*?$'

action_pattern = r'(\t+){\s*id\s*=\s*\"(\w+)\".*?\1}'
add_proctile_pattern = r'add_projectile(?:|_trigger_hit_world|_trigger_timer|_trigger_death)\(\"([\w/.]+)\"'
related_projectiles_pattern = r'related_projectiles\s*=\s*\{([\s\w/.,"]*)\}'
related_projectile_pattern = r'\s*\"([\w/.]*)\"'


def processFile(srcFile):
  with open(srcFile) as inFile:
    content = inFile.read()

  content = preProcess(content)

  exceptions = [
    'SUMMON_EGG',
    'FIREWORK',
    'WORM_RAIN'
  ]

  entity_map = dict()

  entity_set = set()

  def add_entity_action(entity_path, action_id, force=False):
    if not force and action_id in exceptions:
      return

    if not entity_path.endswith('.xml'):
      print(f'warning: invalid entity path: {entity_path} ({action_id})')

    if entity_path not in entity_map:
      entity_map[entity_path] = list()

    entity_map[entity_path].append(action_id)


  projectile_mismatch_errors = []

  for action_m in re.finditer(action_pattern, content, re.DOTALL):
    action_id = action_m.group(2)

    related_projectiles = []

    for related_m in re.finditer(related_projectiles_pattern, action_m.group(0)):
      for related_proj_m in re.finditer(related_projectile_pattern, related_m.group(0)):
        entity_set.add(related_proj_m.group(1))

        related_projectiles.append(related_proj_m.group(1))

    match_count = 0
    for proj_m in re.finditer(add_proctile_pattern, action_m.group(0)):
      entity_set.add(proj_m.group(1))

      match_count += 1
      entity_path = proj_m.group(1)

      if not entity_path in related_projectiles:
        projectile_mismatch_errors.append([action_id, entity_path, related_projectiles])

      add_entity_action(entity_path, action_id)

  print('---')
  print('These actions call add_projectile with entities not defined in their related_projectiles:')
  for mismatch in projectile_mismatch_errors:
    print(f'{mismatch[0]}, `{mismatch[1]}`, {mismatch[2]}')

  # hardcode the buggy spells which have a different related_projectile
  add_entity_action(f'data/entities/projectiles/deck/worm_rain.xml', 'WORM_RAIN', True);
  add_entity_action(f'data/entities/projectiles/deck/worm_big.xml', 'WORM_RAIN', True);

  add_entity_action(f'data/entities/projectiles/deck/caster_cast.xml', 'CASTER_CAST', True);

  # hardcode some dynamically generated entity paths
  for types in ['pink', 'green', 'blue', 'orange']:
    add_entity_action(f'data/entities/projectiles/deck/fireworks/firework_{types}.xml', 'FIREWORK', True)

  for types in ["monster", "slime", "red", "fire"]:
    add_entity_action(f'data/entities/items/pickup/egg_{types}.xml', 'SUMMON_EGG', True)

  # lines = list()
  # lines.append('export const entityToActionIds = {')

  # for k, vs in entity_map.items():
  #   v_str = ','.join([f'\'{v}\'' for v in list(OrderedDict.fromkeys(vs))])
  #   lines.append(f'  \'{k}\': [{v_str}],')

  # lines.append('}')

  with open(dstFileEntityMap, 'w') as outFile:
    outFile.write(autoHeader() + """

export const entityToActionIds = {
""" + ",\n".join(f'  \'{k}\': [{joinList(OrderedDict.fromkeys(vs))}]' for k, vs in iter(entity_map.items())) + """,
};

""" + autoFooter())

  with open(dstFileProjectileIds, 'w') as outFile:
    outFile.write(autoHeader() + """

export const projectileIds = [
  "data/entities/items/pickup/egg_slime.xml",
  "data/entities/items/pickup/egg_red.xml",
  "data/entities/items/pickup/egg_fire.xml",
  "data/entities/projectiles/deck/fireworks/firework_green.xml",
  "data/entities/projectiles/deck/fireworks/firework_blue.xml",
  "data/entities/projectiles/deck/fireworks/firework_orange.xml",
""" + ",\n".join(f'  \'{uniqueEntity}\'' for uniqueEntity in iter(entity_set)) + """,
] as const;

""" + autoFooter())


processFile(srcFile)
