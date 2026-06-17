# What's new in v2 (master3395 fork)

> **Start here** if you already know [SandraK82/ypsopump-research](https://github.com/SandraK82/ypsopump-research) and want a short overview of what this fork adds.  
> Last updated: 17/06/2026 | [Norsk sammendrag](00-whats-new-in-v2.nb.md)

---

## In one sentence

This fork keeps **all original YpsoPump research** and adds **new CamAPS FX documentation** for Android builds **189 vs 192**, including Dexcom G7, CamAPS Liberty, CGM error codes, and a browsable docs website.

---

## Fork vs upstream

| | [SandraK82 (upstream)](https://github.com/SandraK82/ypsopump-research) | [master3395 (this fork)](https://github.com/master3395/ypsopump-research) |
|---|--------|-------------|
| **Focus** | YpsoPump BLE, ProRegia backend, mylife app, AAPS driver | Same, **plus** newer CamAPS APK analysis |
| **CamAPS version studied** | v1.4(190).111 | v1.4(189).101 vs v1.4(192).101 (mmol/L) |
| **Docs count** | 01–19 + 3 guides | 01–22 + 3 guides |
| **Website** | README on GitHub only | README + [GitHub Pages site](../site/index.html) |
| **License** | MIT | MIT (with [ATTRIBUTION.md](../ATTRIBUTION.md)) |

Nothing was removed from upstream. We only **added** files and **light cross-links** in a few existing docs.

---

## New features at a glance (CamAPS build 192)

| Feature | Build 189 | Build 192 | Why it matters |
|---------|-----------|-----------|----------------|
| **Dexcom G7 CGM** | No | **Yes** | Full G7 login, pairing, and error codes in the app |
| **CamAPS Liberty (FCL)** | No | **Yes** (code in APK) | Fully closed-loop mode without meal boluses; may be hidden until your country is enabled |
| **Android minimum** | Android 12+ (SDK 31) | **Android 13+** (SDK 33) | Older phones cannot run 192 |
| **Play Integrity library** | 1.3.0 | **1.6.0** | May affect rooted-device setups (see doc 13) |
| **Libre 3 / G6 hybrid loop** | Yes | Yes | Unchanged core product |
| **Nightscout / xDrip+ in app** | No | No | Still not built in; use Glooko or parallel bridges |

---

## New documents (read these first)

### [20 — CamAPS APK 189 vs 192](20-camaps-apk-189-vs-192.md)

The **main technical report**. Compares two real APKs side by side:

- What is genuinely new in 192 (G7, Liberty, permissions)
- What changed but is not a "feature" (minSdk, Play Integrity, app size)
- What stayed the same (G6, Libre 3, Companion, Glooko)
- Full CGM error code tables

Also available in [Norwegian](20-camaps-apk-189-vs-192.nb.md).

### [21 — CamAPS Liberty availability](21-camaps-liberty-availability.md)

Answers the practical question: **"Liberty is in my APK but I do not see the toggle."**

- Liberty is controlled by **server flags**, not only by having build 192
- Norway may have strings in the app but not yet be fully rolled out
- What you can do legitimately while waiting (no bypass tricks)

### [22 — CGM error codes reference](22-cgm-error-codes-reference.md)

Quick index for support codes shown **inside CamAPS**:

- `LBR###` = Libre 3
- `DCI###` / `DDC###` = Dexcom G6
- `DG7X###` = Dexcom G7 (**192 only**)

**Not** the same as Abbott LibreLink numeric codes (373, 410, etc.).

Download full lists: [cgm-error-codes-192.csv](../data/cgm-error-codes-192.csv), [cgm-notification-enums-192.csv](../data/cgm-notification-enums-192.csv).

---

## New infrastructure (not about the pump itself)

| Addition | What it does |
|----------|----------------|
| **[site/](../site/)** | Styled HTML docs for GitHub Pages |
| **[tools/build-site.mjs](../tools/build-site.mjs)** | Rebuild the site from Markdown (`npm run build-site`) |
| **[CHANGELOG.md](../CHANGELOG.md)** | Version history for this fork |
| **[ATTRIBUTION.md](../ATTRIBUTION.md)** | Credits upstream author |

---

## Small updates to existing upstream docs

Only **short notes and links** were added (no rewrites):

| Doc | What we added |
|-----|----------------|
| [06 — Algorithm](06-closed-loop-algorithm.md) | Pointer to APK comparison and Liberty doc |
| [09 — Bypass](09-bypass-options.md) | Clarifies pump key bypass vs Liberty server gating |
| [11 — CamAPS algorithm](11-camaps-algorithm-analysis.md) | Notes that deep analysis is on build 190; see doc 20 for 192 |
| [13 — Play Integrity](13-play-integrity-bypass-success.md) | Play Integrity **1.6** in build 192 |

---

## Common questions (quick answers)

| Question | Short answer | Read more |
|----------|--------------|-----------|
| Should I update from 189 to 192? | Yes if you want G7 or Liberty (when enabled) and have Android 13+ | [Doc 20](20-camaps-apk-189-vs-192.md) |
| Is Liberty available in Norway? | Code exists in 192; rollout is market-by-market | [Doc 21](21-camaps-liberty-availability.md) |
| My error says `LBR012`, what is that? | CamAPS Libre support code, not LibreLink 373 | [Doc 22](22-cgm-error-codes-reference.md) |
| Did pump BLE research change? | No new pump protocol docs in v2 | Docs [01–04](01-hardware.md) |
| Where is the AAPS driver? | Unchanged work-in-progress from upstream | [aaps-driver/](../aaps-driver/) |

---

## What did **not** change

- YpsoPump hardware, BLE commands, encryption, and key exchange docs (01–04)
- mylife app analysis (14–19)
- Frida / bypass research context (09, guides)
- **No APK files, decompiled code, or exploit scripts** in this repo

---

## Suggested reading order

1. **This page** (you are here)
2. [20 — APK 189 vs 192](20-camaps-apk-189-vs-192.md) if you use or plan to use build 192
3. [21 — Liberty](21-camaps-liberty-availability.md) if you care about fully closed-loop without carb counting
4. [22 — Error codes](22-cgm-error-codes-reference.md) when you hit a CGM alert with a letter code
5. Upstream [01 — Hardware](01-hardware.md) if you care about open-source pump drivers

---

## Credits

Original research: [SandraK82/ypsopump-research](https://github.com/SandraK82/ypsopump-research).  
v2 CamAPS APK work and site: [master3395/ypsopump-research](https://github.com/master3395/ypsopump-research).
