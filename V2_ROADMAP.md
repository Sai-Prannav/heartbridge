# HeartBridge v2 roadmap

A solo rebuild by Sai Prannav Murali, from scratch and small enough to defend line by line. v1 was built at HackGT 13. Source: portfolio assessment of 2026-11-06.

## Why rebuild
- v1 was built fast with an AI assistant. v2 must be written by hand, with AI for review only.
- v1 sprawled to 30+ features. A reviewer sees a five-minute demo, not a test suite.
- v1 is software only. v2 should show a hardware link.

## The seed result
Deterministic rules miss more than half of emergencies phrased in ways they were not written for (41% caught; 54% with a local model). v2 is built around that finding.

## Scope
1. **Core:** a compact heart-failure triage engine. Rules stay authoritative. A hybrid layer raises recall on messy, colloquial, multilingual and voice-transcribed input, and never lets an LLM downgrade a red flag.
2. **Evaluation as the headline:** a held-out set, with recall and precision for rules alone, LLM alone and the hybrid. One chart, one number.
3. **One physical input:** a microcontroller scale or pulse-oximeter feed into the engine (overlaps the DynaGence electronics work).
4. **Authorship:** written by hand, with every design decision explainable without notes.

## Open decisions
- [ ] Confirm the rebuild scope above.
- [ ] HeartBridge v2 or ROS 2 Navigation: which ships first? Both rank behind the research work (SciTech, TFEC, AMIR, DynaGence).

## Ideas worth carrying over (with the authors' OK)
The "LLM for language, rules for decisions" contract, the independent eval method (`docs/independent-eval/`), and the label taxonomy in `evals/`.
