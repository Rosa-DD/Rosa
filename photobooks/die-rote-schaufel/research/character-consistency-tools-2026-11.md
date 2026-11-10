# Tool research: consistent, photoreal, *unpolished* characters

**Date:** 10 Nov 2026 · **Status:** research only — no look & feel decided yet (per PROJECT_MASTER §16.4)
**Question:** Which tools give us the same two fictional children (Ben 3, Mia 4) across ~16 scenes, looking like real candid family snapshots rather than glossy AI renders?

> Caveat: almost all public comparisons are vendor or affiliate blogs and they disagree with each other. Treat the rankings below as a shortlist to **test on our own scenes** (see `bakeoff_plan.md`), not as a verdict.

## 1. The short answer

There is no single best tool. The strongest setup combines three things:

1. **A reference-based model** to design and approve the characters: Nano Banana Pro, GPT Image 2 or FLUX.2.
2. **A trained identity model (LoRA)** once Ben and Mia are approved. It locks their faces across all 16 scenes. A LoRA is the only method that is more reliable than "attach references and hope".
3. **Real photographs of the setting** that we shoot ourselves: the playground, the sandbox and a real red shovel. The AI only adds the children. This is the most effective way to avoid the polished look, and it matches the idea of books *based on real photographs*.

## 2. Shortlist

| Tool | Consistency | Raw photo realism | Effort | Verdict for us |
|---|---|---|---|---|
| **Nano Banana Pro** (Google Gemini 3 Pro Image) | Best-reviewed for face preservation across scenes; holds several characters; still needs some retakes | High; some say colours lean slightly "illustrative" | Low: Gemini app, or the API | **Test.** Probably the best no-code option |
| **GPT Image 2** (ChatGPT / OpenAI API) | Good with reference images (up to ~16 refs); clothing/face drift reported across 8+ frames | Good, but tends towards smooth, "clean" skin | Low: we already use it | **Test.** Baseline, since the existing Ben images come from here |
| **FLUX.2 [pro / dev]** (Black Forest Labs, via fal.ai / Replicate / BFL API) | Native multi-reference (4–10 refs) | Most often named the photorealism leader; least "AI-glossy" | Medium | **Test.** Main candidate for the final production |
| **FLUX.2 LoRA training** (fal.ai FLUX.2 trainer, ai-toolkit) | Strongest lock-in: one trigger word per child, trained on 15–30 approved images | As good as the base model and training set | Medium–high (~1 day setup) | **Phase 2**, after the characters are approved |
| **Seedream 4.5 / 5** (ByteDance, via fal.ai) | Up to 10–14 refs; good for batches | Strong; some reviews rank it top for photorealism | Low–medium, cheap | **Optional 4th contender** |
| ComfyUI + PuLID-Flux2 / InfiniteYou | High face identity | Can look plastic without a detail pass | High (GPU, workflows) | Only if a tech person takes ownership; overkill for one prototype |
| Midjourney V8 | Character Reference is not supported on V8; Omni-Reference falls back to V7 and is "approximate" | Beautiful, but aesthetic and polished by default | Low | **Skip.** Wrong strengths for this project |
| Higgsfield Soul ID | Strong, but trains on 20–80 *real photos* of a person, and the ID stays locked inside Higgsfield | Built for an editorial / influencer look | Low | **Skip.** Too polished and locked-in, and we will not use photos of our own kids |
| Leonardo, Ideogram, Recraft | Mixed results; Leonardo allows only one character reference per generation | Medium | Low | Skip |

## 3. How to get the "not polished" look (any tool)

- **Shoot real plates.** Photograph the actual sandbox, playground, red shovel and bucket on an overcast day with a phone. Use the photos as scene/background references, or composite the AI children into them. A real background adds real imperfections the model would never invent.
- **Prompt for the camera, not for beauty.** For example: *"candid smartphone snapshot by a parent, slightly off-centre framing, mild motion blur on hands, natural sensor noise, overcast flat light, sand on the jeans, muddy boots, no retouching."* Avoid "cinematic", "8k", "masterpiece", "studio" and "bokeh portrait".
- **Make the training set look like the goal.** If we train a LoRA, choose candid, slightly imperfect approved images. Glossy training images produce glossy output.
- **Finish with a grain/colour pass.** Apply one consistent light film-grain + colour grade to all 16 pages (Lightroom preset or a script). This hides small AI tells and makes the book look like one shoot.
- **Avoid face "enhancers" and beauty upscalers.** They are the main source of plastic skin. If we upscale, use a plain or detail-preserving upscaler.

## 4. Risks to know up front

- **Policy friction with photoreal children.** In 2026 providers are tightening safeguards on photoreal images of minors, e.g. OpenAI's April 2026 child-safety blueprint and regulator statements. Harmless family scenes are generally allowed, but some tools may refuse or blur at random, especially for LoRA training or face-identity tools on child faces. Test every tool in the bake-off for this. Fully fictional children and clothed, everyday scenes are the right approach anyway.
- **Hands, fingers, shovel shape.** These fail most often. QA checklist §13 already covers them.
- **Reference drift over 16 images** is an industry-wide problem, not a problem of one tool. Plan to regenerate and do region edits.
- **Cost/time.** Every option except ComfyUI costs roughly €20–€80 for the whole prototype. The real constraint is time to Christmas (see §14 of the master doc).

