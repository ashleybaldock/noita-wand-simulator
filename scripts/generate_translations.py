import csv

# You may need to add 'key' to the first column in common.csv
srcFile = "./data_base/translations/common.csv"
srcFileBeta = "./data_base/translations/common.beta.csv"
dstFileBase = "./src/app/calc/__generated__/i18n/translation-"
dstFileTail = ".ts"
infoFile = "./src/app/calc/__generated__/i18n/index.ts"

translations = {}
# translationsBeta = {}

languages = ['en', 'de', 'pt-br', 'es-es', 'fr-fr', 'it', 'pl', 'zh-cn', 'jp', 'ko', 'ru']
for language in languages:
  translations[language] = {}

with open(srcFile) as inFile:
  reader = csv.DictReader(inFile)
  for row in reader:
    print(row)
    for language in languages:
      translations[language][row['key']] = row[language]

  for language in languages:
    with open(dstFileBase + language + dstFileTail, 'w') as outFile:
      outFile.write('export const translations = {\n')
      for k, t in translations[language].items():
        outFile.write('  "' + k + "\": \"" + t + "\",\n")

      outFile.write('};\n')

with open(infoFile, 'w') as outFile:
  outFile.write("""/* Auto-generated file */

export const languages = ['""")
  outFile.write("','".join(languages))
  outFile.write(
"""'] as const;

export type Language = typeof languages[number];

""")
  for language in languages:
    outFile.write(f"
export {{ translations as {language} }} from './translation-{language}';")

# vim:sw=2:sts=2:ts=2:et:

