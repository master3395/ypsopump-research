# 21 — CamAPS Liberty: availability and server-side gating

> **Document 21** | master3395 fork addition | Last updated: 17/06/2026  
> Related: [20 — APK 189 vs 192](20-camaps-apk-189-vs-192.md), [06 — Closed-loop algorithm](06-closed-loop-algorithm.md)

## What is CamAPS Liberty?

[CamAPS Liberty](https://camdiab.com/liberty) is CamDiab's **fully closed-loop (FCL)** mode. When enabled and active, users can skip meal and snack boluses and carb counting while Auto mode is on. It is optional and intended for periodic use, not a replacement for clinical follow-up.

Build **1.4(192).101** includes Liberty code (`com.camdiab.fx_alert.fxfcl`). Build **189** does not.

## How access is controlled (not in the APK alone)

Liberty visibility is **server-gated**, not only a local settings toggle. Evidence from CamAPS FX 192 (`FxFcl.smali`):

| Mechanism | Purpose |
|-----------|---------|
| `algorithm_fx_fcl_setting_allowed` | Country or region pattern from remote config |
| `algorithm_fx_fcl_setting_persisting` | Persisted availability rules |
| `liberty_enabled_for_this_user` | Per-user flag from backend |
| `camaps_liberty_ypso` | YpsoPump-specific feature flag |
| `camaps_liberty_dana` | Dana pump-specific feature flag |
| `setFxFclFeatureCountryAllowed` | Country allowlist enforcement |

Norwegian UI strings exist in the 192 APK (`nb` locale split), but **bundled language does not mean the feature is live in Norway**.

## Official rollout status

CamDiab's public [Liberty page](https://camdiab.com/liberty) lists the feature as **"Coming soon"** for myLoop and Dana, with a note that rollout is **pending local market approvals and availability**.

CE marking for Liberty has been reported (early 2026), but **market release is country by country**. Norway is not documented as fully open for all users at the time of this writing.

## What you can do without asking vendors for "early access"

| Action | Why |
|--------|-----|
| Keep CamAPS FX updated (192+, Android 13+) | Liberty code only exists in newer builds |
| Check **Settings** after each update | Toggle appears when your account, pump, and region are enabled |
| Follow [CamDiab notifications](https://camdiab.com/notifications) and mylife/Ypsomed news | Official rollout announcements |
| Use standard hybrid closed-loop (Auto mode) meanwhile | Approved therapy path while waiting |

## What does not work

| Attempt | Result |
|---------|--------|
| VPN to another country | Account and remote config still gate access |
| Sideloading or modding the APK | Server flags unchanged; medical and legal risk |
| Changing phone region only | Same as VPN |
| Expecting Liberty in build 189 | Package and strings absent |

## Norway-specific notes

If you are in Norway and **do not see** a Liberty toggle in Settings on build 192:

1. Your market may not be enabled yet on CamDiab's backend.
2. Your pump type (YpsoPump vs Dana) may affect which flag applies.
3. Contact **mylife/Ypsomed support** for **rollout status**, not as a request to bypass approval.

This is separate from **pump BLE key exchange** research in [09 — Bypass options](09-bypass-options.md). Liberty gating is a **clinical feature flag**, not a pump cryptography bypass.

## Quick self-check

| Settings shows Liberty toggle | Settings does not show Liberty |
|------------------------------|------------------------------|
| Feature enabled for your account, pump, and region | Code may be in APK; server has not enabled your market or user yet |
| Complete in-app training before use | Wait for official rollout or ask support for **timeline**, not unlock codes |

## References

- [CamAPS Liberty (CamDiab)](https://camdiab.com/liberty)
- [20 — CamAPS APK 189 vs 192](20-camaps-apk-189-vs-192.md) (Liberty smali and string evidence)
- [06 — Closed-loop algorithm](06-closed-loop-algorithm.md) (algorithm container, separate from FCL UI gating)
