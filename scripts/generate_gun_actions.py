import os
import re
from dataclasses import dataclass
from re import Match

srcFile = 'data/scripts/gun/gun_actions.lua'
srcFileBeta = 'data/scripts/gun/gun_actions.beta.lua'

spellsBefore = """import {
  hand,
  deck,
  discarded,
  shot_effects,
  current_reload_time,
  setCurrentReloadTime,
  mana,
  setMana,
  setDontDrawActions,
  force_stop_draws,
  setForceStopDraws,
  clearDiscarded,
  clearHand,
  clearDeck,
  add_projectile,
  add_projectile_trigger_hit_world,
  add_projectile_trigger_timer,
  add_projectile_trigger_death,
  draw_actions,
  check_recursion,
  ACTION_DRAW_RELOAD_TIME_INCREASE,
  move_discarded_to_deck,
  order_deck,
  reflecting,
  call_action,
} from "../../gun";
import {
  EntityGetWithTag,
  GetUpdatedEntityID,
  EntityGetComponent,
  EntityGetFirstComponent,
  ComponentGetValue2,
  ComponentSetValue2,
  EntityInflictDamage,
  ActionUsesRemainingChanged,
  EntityGetTransform,
  EntityLoad,
  EntityGetAllChildren,
  EntityGetName,
  EntityHasTag,
  EntityGetFirstComponentIncludingDisabled,
  EntityGetInRadiusWithTag,
  GlobalsGetValue,
  GlobalsSetValue,
  Random,
  SetRandomSeed,
  GameGetFrameNum
} from "../../eval/wandObserver";
import { Spell } from '../../spell';
import { GunActionState } from '../../actionState';
import { ipairs, luaFor } from "../../lua/loops";

"""

config = {
  'main': {
    'actionIds':
    {
      'src': 'data/scripts/gun/gun_actions.lua',
      'dst': 'src/app/calc/__generated__/main/actionIds.ts'
    },
    'spells':
    {
      'src': 'data/scripts/gun/gun_actions.lua',
      'dst': 'src/app/calc/__generated__/main/spells.ts',
      'before': spellsBefore,
      'after': 'export const spells = actions;',
    },
  },
  'beta': {
      'actionIds':
    {
      'src': 'data/scripts/gun/gun_actions.beta.lua',
      'dst': 'src/app/calc/__generated__/beta/actionIds.ts'
    },
    'spells':
    {
      'src': 'data/scripts/gun/gun_actions.beta.lua',
      'dst': 'src/app/calc/__generated__/beta/spells.ts',
      'before': spellsBefore,
      'after': 'export const spells = actions;',
    },
  },
}



# Convert action functions,
# replacing cast state global with param
# action\s*=\s*function\((.*?)\)(\s*)(.*?)end,(\s*},)
# action: (c: C, \1) => {\1\1},\1
actionArgTypes = {
  'recursion_level': ['number', 0],
  'iteration': ['number', 1],
}

def actionReplaceFn(m: Match):
  argsString = 'c: GunActionState'
  extraArgs = [s.strip() for s in m.group(1).split(',')]
  for arg in extraArgs:
    if arg is None or len(arg) == 0:
      break
    a = actionArgTypes[arg]
    argsString += f', {arg}: {a[0]} = {a[1]}'

  return f'action: ({argsString}) => {{{m.group(2)}{m.group(3)}}},{m.group(4)}'

@dataclass
class PatternReplace:
  pattern: str
  replace: str
  flags: int = 0
  repeat: bool = False
  expectedSubCount: int = 0

