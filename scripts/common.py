from datetime import datetime
from dataclasses import dataclass
import re 

current_date = datetime.now()
def autoHeader():
    return f'/* Auto-generated file - last built: {current_date.isoformat()} */'

def autoFooter():
    return f'/* vim: set readonly nomodifiable: Auto-generated file */'

def parseInt(s):
    try:
        return int(float(s))
    except:
        return 0

def joinList(items):
    return ",".join(f'\'{x}\'' for x in items)

def normProj(str):
  return filter(len, [x.strip() for x in str.replace('"', '').split(',') if x != ''])



@dataclass
class PatternReplace:
  pattern: str
  replace: str
  flags: int = 0
  repeat: bool = False
  expectedSubCount: int = 0

preprocessorPatterns = [
  # remove comments
  # multi line
  PatternReplace(r'--\[\[.*?]]--', '', flags=re.MULTILINE | re.DOTALL),
  # single line
  PatternReplace(r'--.*?$', '', flags=re.MULTILINE),
  # remove dofile
  PatternReplace(r'dofile_once.*?$', '', flags=re.MULTILINE),
]

# Remove comments etc.
def preProcess(content):
  for pattern in preprocessorPatterns:
    content, subCount = re.subn(pattern.pattern, pattern.replace, content, flags=pattern.flags)
  return content

