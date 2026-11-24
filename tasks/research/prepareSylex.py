import argparse
import gzip
import json
from pathlib import Path


def main():
    root = Path(__file__).resolve().parents[2]
    parser = argparse.ArgumentParser()
    parser.add_argument('--bulk', type=Path, required=True)
    parser.add_argument('--repo', type=Path, default=root.parent / 'sylex')
    args = parser.parse_args()
    wanted = {c['name'] for c in json.loads((root / 'data/corpus.json').read_text())}
    names = set()
    cards = {}
    with gzip.open(args.bulk, 'rt') as source:
        for line in source:
            card = json.loads(line)
            names.add(card['name'])
            names.update(f['name'] for f in card.get('card_faces', []))
            if card['name'] not in wanted or card['layout'] == 'reversible_card':
                continue
            cards[card['name']] = card
    data = args.repo / 'data'
    (data / 'gen/catalogs').mkdir(parents=True, exist_ok=True)
    (data / 'scryfall').mkdir(parents=True, exist_ok=True)
    (data / 'gen/catalogs/card-names.txt').write_text('\n'.join(sorted(names)) + '\n')
    (data / 'scryfall/oracle-cards.jsonl').write_text(
        ''.join(json.dumps(c) + '\n' for c in cards.values()))
    print(json.dumps({'inputCards': len(cards), 'cardNames': len(names),
                      'excluded': sorted(wanted - cards.keys())}, indent=2))


if __name__ == '__main__':
    main()
