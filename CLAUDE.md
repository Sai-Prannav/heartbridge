# HeartBridge: instructions for Claude

HeartBridge is a multilingual post-discharge co-pilot for heart-failure patients. It's a Telegram agent (SMS/WhatsApp later) that runs daily check-ins, watches for red flags, nudges medications and refills, keeps caregivers in the loop, and escalates in tiers to a nurse dashboard. Track: **Social Good (Healthcare)**.

**Read before any work:** `docs/STRATEGY.md` (why), `docs/CONTRACTS.md` (the interfaces you must not break), then `V2_ROADMAP.md`.

## 1. Non-negotiable product rules
- **The LLM handles language; rules decide.** Rules own every tier and all 911 logic. LLMs parse, translate and answer questions. **One sanctioned exception:** `backend/src/riskllm/` may *raise* GREEN → YELLOW (nurse review) with stated evidence. It never lowers a tier and never triggers RED/911 (`mergeTier`). Nothing else may let a model change a tier.
- **Degrade gracefully.** No LLM → rules. No Telegram → dashboard simulator. No device → self-report. No key should ever be required to run or test.
- **Time comes from `core/clock.js`** (`now()`, `nowISO()`), never `Date.now()` / `new Date()` in backend logic, so the demo clock can move time forward.
- **Patient-facing text goes through `core/i18n.js`** (`t(lang, key)`) with en + es entries. Never hardcode English strings to patients.
- **Data goes through the `store.js` API only.** Need your own data? Use `store.collection('<name>')` and don't edit `store.js`.

## 2. The loop for every task
1. Implement in the files the task touches. Match the surrounding style: ESM JavaScript, no TypeScript, comments that explain *why*, the same naming and density as nearby code.
2. **Test rigorously:**
   - Add `node:test` tests in `backend/test/` for backend work.
   - Tests must never hit the network or a real LLM. Mock `fetch`, set `process.env.LLM_PROVIDER='none'`, and use a temp `HEARTBRIDGE_DB` (copy the header of `backend/test/contracts.test.js`).
   - Cover the happy path, edge cases, and failure/fallback paths.
3. `npm run check` from the repo root (all backend tests + frontend build) must be **green**. Fix what you broke.
4. Manually verify the feature (curl the API, click the dashboard, or message the bot) and note what you checked in the commit body.
5. Commit **one feature per commit** with a prefix: `[core] …`, `[channels] …`, `[insights] …`, `[ui] …`, `[evals] …`, `[docs] …`. Never `--force`, never `--no-verify`.

## 3. Shared files (keep edits small)
- `backend/src/app.js`: add ONE import + ONE `app.use` line per new router.
- `backend/package.json`, `frontend/package.json`, root `package.json`: add dependencies with `npm install <pkg>` inside the right folder.
- Contract changes go in `docs/CONTRACTS.md` first.

## 4. Running things
```bash
npm run setup      # install root + backend + frontend
npm run dev        # backend :3001 + dashboard :5173
npm test           # backend tests
npm run check      # tests + frontend build (run before every push)
npm run e2e        # full demo story over HTTP with a readable step log (also runs inside npm test)
npm run seed       # reset demo data
```
Optional AI: the chain is Claude → Ollama → LM Studio → rules, picked automatically (`backend/src/core/llm/`). See the README for setup.

## 5. Never
- Commit `.env`, tokens or real patient data. All demo data is synthetic.
- Disable, skip or weaken tests to get green. Fix the cause.
- Let an LLM decide a clinical tier (the only exception is the escalate-only `riskllm` reviewer in §1).