# These are run in sequence, and the ordering matters as each operates on the output of the last
patterns = [
  # fix syntax for top level actions array
  PatternReplace(
    r'actions =\s*{(.*)}',
    r'const actions: Spell[] = [\1]',
    flags=re.DOTALL,
  ),

  # remove comment
  PatternReplace(r'--\[\[.*?]]--', '', flags=re.MULTILINE | re.DOTALL),
  PatternReplace(r'--.*?$', '', flags=re.MULTILINE),

  # relatedPattern
  PatternReplace(r'related_(\w+)\s*=\s*{(.*?)},', r'related_\1=[\2],', flags=re.MULTILINE),

  # propertiesPattern
  PatternReplace(r'^(\s*\w+)\s*=\s*(.*), *$', r'\1: \2,', flags=re.MULTILINE),

  # actionPattern
  PatternReplace(r'action\s*=\s*function\((.*?)\)(\s*)(.*?)end,(\s*},)', actionReplaceFn, flags=re.MULTILINE | re.DOTALL),

  PatternReplace(r'if\s+(.*?)\s+and\s+(.*?)\s+then', r'if (\1 && \2) then', flags=re.MULTILINE),
  PatternReplace(r'local ', r'let ', flags=re.MULTILINE),
  PatternReplace(r'#(\w+)', r'\1.length', flags=re.MULTILINE),
  PatternReplace(r'elseif', r'} else if', flags=re.MULTILINE),
  PatternReplace(r'(\t+)(else)(?!\w)(?! +if)', r'\1} \2 {', flags=re.MULTILINE),
  PatternReplace(r'if\s+([^()]+?)then', r'if (\1) {', flags=re.MULTILINE),
  PatternReplace(r'if\s+(.+?)then', r'if \1 {', flags=re.MULTILINE),
  PatternReplace(r'end(\s+)', r'}\1', flags=re.MULTILINE),
  PatternReplace(r'(\w+)\s*=\s*{(.*?)}', r'\1 = [\2]', flags=re.MULTILINE),
  PatternReplace(r'current_reload_time = (.*?)$', r'setCurrentReloadTime(\1)', flags=re.MULTILINE),
  PatternReplace(r'mana = (.*?)$', r'setMana(\1)', flags=re.MULTILINE),
  PatternReplace(r'dont_draw_actions = (.*?)$', r'setDontDrawActions(\1)', flags=re.MULTILINE),
  PatternReplace(r'force_stop_draws = (.*?)$', r'setForceStopDraws(\1)', flags=re.MULTILINE),
  PatternReplace(r'discarded = \[]$', r'clearDiscarded()', flags=re.MULTILINE),
  PatternReplace(r'hand = \[]$', r'clearHand()', flags=re.MULTILINE),
  PatternReplace(r'deck = \[]$', r'clearDeck()', flags=re.MULTILINE),
  PatternReplace(r' \.\. "', r' + "', flags=re.MULTILINE),
  PatternReplace(r'" \.\. ', r'" + ', flags=re.MULTILINE),
  PatternReplace(r'math\.', r'Math.', flags=re.MULTILINE),
  # PatternReplace(r'(SetRandomSeed\(.*?\))$', r'// \1', flags=re.MULTILINE),
  PatternReplace(r'tostring\((.*?)\)', r'String(\1)', flags=re.MULTILINE),
  PatternReplace(r'while (.*?) do', r'while (\1) {', flags=re.MULTILINE),
  PatternReplace(r'~=', r'!==', flags=re.MULTILINE),
  PatternReplace(r'(?<=\W)nil(?=\W)', r'null', flags=re.MULTILINE),
  PatternReplace(r' and ', r' && ', flags=re.MULTILINE),
  PatternReplace(r' or ', r' || ', flags=re.MULTILINE),
  PatternReplace(r'if \(?\s*not (.*?)\s*\)? {', r'if (!\1) {', flags=re.MULTILINE),
  PatternReplace(r'(data\d?|v).action\((.*?)\)', r'call_action("action", \1, c, \2)', flags=re.MULTILINE),
  PatternReplace(r'let (\w+)\s*,\s*(\w+) =', r'let [\1, \2] =', flags=re.MULTILINE),
  PatternReplace(r'let (data) = \[]', r'let \1: Spell | null = null', flags=re.MULTILINE),
  PatternReplace(r'let (\w+) = \[]', r'let \1: any = []', flags=re.MULTILINE),

  PatternReplace(r'table.insert\(\s*(\w+)\s*,\s*(\w+)\s*\)', r'\1.push(\2)', flags=re.MULTILINE),
  PatternReplace(r'table.remove\(\s*(\w+)\s*,\s*(\w+)\s*\)', r'\1.splice(\2 - 1, 1)', flags=re.MULTILINE),
  PatternReplace(r'(deck|actions|hand|discarded|types)\[([\w.\- ]+)]', r'\1[\2 - 1]', flags=re.MULTILINE),
  PatternReplace(r'string.sub\((.*?),(.*?),(.*?)\)', r'\1.substring(\2-1,\3)', flags=re.MULTILINE),
  PatternReplace(r'tonumber\(', r'Number.parseInt(', flags=re.MULTILINE),

  # For loops
  # (step version currently unused)
  # for i=1,how_many,step do  ==>  for (const i of luaFor(1, how_many, step)) {
  PatternReplace(
    r'for *(.*?) *= *(.*?) *, *(.*?) *, *(.*?) +do',
    r'for (const \1 of luaFor(\2, \3, \4)) {',
    flags=re.MULTILINE,
  ),
  # for i=1,how_many do  ==>  for (const i of luaFor(1, how_many)) {
  PatternReplace(
    r'for *(.*?) *= *(.*?) *, *(.*?) +do',
    r'for (const \1 of luaFor(\2, \3)) {',
    flags=re.MULTILINE,
  ),
  # for i,v in ipairs(list) do  ==>  for (const [i, v] of ipairs(list, 'list')) {
  PatternReplace(
    r'for ([.()\-\w]+),(\w+) in ipairs\(\s*(.+?)\s*\) do',
    r"for (const [\1, \2] of ipairs(\3, '\3')) {",
    flags=re.MULTILINE,
  ),

  PatternReplace(r' == ', r' === ', flags=re.MULTILINE),
  PatternReplace(r' !== null', r' != null', flags=re.MULTILINE),
  PatternReplace(r' === null', r' == null', flags=re.MULTILINE),
  PatternReplace(r'related_projectiles\[1\]', r'related_projectiles[0]', flags=re.MULTILINE),
  PatternReplace(r'related_projectiles\[2\]', r'related_projectiles[1]', flags=re.MULTILINE),
  PatternReplace(r'(?<!let )((?:end|else)point = i)', r'\1 + 1', flags=re.MULTILINE),
  PatternReplace(r'i <= hand_count', r'i < hand_count', flags=re.MULTILINE),

  # ActionType type to avoid crusty enum
  PatternReplace(r'data\.type\s*(!==|===)\s*0', r'data.type \1 ACTION_TYPE_PROJECTILE', flags=re.MULTILINE),
  PatternReplace(r'data\.type\s*(!==|===)\s*1', r'data.type \1 ACTION_TYPE_STATIC_PROJECTILE', flags=re.MULTILINE),
  PatternReplace(r'data\.type\s*(!==|===)\s*2', r'data.type \1 ACTION_TYPE_MODIFIER', flags=re.MULTILINE),
  PatternReplace(r'data\.type\s*(!==|===)\s*3', r'data.type \1 ACTION_TYPE_DRAW_MANY', flags=re.MULTILINE),
  PatternReplace(r'data\.type\s*(!==|===)\s*4', r'data.type \1 ACTION_TYPE_MATERIAL', flags=re.MULTILINE),
  PatternReplace(r'data\.type\s*(!==|===)\s*5', r'data.type \1 ACTION_TYPE_OTHER', flags=re.MULTILINE),
  PatternReplace(r'data\.type\s*(!==|===)\s*6', r'data.type \1 ACTION_TYPE_UTILITY', flags=re.MULTILINE),
  PatternReplace(r'data\.type\s*(!==|===)\s*7', r'data.type \1 ACTION_TYPE_PASSIVE', flags=re.MULTILINE),
  PatternReplace(r'ACTION_TYPE_PROJECTILE', r'"projectile"', flags=re.MULTILINE),
  PatternReplace(r'ACTION_TYPE_STATIC_PROJECTILE', r'"static"', flags=re.MULTILINE),
  PatternReplace(r'ACTION_TYPE_MODIFIER', r'"modifier"', flags=re.MULTILINE),
  PatternReplace(r'ACTION_TYPE_DRAW_MANY', r'"multicast"', flags=re.MULTILINE),
  PatternReplace(r'ACTION_TYPE_MATERIAL', r'"material"', flags=re.MULTILINE),
  PatternReplace(r'ACTION_TYPE_OTHER', r'"other"', flags=re.MULTILINE),
  PatternReplace(r'ACTION_TYPE_UTILITY', r'"utility"', flags=re.MULTILINE),
  PatternReplace(r'ACTION_TYPE_PASSIVE', r'"passive"', flags=re.MULTILINE),
]