## 5. Recommendation

1. **This week:** run a bake-off of Nano Banana Pro vs GPT Image 2 vs FLUX.2 (plus Seedream if time allows). Use the same five consistency scenes (master §8.1 step 5), the same references and the same raw-photo prompt, and score them blind. See `bakeoff_plan.md`.
2. Pick the winner, then approve the master portrait + full-body image for Ben and for Mia (master §8.1 step 2).
3. If the winner is FLUX.2, or consistency is still drifting, train one LoRA per child from 15–30 approved images and produce all 16 scenes with it.
4. Shoot real background plates (playground, sandbox, shovel) in parallel. They help with every tool.

## 6. Open decision for Rosa & Mousa

- **What does "based on real photographs" mean for the product?** (a) AI children in **real photographed places**: recommended for this prototype. (b) Later product idea: books based on a family's *own* photos. Using real children's photos as AI input is a separate product with consent, privacy and child-safety requirements, and it needs its own decision. The current master doc explicitly says *no photos of our own children*.

## Sources

- [Best AI for Character Consistency in 2026 — 140-image test (toonystory)](https://toonystory.com/blog/best-ai-for-character-consistency-2026)
- [7 Best Multi-Reference AI Image Models in 2026 (linocut)](https://linocut.ai/blogs/multi-reference-ai-image-models/)
- [8 Best Realistic AI Image Generators 2026 (pollo.ai)](https://pollo.ai/hub/best-realistic-ai-image-generators)
- [Best AI Image Generators for Realistic Photos 2026](https://omidsaffari.com/blog/best-ai-image-generator-realistic-photos-2026)
- [Nano Banana Pro vs GPT-Image 1.5: 10 tests (vidguru)](https://www.vidguru.ai/blog/nano-banana-pro-vs-gpt-image-1-5-comparison.html)
- [FLUX.2 vs GPT Image 2 vs Seedream 4.5 vs Nano Banana 2 (chatimg)](https://chatimg.ai/en/blog/flux-2-vs-gpt-image-2-vs-seedream-vs-nano-banana)
- [Seedream 5.0 Pro vs Nano Banana Pro vs Flux.2 Pro (pixmind)](https://www.pixmind.io/posts/seedream-5-0-pro-vs-nano-banana-pro-vs-flux-2-pro-2026-image-generation-tripartite-showdown)
- [Best AI image model compared (invideo)](https://invideo.io/blog/best-ai-image-model-comparison/)
- [The 7 Best AI Image Generators in 2026 (pixo)](https://pixo.video/blog/best-ai-image-generators)
- [Nano Banana Pro on DEV Community](https://dev.to/theairabbit/nano-banana-pro-the-ai-image-revolution-thats-quietly-changing-how-we-create-731)
- [GPT Image 2 Review (Curious Refuge)](https://curiousrefuge.com/blog/gpt-image-2-review)
- [GPT Image 2 Review: pros & cons (crepal)](https://crepal.ai/blog/?p=6583)
- [Keeping characters consistent in GPT Image 2 (leadde)](https://leadde.ai/blog/how-to-keep-characters-consistent-in-gpt-image-2-5-fix-face-and-pose-drift)
- [AI consistent character generators 2026 (sorceress)](https://sorceress.games/blog/what-is-an-ai-consistent-character-generator-2026)
- [FLUX.2 LoRA training guide 2026](https://workingnotworking.com/flux-2-lora-training-guide/)
- [fal.ai FLUX.2 trainer](https://fal.ai/models/fal-ai/flux-2-trainer)
- [Using synthetic data to improve Flux finetunes (Replicate)](https://frontend.replicate.com/blog/using-synthetic-data-to-improve-flux-finetunes)
- [PuLID Flux II workflow (RunComfy)](https://www.runcomfy.com/comfyui-workflows/pulid-flux-ii-in-comfyui-consistent-character-ai-generation)
- [ComfyUI-PuLID-Flux2 node](https://www.runcomfy.com/comfyui-nodes/ComfyUI-PuLID-Flux2)
- [Face enhancement techniques (Rishi Desai)](https://rishidesai.github.io/posts/face-enhancement-techniques)
- [Midjourney 8.1 guide: Omni Reference & parameters](https://blakecrosley.com/en/guides/midjourney)
- [Midjourney V8 vs V7 (MindStudio)](https://www.mindstudio.ai/blog/midjourney-v8-vs-v7-comparison)
- [Higgsfield Soul ID](https://higgsfield.ai/blog/SOUL-ID-Superior-Level-of-AI-Character-Consistency)
- [Boreal-Flux-Dev-v2 candid/amateur style](https://www.promptlayer.com/models/boreal-flux-dev-v2)
- [OpenAI child safety blueprint, Apr 2026 (creati.ai)](https://creati.ai/ai-news/2026-04-09/openai-releases-child-safety-blueprint-combat-ai-generated-exploitation/)
- [Joint statement on AI-generated images (Swiss FDPIC)](https://www.edoeb.admin.ch/en/joint-statement-on-ai-generated-images)
