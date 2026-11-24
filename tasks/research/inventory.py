import json
from pathlib import Path
import re
import subprocess


ROOT = Path(__file__).resolve().parents[2]
FORGE_NAME = re.compile(r'^Name:(.+)$', re.M)
CLASS_PUNCTUATION = re.compile('[^a-z0-9]')


def revision(repo):
    return subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip()


def coverage(corpus, present):
    missing = [c['name'] for c in corpus if not all(present(f) for f in c['faces'])]
    return {'cards': len(corpus), 'allFacesPresent': len(corpus) - len(missing),
            'missing': missing}


def main():
    corpus = json.loads((ROOT / 'data/corpus.json').read_text())
    result = {name: {'sha': revision(ROOT.parent / name)}
              for name in ['mtgish', 'forge', 'mage', 'sylex']}
    names = set()
    forge = ROOT.parent / 'forge/forge-gui/res/cardsfolder'
    for source in forge.rglob('*.txt'):
        names.update(FORGE_NAME.findall(source.read_text(errors='replace')))
    result['forge'].update(coverage(corpus, lambda f: f['name'] in names))
    mage = ROOT.parent / 'mage/Mage.Sets/src/mage/cards'
    classes = {p.stem.casefold() for p in mage.rglob('*.java')}
    result['mage'].update(coverage(corpus,
        lambda f: CLASS_PUNCTUATION.sub('', f['name'].lower()) in classes))
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