def processActionIds(src, dst, before = '', after = ''):
  with open(src) as inFile:
    content = inFile.read()

  action_id_pattern = r'\t+{\s*id\s*=\s*\"(\w+)\"'
  action_ids = list(dict.fromkeys(re.findall(action_id_pattern, content, re.DOTALL)))
  joined = ",\n".join(f'"{i}"' for i in action_ids)
  content = f'export const actionIds = [\n{joined}\n] as const;\n\nexport type ActionId = typeof actionIds[number];\n\n'

  with open(dst, 'w') as outFile:
    outFile.write(before + content + after)


def processSpells(src, dst, before = '', after = ''):
  with open(src) as inFile:
    content = inFile.read()

  variances = []

  for pattern in patterns:
    content, subCount = re.subn(pattern.pattern, pattern.replace, content, flags=pattern.flags)
    if pattern.repeat:
      oldContent = ''
      while oldContent != content:
        oldContent = content
        content, subC = re.sub(pattern.pattern, pattern.replace, content, flags=pattern.flags)
        subCount += subC
    if subCount != pattern.expectedSubCount:
      delta = subCount - pattern.expectedSubCount
      sign = '+' if delta > 0 else ' '
      variances.append(f'{subCount:>8} {sign}{delta:<7} | \'{pattern.pattern}\' >> \'{pattern.replace}\'')

  if len(variances) > 0:
    print(f'\n\nsubstitution count variances ({srcFile})\n')
    print('   found change   | substitution')
    for variance in variances:
      print(f'{variance}')

  with open(dst, 'w') as outFile:
    outFile.write(before + content + after)


os.makedirs(os.path.dirname('src/app/calc/__generated__/main/'), exist_ok=True)
os.makedirs(os.path.dirname('src/app/calc/__generated__/beta/'), exist_ok=True)

process = {
  'actionIds': processActionIds,
  'spells': processSpells,
}

for branch, tasks in config.items():
  print(branch, tasks)
  for task, args in tasks.items():
    process[task](**args)
