import argparse
import gzip
import json
import re
from pathlib import Path
import shutil
import subprocess


def run(command, cwd, output, errors):
    with output.open('w') as stdout, errors.open('w') as stderr:
        subprocess.run(command, cwd=cwd, stdout=stdout, stderr=stderr, check=True)


def source_cards(root, bulk, output):
    names = {card['name'] for card in json.loads((root / 'data/corpus.json').read_text())}
    cards = {}
    with gzip.open(bulk, 'rt') as source:
        for line in source:
            card = json.loads(line)
            if card['name'] in names:
                cards[card['name']] = card
    missing = sorted(names - cards.keys())
    if missing:
        raise ValueError(f'Bulk snapshot is missing corpus cards: {missing}')
    normalized = []
    excluded = []
    supported = []
    for card in cards.values():
        if card['layout'] == 'reversible_card':
            excluded.append(card['name'])
            continue
        if 'type_line' not in card:
            card['type_line'] = card['card_faces'][0]['type_line']
            normalized.append(card['name'])
        supported.append(card)
    (output / 'input-adjustments.json').write_text(json.dumps({
        'excludedLayout': excluded, 'frontFaceTypeLine': normalized,
        'corpusCards': len(names)
    }, indent=2))
    (output / 'scryfall.json').write_text(json.dumps(supported))


def build(repo, output):
    run(['go', 'build', '-o', str(output / 'parser'), '.'],
        repo / 'go_mtg_parser', output / 'go-build.log', output / 'go-build.err')
    rust = repo / 'rust_syntax'
    for feature, binary in [('ronl_to_bincode', 'ronl-to-bincode'),
                            ('write_out_json', 'bincode-to-jsonl')]:
        run(['cargo', 'build', '--locked', '--features', feature, '--bin', 'rust_syntax'],
            rust, output / f'{feature}.log', output / f'{feature}.err')
        shutil.copy2(rust / 'target/debug/rust_syntax', output / binary)


def parse(repo, output, source, prefix):
    grammar = repo / 'grammars'
    command = [str(output / 'parser'),
               '--ignore-list-file', str(grammar / 'ignore.json5'),
               '--short-names-file', str(grammar / 'short_names.json5'),
               '--find-replace-file', str(grammar / 'find_replace.json5'),
               '--english-grammar-files']
    command.extend(str(p) for p in sorted(grammar.glob('english_grammar*.json5')))
    command.append('--mtgish-grammar-files')
    command.extend(str(p) for p in sorted(grammar.glob('mtgish_grammar*.json5')))
    command.extend(['--mtgjson-files', str(source), '--print-mtgish'])
    run(command, repo, output / f'{prefix}.txt', output / f'{prefix}.err')
    lines = (output / f'{prefix}.txt').read_text().splitlines()
    results = [line for line in lines if re.match(r'^\w+\(', line)]
    (output / f'{prefix}.ron').write_text('\n'.join(results) + '\n')
    run([str(output / 'ronl-to-bincode'), str(output / f'{prefix}.ron'),
         str(output / f'{prefix}.bin')], repo,
        output / f'{prefix}-convert.log', output / f'{prefix}-convert.err')
    run([str(output / 'bincode-to-jsonl'), str(output / f'{prefix}.bin')], repo,
        output / f'{prefix}.jsonl', output / f'{prefix}-json.err')
    (output / f'{prefix}-counts.json').write_text(json.dumps({
        'inputs': len(json.loads(source.read_text())),
        'englishFailures': sum(line.startswith('FAIL ') for line in lines),
        'irFailures': sum(line.startswith('FAIL:') for line in lines),
        'ronOutputs': len(results),
        'jsonOutputs': len((output / f'{prefix}.jsonl').read_text().splitlines()),
        'conversionErrors': len((output / f'{prefix}-convert.err').read_text().splitlines())
    }, indent=2))


def main():
    root = Path(__file__).resolve().parents[2]
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', type=Path, default=root.parent / 'mtgish')
    parser.add_argument('--bulk', type=Path, required=True)
    parser.add_argument('--output', type=Path, default=root / 'data/research/mtgish-live')
    args = parser.parse_args()
    repo = args.repo.resolve()
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    source_cards(root, args.bulk, output)
    build(repo, output)
    run(['python3', str(repo / 'preprocess_scryfall'), str(output / 'scryfall.json')],
        repo, output / 'input.json', output / 'preprocess.err')
    parse(repo, output, output / 'input.json', 'live')
    parse(repo, output, root / 'tasks/research/custom-cards.json', 'custom')
    sha = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip()
    (output / 'revision.json').write_text(json.dumps({'repo': str(repo), 'sha': sha}))
    subprocess.run(['node', 'tasks/research/compareMtgish.js',
                    str(output / 'live.jsonl'), str(output / 'comparison')],
                   cwd=root, check=True)


if __name__ == '__main__':
    main()
