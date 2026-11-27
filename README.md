# HeartBridge

A Telegram agent that checks in daily with heart-failure patients after they leave the hospital. It watches weight trend and red-flag symptoms, nudges medications and refills, and escalates in tiers (self-care, nurse, 911). Caregivers get alerts and a weekly digest, and a nurse dashboard shows who needs attention and why.

**Design principle:** the LLM handles *language*; deterministic rules make *clinical decisions*. Triage never depends on an LLM.

## Origin

HeartBridge was built at **HackGT 13** (Georgia Tech, September 2026) and developed through October 2026. A rewrite, **HeartBridge v2**, is in progress; see [V2_ROADMAP.md](V2_ROADMAP.md).

## How it works

- **Check-in engine** (`backend/src/core/`): a persisted job scheduler drives daily check-ins, medication reminders, refill-gap nudges and a no-reply outreach ladder (reminder, then caregiver, then a nurse task).
- **Triage is rules.** Weight delta, symptoms and adherence map to GREEN / YELLOW / RED. Red flags escalate to the nurse and caregiver and repeat the 911 instruction. The LLM only parses free text and phrases replies, inside fences.
- **Language layer:** provider chain Claude, Gemini, Ollama, LM Studio, then rules only. English, Spanish, Vietnamese, Hindi and Chinese are covered, with a translation cache.
- **Channels:** Telegram (grammY), plus SMS/WhatsApp via Twilio and voice transcription adapters.
- **Dashboard:** Vite + React with socket.io live updates: patients, alerts with reasons, weight chart, conversation log, audit export.
- **Evaluation** (`evals/`, `docs/independent-eval/`): the rules catch **41%** of emergencies phrased in ways they were not designed for, and **54%** with a local model added. This finding is the seed of v2.

Stack: Node 22, Express, grammY, socket.io, React + Vite. Data is a JSON file store (`backend/data/`, gitignored).

## Run locally

```bash
cp backend/.env.example backend/.env   # optional; all keys are blank by default
npm run setup                          # root + backend + frontend deps
npm run dev                            # API :3001, dashboard :5173
npm run check                          # backend tests + frontend tests + build
npm run e2e                            # 19-step demo story over HTTP, no keys needed
```

No keys are needed to start. Without a Telegram token you can chat as a patient from the dashboard. Security, webhooks and production settings are in [docs/OPERATIONS.md](docs/OPERATIONS.md); Telegram setup is in [docs/TELEGRAM_SETUP.md](docs/TELEGRAM_SETUP.md).

## Status

- Checked 2026-11-26: backend 1214 tests (all pass, 0 todo: the six open bugs from the independent bug hunt are fixed, including the one that could lose a RED alert), frontend 129 pass, frontend build ok, e2e 19/19. CI also holds the independent eval's 40.8% rules-only recall floor.
- `npm audit` flags 2 backend dependency advisories (body-parser high, qs moderate); `npm audit fix` is available.
- **No license chosen yet.** All rights reserved until one is added.
- **Not clinical software.** A hackathon prototype, never validated with patients or clinicians. Do not use it for real patient care.
