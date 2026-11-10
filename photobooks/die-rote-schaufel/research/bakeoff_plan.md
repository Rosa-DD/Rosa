# Bake-off plan: choosing the image tool (target 11–15 Nov 2026)

Goal: one tool decision, backed by evidence, **before** any character look is approved.

## Contenders
1. Nano Banana Pro (Gemini app or API)
2. GPT Image 2 (ChatGPT)
3. FLUX.2 [pro] with multi-reference (fal.ai or BFL)
4. *(optional)* Seedream 4.5/5 (fal.ai)

## Same inputs for every tool
- **References:** the existing Ben sandbox image (`a_realistic_outdoor_playground_sandbox_scene_shot.png`). Copy it to `assets/references/ben/` first. Mia has no clean reference yet, so each tool also gets the text-only test "design Mia from the identity block".
- **Real plates (recommended):** 3–5 phone photos of a real sandbox/playground on an overcast day, plus a real red children's shovel. Save them in `assets/references/playground_props/`.
- **Prompt:** master §8.2 style block + §8.3/8.4 identity blocks + §8.5 negatives, **plus this raw-photo add-on:**

```text
Candid smartphone snapshot taken by a parent, slightly imperfect off-centre framing, natural sensor noise, flat overcast light, mild motion blur on moving hands, sand on clothes and boots, no retouching, no beauty filter, no cinematic grading.
```

## The 5 test scenes (master §8.1 step 5)
| ID | Scene |
|---|---|
| T1 | Ben neutral, standing in sandbox, looking at the red shovel |
| T2 | Ben frustrated: boot planted in sand, frown, tense hands (no crossed arms) |
| T3 | Ben sitting in sand, digging with the red shovel |
| T4 | Mia sitting/kneeling, digging a moat with the red shovel |
| T5 | Ben + Mia together, correct height difference, both doing their own thing |

Generate 2 attempts per scene per tool, then keep the better one. Save the files as `assets/bakeoff/<tool>/<T#>_v<n>.png`.

## Scoring (1–5 each, scored blind, ideally a few days after generating)
| Criterion | Weight |
|---|---|
| Same Ben across T1/T2/T3/T5 (face, hair, age) | ×3 |
| Same Mia across T4/T5 | ×2 |
| Looks like a real, unpolished photo (skin, light, imperfection) | ×3 |
| Natural 3–4-year-old body language (no adult poses) | ×2 |
| Hands, fingers, boots, shovel shape correct | ×2 |
| Shovel identical across scenes | ×1 |
| Editing works (fixing one region without changing the face) | ×1 |
| No refusals / policy friction for these child scenes | ×1 (and note every refusal) |
| Time + cost per usable image | ×1 |

Record the scores in `research/bakeoff_results.md` (create it after the test). The tool with the highest weighted score wins, **unless** it fails "real photo" or "same Ben" below 3. Either one is a knockout.

## After the bake-off
- If the winner holds Ben/Mia across all 5 scenes, approve the master portraits and continue (master §8.1 step 2).
- If faces drift, train one FLUX.2 LoRA per child on 15–30 approved images, then repeat T1–T5 with the LoRA.
