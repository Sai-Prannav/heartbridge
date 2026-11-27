// The recorded floor of the independent evaluation (docs/independent-eval/REPORT.md, review PUB-05): on the WORKING
// batch of messages the rules' author did not write, the rules alone must keep catching at least 169 of the 414
// emergencies (40.8%). Offline, no model, no server: the same scorer the REPORT used. The held-out batch is not gated
// here on purpose (it stays untuned; score it with docs/independent-eval/score.mjs --quiet).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRows, isEmergency, summarise } from '../../docs/independent-eval/score.mjs';
import { parseFreeText } from '../src/core/parser.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WORKING = path.join(HERE, '../../evals/independent-2026-10-11.jsonl');
const FLOOR = { caught: 169, emergencies: 414 };   // 40.8%, REPORT.md "Working, 873 messages"

test('rules-only recall on the independent working batch stays at or above the recorded 40.8%', () => {
  const rows = loadRows(WORKING);
  const fired = new Map(rows.map((r) => [r.id, isEmergency(parseFreeText(r.text))]));
  const { overall } = summarise(rows, fired);
  assert.equal(overall.emergencies, FLOOR.emergencies, 'the working batch changed: re-score it and update REPORT.md and this floor together');
  assert.ok(overall.caught >= FLOOR.caught, `recall fell to ${overall.caught}/${overall.emergencies} (floor ${FLOOR.caught}/${FLOOR.emergencies}, 40.8%)`);
});
