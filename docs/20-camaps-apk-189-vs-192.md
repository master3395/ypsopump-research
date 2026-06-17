# CamAPS FX (mmol/L): compare 189 vs 192

> **Document 20** | master3395 fork addition | Investigation date: 17/06/2026  
> Related: [11 — CamAPS Algorithm](11-camaps-algorithm-analysis.md), [12 — Sideload](12-camaps-sideload-bypass.md), [13 — Play Integrity](13-play-integrity-bypass-success.md), [21 — Liberty availability](21-camaps-liberty-availability.md), [22 — CGM error codes](22-cgm-error-codes-reference.md)

Investigation date: 17/06/2026 (updated with CamAPS Liberty findings)

Compare **189 vs 192**:

| Build | Source | versionCode |
|-------|--------|-------------|
| **189** | `1.4(189).101` (reference XAPK, older build) | 423 |
| **192** | `1.4(192).101` (Google Play, OnePlus 11) | 524 |

Method: APKEditor decompile, manifest diff, strings/arrays diff, smali package scan, public sources.

---

## Executive summary

| Question | Answer |
|----------|--------|
| Is 192 a new user-facing feature release? | **Yes.** Two major additions: **Dexcom G7 CGM support** and **CamAPS Liberty** (fully closed-loop mode). |
| Is it only a bugfix/compat patch? | **Also yes.** CamDiab/Ypsomed publicly frame recent Android updates as **OS compatibility** and **cybersecurity** maintenance. |
| Is CamAPS Liberty in 192? | **Yes** (code + UI strings). May be **hidden or gated** by country, pump type, or server feature flags until locally approved. |
| New Companion / xDrip+ / Nightscout export in 192? | **No.** Same E2E Companion channel; use Glooko, Dexcom Follow, or parallel CGM bridges for NS/xDrip+. |
| Is there an official 189→192 changelog? | **No detailed public changelog** found. |
| Safe to treat as identical app? | **No.** 192 adds G7 code (+160 smali files), Liberty/FCL code (`com.camdiab.fx_alert.fxfcl`), and raises **minSdk from 31 to 33**. |

### New in 192 at a glance

| Feature | 189 | 192 |
|---------|-----|-----|
| Dexcom G7 CGM | No | **Yes** |
| CamAPS Liberty (fully closed-loop) | No | **Yes** (code present; UI may be region-gated) |
| Dexcom G6 / Libre 3 | Yes | Yes |
| Standard hybrid closed-loop (Auto mode) | Yes | Yes |

---

## Version and platform table

| Item | 189 (reference) | 192 (your phone) |
|------|---------------|------------------|
| versionName | 1.4(189).101 | 1.4(192).101 |
| versionCode | 423 | 524 |
| minSdk | 31 (Android 12+) | 33 (Android 13+) |
| targetSdk | 35 | 35 |
| CPU in bundle | armeabi-v7a (32-bit) | arm64-v8a (64-bit) |
| Locale split | English (`en`) | Norwegian (`nb`) |
| Density split | mdpi | xxhdpi |
| DEX files | 3 | 4 |
| Smali files (approx) | 16,094 | 24,992 |
| Play Integrity client | 1.3.0 | 1.6.0 |
| Source trust | Third-party mirror | Google Play extract |

---

## Fully NEW features in 192 (not present in 189)

### 1. Dexcom G7 CGM integration (major)

Evidence: **160 smali files** under `com.camdiab.dexcomg7` and `com.dexcom.coresdk.g7*` in 192; **zero** in 189.

| Component | 189 | 192 |
|-----------|-----|-----|
| `com.camdiab.dexcomg7.LoginActivity` | Absent | **Present** (Dexcom account sign-in via web/UAM) |
| `com.camdiab.fx_alert.activities.SubmenuDexcomG7InfoActivity` | Absent | **Present** (G7 help submenu) |
| `com.dexcom.coresdk.g7txkit.g7core.G7CoreService` | Absent | **Present** (background G7 core service) |
| `com.dexcom.coresdk.cgmkit.watchcommunication.WatchDataListener` | Absent | **Present** |
| Dexcom G7 Library | Absent | **v1.0.0** (in-app string) |
| G7 FAQ in `arrays.xml` | No G7 section | **Full G7 Q&A block** (pairing, calibration, wear sites, 10-day + grace) |
| G7 user strings | None | Pairing code, login consent, switch-sensor logout flow, DG7X error codes, etc. |

**User-visible G7 capabilities in 192:**

- Select **Dexcom G7** as CGM type (alongside G6 and Libre 3).
- Sign in with a **Dexcom account** inside CamAPS.
- Pair G7 using a **4-digit pairing code** (not G6-style sensor code).
- G7-specific help, troubleshooting, and calibration messaging.
- Factory-calibrated G7 workflow (different from G6 sensor code flow).

**Note:** 189 contains a cloud DTO enum value `DEXCOM_G7` in `BaseDTO$CGMType` (backend typing only). There is **no runnable G7 stack** in the 189 APK.

### 2. CamAPS Liberty fully closed-loop mode (major)

[CamAPS Liberty](https://camdiab.com/liberty) is CamDiab's **fully closed-loop (FCL)** feature: when enabled, users can **skip meal/snack boluses and carb counting** while Auto mode is on. It is optional and intended for periodic use.

Evidence in 192: **present**. In 189: **zero** Liberty strings, **no** `fxfcl` package.

| Component | 189 | 192 |
|-----------|-----|-----|
| Package `com.camdiab.fx_alert.fxfcl` (`FxFcl.smali`) | Absent | **Present** |
| Modes (`FxFcl$Mode`) | Absent | **OFF**, **ON**, **MIN**, **MAX** |
| User strings mentioning "CamAPS Liberty" | **None** | **7 strings** (English defaults + Norwegian `nb` split) |
| Feature flag keys | Absent | `camaps_liberty_ypso`, `camaps_liberty_dana` |
| Country/availability gating | Absent | `setFxFclFeatureCountryAllowed`, `setFxFclFeatureCountryPersisting` |
| Usage telemetry key | Absent | `liberty_mode_usage` |

**In-app strings found in 192 (English):**

| String topic | Summary |
|--------------|---------|
| CamAPS Liberty training | Brief training required before use |
| Turning Liberty on | Confirms user is **13+** and **not pregnant** |
| Liberty active | No meal boluses needed while Auto mode is on |
| Liberty off | Reminder to bolus for meals and snacks again |
| Liberty + Auto mode | Liberty **works only when Auto mode is on** |

**Norwegian strings** are also bundled (e.g. `CamAPS Liberty-opplæring`, `CamAPS Liberty er aktiv`).

**User-visible behavior (when enabled and available):**

- Toggle Liberty from **Settings** (per [CamDiab Liberty page](https://camdiab.com/liberty)).
- More proactive algorithm; no pre-meal bolus or carb counting during active Liberty periods.
- Standard hybrid closed-loop (manual boluses) remains available when Liberty is off.

**Built-in vs visible in your app:**

| Situation | Meaning |
|-----------|---------|
| Liberty toggle visible in Settings | Feature enabled for your account, pump, and region |
| No toggle visible | Code is in the APK, but CamDiab may not have released it for your market yet |
| 189 APK | **No Liberty at all** |

CamDiab's public site notes rollout is **pending local market approvals** for some user groups (YpsoPump / Dana). The 192 APK contains the feature; visibility may depend on server-side flags.

### 3. Wearable / Dexcom watch plumbing (new infrastructure)

| Item | 189 | 192 |
|------|-----|-----|
| Permission `com.google.android.gms.permission.WEARABLE_INTERNAL` | No | **Yes** |
| Intent filters `com.google.android.gms.wearable.DATA_CHANGED` / `CHANNEL_EVENT` | No | **Yes** |
| `WatchDataListener` service | No | **Yes** |

This is **Dexcom SDK watch communication**, not a full standalone CamAPS Wear OS app. It supports the G7/Dexcom ecosystem; CamDiab still lists Wear OS CamAPS as a future roadmap item on community changelogs.

### 4. Notification policy access (new permission)

| Permission | 189 | 192 |
|------------|-----|-----|
| `android.permission.ACCESS_NOTIFICATION_POLICY` | No | **Yes** |

Likely allows the app to interact with Do Not Disturb / notification policy for alerts. No user-facing label found; treated as supporting improved alert delivery on newer Android versions.

---

## MODIFIED / updated in 192 (existing areas changed)

### 5. Android OS compatibility and minimum version

| Change | Detail |
|--------|--------|
| minSdk **31 → 33** | **Android 12 no longer supported** on 192. Requires Android 13+. |
| Regulatory messaging | Field safety notices and [CamDiab notifications](https://camdiab.com/notifications) emphasize **smartphone + OS compatibility** with CGM and pump. |
| User reports | [Insulinclub.de](https://insulinclub.de/index.php?thread/37192-camaps-fx-update-x-195-ios-x-192-android/) users report 192 running on Android 15 without issues. |
| Your device | Extracted from **OnePlus 11, Android 16** (CPH2449). |

CamDiab does **not** publish a line-by-line "Android 16 fixes" list for build 192. The update is best described as **keeping the app working on current OS versions**.

### 6. Security / licensing stack

| Item | 189 | 192 |
|------|-----|-----|
| Play Integrity client | 1.3.0 | **1.6.0** |
| `com.pairip.licensecheck.LicenseContentProvider` | Present | **Removed** |
| `com.android.vending.CHECK_LICENSE` | Present | Present |

192 updates anti-tamper / Play licensing integration. Not a user-facing feature, but relevant for install source validation.

### 7. App size and code structure

| Metric | 189 | 192 |
|--------|-----|-----|
| Total smali files | 16,094 | 24,992 (+55%) |
| DEX count | 3 | 4 |
| APK size | ~26 MB (XAPK total) | ~49 MB |

Growth is primarily **G7 SDK integration**, **CamAPS Liberty (FCL) code**, updated dependencies, and arm64/xxhdpi assets (the 189 XAPK bundle is also smaller/wrong-arch).

### 8. Dependency / library updates (modified, not new product features)

Obfuscation package rename (`b.*` → `a.*` for many support stubs) is a **rebuild artifact**, not a user feature.

Google Play Services components updated (e.g. `GoogleApiActivity` registered in 192).

---

## UNCHANGED core product features (both versions)

These exist in **both** 189 and 192:

| Feature area | Status |
|--------------|--------|
| Hybrid closed-loop (Auto mode on/off) | Same product (default HCL unchanged) |
| CamAPS Liberty (fully closed-loop, optional) | **192 only** (see section above) |
| Dexcom **G6** CGM support | Present in both |
| FreeStyle **Libre 3** (+ Plus strings in 192) | Present in both |
| YpsoPump / Dana pump connectivity | Same app family |
| SMS follower alerts (up to 5) | Same |
| Companion remote monitoring mode | Same |
| Bolus calculator, meals, personal glucose targets | Same |
| Glooko / cloud upload concepts | Same |
| Core permissions (Bluetooth, location, SMS, NFC, etc.) | Same set, plus 192 additions above |

---

## Features NOT found as new in 192

Searched but **not** evidenced as new user features in 192 vs 189:

| Rumored / checked | Result |
|-------------------|--------|
| Full CamAPS Wear OS app | **Not in 192** (only Dexcom watch listener plumbing) |
| Health Connect integration | Library references in 192 smali only; **no manifest Health Connect permission** |
| New pump types | Not found |
| CamAPS Liberty (FCL) | **Present in 192**; absent in 189 (see section 2) |
| General algorithm / target changes outside Liberty | Not separately documented in public sources |
| Libre 3 Plus as exclusive to 192 | String exists in 192; Libre 3 family already in 189 |

---

## Public changelog vs APK analysis

| Source | What it says about 189 → 192 |
|--------|------------------------------|
| [CamDiab notifications](https://camdiab.com/notifications) | New versions for **OS compatibility** and **cybersecurity**; versions below 1.4(190) discontinued from 31/03/2026 |
| [TGA market action](https://www.tga.gov.au/safety/recalls-and-other-market-actions/market-actions/mylife-camaps-fx-app) | Software update for **recent smartphone OS** compatibility |
| [Insulinclub.de](https://insulinclub.de/index.php?thread/37192-camaps-fx-update-x-195-ios-x-192-android/) | 192 rolling out on Play; staggered by app variant/region |
| [Pieter de Bruijn changelog](https://pieterdebruijn.nl/camaps-fx-development-and-changelog/) | **Not updated** past 2024; no 189/192 entries |
| [CamAPS Liberty](https://camdiab.com/liberty) | FCL feature embedded in CamAPS FX; market rollout **pending** for some pump/region combinations |
| **This APK diff** | **Dexcom G7** and **CamAPS Liberty** are the clear functional additions in 192 |

---

## Recommendation table

| Goal | Use |
|------|-----|
| Run on OnePlus 11 / Android 13+ | **192 only** |
| Use Dexcom G7 sensor | **192 only** |
| Use CamAPS Liberty (FCL, no meal boluses) | **192 only** (if toggle appears for your region/pump) |
| Keep Play-signed backup | **4 split APKs** from phone extract |
| Reference / do not install | Older **189** XAPK (wrong CPU arch + older build) |

---

## CGM error codes (Libre, G6, G7)

**Yes:** all user-facing support reference codes and internal notification enums can be extracted from a decompiled APK. CamAPS does **not** ship a public error-code manual; the APK `strings.xml` and `HandleErrorMessage$NotificationCodes` smali enums are the authoritative in-app sources.

### Two layers of "error codes"

| Layer | What it is | Where to find it |
|-------|------------|------------------|
| **User-facing support codes** | Short IDs shown in alerts (e.g. `LBR012`, `DDC045`, `DG7X023`) | `resources/package_1/res/values/strings.xml` |
| **Internal notification enums** | Developer-facing names (e.g. `LS3_MSG_SIGNAL_LOSS`, `DX_MSG_PAIRING_FAILED`) | `HandleErrorMessage$NotificationCodes.smali` per CGM package |

User-facing messages for internal errors are mostly generic ("Internal error XXXXX. Restart your smart device."). The code is still useful when contacting CamDiab / mylife support.

### Counts in 1.4(192).101

| CGM | String prefix | User-facing codes | Internal enum constants | 189 vs 192 |
|-----|---------------|-------------------|-------------------------|------------|
| **FreeStyle Libre 3** | `LBR###` | **25** (`LBR001`–`LBR025`) | **44** (`LS3_*` in `uk.ac.cam.ap.libre.error`) | Same in 189 |
| **Dexcom G6** | `DDC###` + `DCI###` | **81** + **82** = **163** | **59** (`DX_*` in `uk.ac.cam.ap.dexcom.error`) | Same in 189 |
| **Dexcom G7** | `DG7X###` | **18** (`DG7X001`–`DG7X041`, non-contiguous) | **44** (`DX_*` in `com.camdiab.dexcomg7.alerts`) | **192 only** (0 in 189) |

**G7 user-facing codes (192):** DG7X001, DG7X002, DG7X003, DG7X023, DG7X024, DG7X025, DG7X026, DG7X027, DG7X028, DG7X029, DG7X030, DG7X031, DG7X032, DG7X033, DG7X034, DG7X037, DG7X038, DG7X041.

**Libre user-facing codes (both builds):** LBR001 through LBR025.

**G6 user-facing codes (both builds):** DDC001 through DDC081 and DCI001 through DCI082 (sequential blocks). All use the same message pattern except where noted below.

### Full user-facing error code list (1.4.192.101)

Source: `to-do/CGM-ERROR-CODES-192.csv`. Libre and G6 codes are **identical in 189 and 192**. G7 codes are **192 only**.

#### FreeStyle Libre 3 (`LBR###`) — 25 codes, both 189 and 192

| Code | Message (English) |
|------|-------------------|
| LBR001 | Internal error LBR001. Restart your smart device. |
| LBR002 | Internal error LBR002. Restart your smart device. |
| LBR003 | Internal error LBR003. Restart your smart device. |
| LBR004 | Internal error LBR004. Restart your smart device. |
| LBR005 | Internal error LBR005. Restart your smart device. |
| LBR006 | Internal error LBR006. Restart your smart device. |
| LBR007 | Internal error LBR007. Restart your smart device. |
| LBR008 | Internal error LBR008. Restart your smart device. |
| LBR009 | Internal error LBR009. Restart your smart device. |
| LBR010 | Internal error LBR010. Restart your smart device. |
| LBR011 | Internal error LBR011. Restart your smart device. |
| LBR012 | Internal error LBR012. Restart your smart device. |
| LBR013 | Internal error LBR013. Restart your smart device. |
| LBR014 | Internal error LBR014. Restart your smart device. |
| LBR015 | Internal error LBR015. Restart your smart device. |
| LBR016 | Internal error LBR016. Restart your smart device |
| LBR017 | Internal error LBR017. Restart your smart device. |
| LBR018 | Internal error LBR018. Restart your smart device. |
| LBR019 | Internal error LBR019. Restart your smart device. |
| LBR020 | Internal error LBR020. Restart your smart device. |
| LBR021 | Internal error LBR021. Restart your smart device. |
| LBR022 | Internal error LBR022. Restart your smart device. |
| LBR023 | Internal error LBR023. Restart your smart device. |
| LBR024 | Internal error LBR024. Restart your smart device. |
| LBR025 | Internal error LBR025. Restart your smart device. |

Norwegian locale (`nb`): `Intern feil LBRnnn. Start smartenheten på nytt.`

#### Dexcom G7 (`DG7X###`) — 18 codes, **192 only**

| Code | Message (English) |
|------|-------------------|
| DG7X001 | Internal error DG7X001. Restart your smart device. |
| DG7X002 | Internal error DG7X002. Restart your smart device. |
| DG7X003 | Internal error DG7X003. Restart your smart device. |
| DG7X023 | Internal error DG7X023. Restart your smart device. |
| DG7X024 | Internal error DG7X024. Restart your smart device. |
| DG7X025 | Internal error DG7X025. Restart your smart device. |
| DG7X026 | Internal error DG7X026. Restart your smart device. |
| DG7X027 | Internal error DG7X027. Restart your smart device |
| DG7X028 | Internal error DG7X028. Restart your smart device. |
| DG7X029 | Internal error DG7X029. Restart your smart device. |
| DG7X030 | Internal error DG7X030. Restart your smart device. |
| DG7X031 | Internal error DG7X031. Restart your smart device. |
| DG7X032 | Internal error DG7X032. Restart your smart device. |
| DG7X033 | Internal error DG7X033. Restart your smart device. |
| DG7X034 | Internal error DG7X034. Restart your smart device. |
| DG7X037 | Internal error DG7X037. Restart your smart device. |
| DG7X038 | Internal error DG7X038. Restart your smart device. |
| DG7X041 | An error DG7X041 has occurred. Restart the app or restart your smart device. |

#### Dexcom G6 (`DDC###` + `DCI###`) — 163 codes, both 189 and 192

All codes use: **Internal error {code}. Restart your smart device.**

**DDC block (81 codes):** DDC001, DDC002, DDC003, DDC004, DDC005, DDC006, DDC007, DDC008, DDC009, DDC010, DDC011, DDC012, DDC013, DDC014, DDC015, DDC016, DDC017, DDC018, DDC019, DDC020, DDC021, DDC022, DDC023, DDC024, DDC025, DDC026, DDC027, DDC028, DDC029, DDC030, DDC031, DDC032, DDC033, DDC034, DDC035, DDC036, DDC037, DDC038, DDC039, DDC040, DDC041, DDC042, DDC043, DDC044, DDC045, DDC046, DDC047, DDC048, DDC049, DDC050, DDC051, DDC052, DDC053, DDC054, DDC055, DDC056, DDC057, DDC058, DDC059, DDC060, DDC061, DDC062, DDC063, DDC064, DDC065, DDC066, DDC067, DDC068, DDC069, DDC070, DDC071, DDC072, DDC073, DDC074, DDC075, DDC076, DDC077, DDC078, DDC079, DDC080, DDC081

**DCI block (82 codes):** DCI001, DCI002, DCI003, DCI004, DCI005, DCI006, DCI007, DCI008, DCI009, DCI010, DCI011, DCI012, DCI013, DCI014, DCI015, DCI016, DCI017, DCI018, DCI019, DCI020, DCI021, DCI022, DCI023, DCI024, DCI025, DCI026, DCI027, DCI028, DCI029, DCI030, DCI031, DCI032, DCI033, DCI034, DCI035, DCI036, DCI037, DCI038, DCI039, DCI040, DCI041, DCI042, DCI043, DCI044, DCI045, DCI046, DCI047, DCI048, DCI049, DCI050, DCI051, DCI052, DCI053, DCI054, DCI055, DCI056, DCI057, DCI058, DCI059, DCI060, DCI061, DCI062, DCI063, DCI064, DCI065, DCI066, DCI067, DCI068, DCI069, DCI070, DCI071, DCI072, DCI073, DCI074, DCI075, DCI076, DCI077, DCI078, DCI079, DCI080, DCI081, DCI082

### Full internal notification enum list (1.4.192.101)

Source: `to-do/CGM-NOTIFICATION-ENUMS-192.csv`. Used in logs and developer mapping; not always shown to users. Libre and G6 enums are **identical in 189 and 192**. G7 enums are **192 only**.

#### Libre (`LS3_*`) — 44 constants

`LS3_DB_CONTEXT_NULL`, `LS3_DB_CREATION_FAIL`, `LS3_DB_DELETE_FAIL`, `LS3_DB_DEL_EXCEPTION`, `LS3_DB_DEL_EXCEPTION2`, `LS3_DB_DEL_EXCEPTION3`, `LS3_DB_GET_EXCEPTION1`, `LS3_DB_GET_EXCEPTION2`, `LS3_DB_INS_EXCEPTION`, `LS3_DB_INS_FAILED`, `LS3_DB_INTEGRITY_FAIL`, `LS3_DB_OPEN_EXCEPTION`, `LS3_HANDLER_STUCK`, `LS3_MSG_BAD_IDX_1`, `LS3_MSG_BAD_IDX_2`, `LS3_MSG_BAD_IDX_3`, `LS3_MSG_BAD_IDX_4`, `LS3_MSG_CRC_CALC`, `LS3_MSG_CRC_CHECK`, `LS3_MSG_CURR_SENSOR`, `LS3_MSG_EXC_MSG_ACK`, `LS3_MSG_EXC_SAVE_INFO`, `LS3_MSG_FALL_RATE`, `LS3_MSG_HIGH`, `LS3_MSG_LOW`, `LS3_MSG_NO_READINGS`, `LS3_MSG_RISE_RATE`, `LS3_MSG_SENSOR_2HOURS`, `LS3_MSG_SENSOR_30MINUTES`, `LS3_MSG_SENSOR_6HOURS`, `LS3_MSG_SENSOR_EXPIRED`, `LS3_MSG_SENSOR_FAILED`, `LS3_MSG_SENSOR_WARM_UP`, `LS3_MSG_SIGNAL_LOSS`, `LS3_MSG_START_SESS_ERR`, `LS3_MSG_TEMP_HIGH`, `LS3_MSG_TEMP_LOW`, `LS3_MSG_UNKNOWN_ERROR`, `LS3_MSG_URGENT_LOW`, `LS3_MSG_URGENT_LOW_SOON`, `LS3_MSG_VITAMIN_C`, `LS3_MSG_WAKELOCK_ERROR`, `LS3_MSG_WRONG_PIN`, `LS3_TOO_BIG_GAP`

#### Dexcom G6 (`DX_*`) — 59 constants

`DX_DB_CIPHER`, `DX_DB_CONTEXT_NULL`, `DX_DB_CREATION_FAIL`, `DX_DB_DELETE_FAIL`, `DX_DB_DEL_EXCEPTION`, `DX_DB_DEL_EXCEPTION2`, `DX_DB_DEL_EXCEPTION3`, `DX_DB_GET_EXCEPTION1`, `DX_DB_GET_EXCEPTION2`, `DX_DB_INS_EXCEPTION`, `DX_DB_INS_FAILED`, `DX_DB_INTEGRITY_FAIL`, `DX_DB_OPEN_EXCEPTION`, `DX_END_OF_LIFE`, `DX_MSG_1ST_CALIB`, `DX_MSG_2ND_CALIB`, `DX_MSG_CALIB_ERR`, `DX_MSG_CRC_CALC`, `DX_MSG_CRC_CHECK`, `DX_MSG_CYCLE_BLUETOOTH`, `DX_MSG_END_SESS_ERR`, `DX_MSG_EXCEPTION`, `DX_MSG_EXC_MSG_ACK`, `DX_MSG_FALL_RATE`, `DX_MSG_GATT_ERROR_NOTI`, `DX_MSG_HIGH`, `DX_MSG_INVALID_BG`, `DX_MSG_LOW`, `DX_MSG_NEXT_CALIB`, `DX_MSG_NEXT_NEW_CALIB`, `DX_MSG_NO_READINGS`, `DX_MSG_PAIRED`, `DX_MSG_PAIRING`, `DX_MSG_PAIRING_FAILED`, `DX_MSG_PLANNED_CALIB`, `DX_MSG_RESTART_APP`, `DX_MSG_RISE_RATE`, `DX_MSG_SCAN_STUCK`, `DX_MSG_SENSOR_2HOURS`, `DX_MSG_SENSOR_30MINUTES`, `DX_MSG_SENSOR_6HOURS`, `DX_MSG_SENSOR_EXPIRED`, `DX_MSG_SENSOR_FAILED`, `DX_MSG_SENSOR_RESTART`, `DX_MSG_SENSOR_WARM_UP`, `DX_MSG_SIGNAL_LOSS`, `DX_MSG_SN_NAME_WRONG`, `DX_MSG_START_SESS_ERR`, `DX_MSG_TRANS_14DAYS`, `DX_MSG_TRANS_22DAYS`, `DX_MSG_TRANS_FAILED`, `DX_MSG_TRANS_LAST_END`, `DX_MSG_TRANS_LAST_START`, `DX_MSG_TRANS_LOW_BATTERY`, `DX_MSG_TRANS_TAKEN`, `DX_MSG_UNKNOWN_ERROR`, `DX_MSG_URGENT_LOW`, `DX_MSG_URGENT_LOW_SOON`, `DX_MSG_WAKELOCK_ERROR`

#### Dexcom G7 (`DX_*`, separate package) — 44 constants, **192 only**

`DX_DB_CONTEXT_NULL`, `DX_DB_CREATION_FAIL`, `DX_DB_DELETE_FAIL`, `DX_DB_DEL_EXCEPTION`, `DX_DB_DEL_EXCEPTION2`, `DX_DB_DEL_EXCEPTION3`, `DX_DB_GET_EXCEPTION1`, `DX_DB_GET_EXCEPTION2`, `DX_DB_INS_EXCEPTION`, `DX_DB_INS_FAILED`, `DX_DB_INTEGRITY_FAIL`, `DX_DB_OPEN_EXCEPTION`, `DX_INVALID_TEST_CODE`, `DX_MSG_BAD_CALIBRATION`, `DX_MSG_CRC_CALC`, `DX_MSG_CRC_CHECK`, `DX_MSG_EXC_MSG_ACK`, `DX_MSG_FALL_RATE`, `DX_MSG_HIGH`, `DX_MSG_LOW`, `DX_MSG_OUT_OF_RANGE`, `DX_MSG_PAIRED`, `DX_MSG_PAIRING`, `DX_MSG_PAIRING_FAILED`, `DX_MSG_RESTART_APP`, `DX_MSG_RISE_RATE`, `DX_MSG_SENSOR_24_HOURS`, `DX_MSG_SENSOR_2HOURS`, `DX_MSG_SENSOR_FAILED`, `DX_MSG_SENSOR_GRACE`, `DX_MSG_SENSOR_NO_GRACE`, `DX_MSG_SIGNAL_LOSS`, `DX_MSG_SIV_FAIL`, `DX_MSG_STOPPED`, `DX_MSG_TEMP_PROBLEM`, `DX_MSG_TRANS_FAILED`, `DX_MSG_UNKNOWN_ERROR`, `DX_MSG_URGENT_LOW`, `DX_MSG_URGENT_LOW_SOON`, `DX_MSG_WARMUP`, `DX_NO_DEXCOM_CERT`, `DX_NO_DISK_SPACE`, `DX_NO_FACTORY_TIME`, `DX_NO_ROOT_CERT`

### Smali paths (192 decompile)

| CGM | NotificationCodes enum file |
|-----|----------------------------|
| Libre 3 | `smali/classes4/uk/ac/cam/ap/libre/error/HandleErrorMessage$NotificationCodes.smali` |
| Dexcom G6 | `smali/classes/uk/ac/cam/ap/dexcom/error/HandleErrorMessage$NotificationCodes.smali` |
| Dexcom G7 | `smali/classes3/com/camdiab/dexcomg7/alerts/HandleErrorMessage$NotificationCodes.smali` |

Example internal Libre codes: `LS3_MSG_SENSOR_EXPIRED`, `LS3_MSG_WRONG_PIN`, `LS3_MSG_VITAMIN_C`, `LS3_MSG_SIGNAL_LOSS`.

Example internal G6 codes: `DX_MSG_1ST_CALIB`, `DX_MSG_TRANS_LOW_BATTERY`, `DX_MSG_PAIRING_FAILED`, `DX_END_OF_LIFE`.

Example internal G7 codes: `DX_MSG_BAD_CALIBRATION`, `DX_MSG_SENSOR_GRACE`, `DX_MSG_WARMUP`, `DX_INVALID_TEST_CODE`.

G6 and G7 share the `DX_` prefix in enums but live in **different packages**; G7 enums are not a superset of G6.

### How to extract (repeatable)

1. Decompile build 192:
   ```powershell
   java -jar backups\camaps-fx\tools\APKEditor.jar d -i <path-to-192.apk> -o $env:TEMP\camaps-deep\192
   ```
2. Run the extractor script:
   ```powershell
   .\backups\camaps-fx\tools\extract-cgm-error-codes.ps1 -DecompileRoot $env:TEMP\camaps-deep\192
   ```
3. Or grep `strings.xml` manually:
   ```powershell
   Select-String -Path "$env:TEMP\camaps-deep\192\resources\package_1\res\values\strings.xml" -Pattern '\b(DG7X|DDC|DCI|LBR)\d{3}\b'
   ```

### Exported inventories (this investigation)

| File | Contents |
|------|----------|
| `to-do/CGM-ERROR-CODES-192.csv` | 206 user-facing code + message rows |
| `to-do/CGM-NOTIFICATION-ENUMS-192.csv` | 147 internal enum constant names |
| `APK-COMPARISON-189-vs-192-REPORT.nb.md` | Norwegian version of this report (same structure) |
| `APK-COMPARISON-189-vs-192-REPORT.html` | HTML export of this report |
| `APK-COMPARISON-189-vs-192-REPORT.nb.html` | HTML export of Norwegian report |
| `index.html` | Links to both HTML reports |
| `tools/extract-cgm-error-codes.ps1` | Regenerates both CSVs from any decompile tree |

### Limits

- Codes are **CamAPS-internal** reference IDs, not Dexcom or Abbott public fault codes.
- Most user strings do not explain root cause; support uses the code to look up logs.
- Norwegian (`nb`) and other locale splits may override message text; codes stay the same.
- Runtime-only errors (no string resource) would not appear in `strings.xml`; enum smali is the fallback list.

### Abbott Libre numeric codes (2024 community list) vs CamAPS codes

Your August 2024 list uses **Abbott LibreLink / sensor fault numbers** (e.g. 57, 335, 373, 380, 4000-series, 410–725). CamAPS uses a **different scheme** and does **not** embed those Abbott numbers in `strings.xml`.

| System | Example codes | Where seen | In CamAPS 189/192 APK? |
|--------|---------------|------------|--------------------------|
| **Abbott Libre app / NFC scan** | 373, 365, 335, 57, 380 | LibreLink, scan errors, sensor faults | **No** (not in strings) |
| **CamAPS support reference** | `LBR001`–`LBR025` | "Internal error LBR012. Restart your smart device." | **Yes** (25 codes, **unchanged** 189→192) |
| **CamAPS Libre driver enums** | `LS3_MSG_SIGNAL_LOSS`, `LS3_MSG_SENSOR_EXPIRED`, … | Developer / log mapping | **Yes** (44 enums, **unchanged** 189→192) |

**Practical mapping (conceptual, not 1:1 in APK):**

| Your 2024 Abbott code | Typical meaning | CamAPS equivalent (approx.) |
|-----------------------|-----------------|----------------------------|
| 57 (Libre 3) | New sensor / starting up | `LS3_MSG_SENSOR_WARM_UP`, warmup UI strings |
| 335 (Libre 2 scan) | Scan failed, try again | NFC scan help strings; `LS3_MSG_START_SESS_ERR` |
| 338 | Sensor starting, not ready | Warmup / 30 min messages (`LS3_MSG_SENSOR_30MINUTES`) |
| 365 | Sensor not working, replace | `LS3_MSG_SENSOR_FAILED` |
| 366 | Check adhesion / restart | Sensor failed / contact distributor strings |
| 373 (+ P/E/F/I variants) | Glucose unavailable / rate change | `LS3_MSG_NO_READINGS`, `LS3_MSG_RISE_RATE`, `LS3_MSG_FALL_RATE` |
| 380 | Measurement problems | `LS3_MSG_UNKNOWN_ERROR` or internal `LBR###` |
| 4000-series (4005, 4010, …) | General faults (community reported) | **Not listed** in CamAPS; may map internally to `LBR###` only |
| 410–725 block | Community "general" descriptions | **Not in APK** as numeric codes; treat as unofficial unless Abbott documents them |

**Still current for CamAPS (192):** use **`LBR###` + `LS3_*`** from this report and `CGM-ERROR-CODES-192.csv`, not the 2024 Abbott number list, when talking to CamDiab / mylife support about CamAPS. Keep the Abbott list for **LibreLink-only** or **raw NFC** troubleshooting.

**Unchanged 189→192:** Libre user-facing (`LBR###`) and internal (`LS3_*`) sets are identical. **New in 192:** only **G7** codes (`DG7X###`, 18 user-facing).

---

## Companion, Glooko, and third-party sharing (xDrip+ / Nightscout)

### Short answer

| Question | Answer |
|----------|--------|
| New Companion fields in 192 for xDrip+ / Nightscout? | **No.** No `nightscout`, `xdrip`, or glucose broadcast intents in either APK. |
| Can Companion feed xDrip+ or Nightscout directly? | **No.** Companion is **E2E encrypted CamAPS-to-CamAPS** only. |
| What changed for sharing in 192? | **No new export API.** Same share menu; **new data types** may appear inside existing channels when you use **G7** or **Liberty**. |

### Official sharing channels (both 189 and 192)

| Channel | Direction | Data (per in-app strings / GDPR) | xDrip+ / Nightscout path |
|---------|-----------|-----------------------------------|---------------------------|
| **CamAPS Companion** | Patient phone → Companion's CamAPS app (E2E) | Sensor glucose, insulin data, optional trend graph; pump/CGM **view only** on Companion | **None built-in.** Companion cannot re-share or control devices. |
| **Glooko / Glooko XT** | Upload to linked Glooko user | Therapy + device upload (cloud DTOs) | **Indirect:** community Glooko → Nightscout bridges (outside CamAPS). |
| **mylife Cloud** | Upload to Ypsomed cloud account | Same DTO family as Glooko path | **Indirect:** proprietary; no NS/xDrip strings in APK. |
| **Dexcom Follow** | To Dexcom Follow app followers | CGM data, alerts, optional trend graph (**G6/G7**) | **Separate from Companion.** xDrip+ can use Dexcom Share/Follow as its own source, not from CamAPS Companion. |
| **SMS Followers** | SMS alerts (up to 5) | Alert messages only | Not a glucose stream for Nightscout. |

Companion and SMS Followers are **mutually exclusive** (same as before).

### What Companion shares (unchanged GDPR text 189 vs 192)

GDPR **Usage and Linkage Data** paragraph is **byte-identical** in 189 and 192:

- Pump and transmitter serial number
- Pump, sensor, and **closed-loop / open-loop actions trail**
- App command-flow trail
- Event trail
- Follower / portal account info as entered in the app
- Support queries, trainer details

Companion invite text (192): share **sensor glucose and insulin data** with optional **trend graph view**. Companion mode: **no** data re-sharing, **no** pump/CGM control.

### Cloud DTO fields (Glooko / mylife upload): 189 vs 192 diff

Compared `com.camdiab.fx_alert.cloud.mylife.data.dto.*` between builds:

| DTO / enum | 189 | 192 | New fields for NS? |
|------------|-----|-----|-------------------|
| `CGMReadingDTO` public fields | 15 fields (Egv, Rate, PredictedEgv, …) | **Same 15** | No |
| `TherapyEventDTO$RecordType` | Bolus, Carbs, AutoMode, BasalRate, … | **Same set** | No `Liberty` record type |
| `DeviceUploadDTO` public fields | device settings, basal programs, … | **Same set** | No |
| `BaseDTO$CGMType` | DEXCOM_G6, DEXCOM_G7, LIBRE_3, LIBRE_3_PLUS | **Same** (G7 enum existed in 189 DTO only) | G7 **live** in 192 |

So there are **no new JSON/DTO properties** in 192 that xDrip+ or Nightscout could consume without a separate bridge.

### What is *new in practice* for followers (192 only)

These are not new Companion **settings**, but new **content** a Companion or cloud upload may carry when the patient uses 192 features:

| Feature | Visible to Companion? | Visible via Glooko/mylife? | Notes |
|---------|----------------------|----------------------------|-------|
| **Dexcom G7** CGM readings | Yes (same glucose/insulin UI) | Yes (`DEXCOM_G7` CGM type) | G7 stack is **192-only**; DTO enum was already in 189. |
| **CamAPS Liberty** (FCL) | Likely **indirect** (different loop/bolus pattern) | Unknown; telemetry key `liberty_mode_usage` in 192 | No `Liberty` string in cloud DTOs; no dedicated Companion toggle in strings. |
| **Libre 3 Plus** | Yes if that CGM is selected | Yes (`LIBRE_3_PLUS`) | Already in 189 strings/DTO. |
| **G7 error codes** (`DG7X###`) | Only if shown on patient device | Unlikely in uploads | 18 codes, 192 only. |

### Recommended paths to Nightscout / xDrip+ (outside CamAPS)

| Setup | Typical approach |
|-------|------------------|
| Libre 3 on CamAPS | xDrip+ **Juggluco / Libre broadcast** or **OOP** on a separate device; CamAPS Companion does **not** replace this. |
| Dexcom G6/G7 on CamAPS | **Dexcom Follow** or Share on follower phone → xDrip+ follower mode; parallel to CamAPS, not via Companion. |
| Full therapy + pump data to NS | **Glooko upload** from CamAPS → third-party Glooko sync tools (community); verify your bridge supports current CamAPS/Glooko XT. |
| Companion phone only | Install CamAPS as Companion; data stays inside CamAPS. Reverse-engineering E2E channel is **not** supported by the app. |

**Bottom line:** 192 adds **G7** and **Liberty** as therapy features, but **no new open export** for xDrip+ or Nightscout. For open-loop integrations, use **Glooko**, **Dexcom Follow**, or a **parallel CGM path** (Juggluco/xDrip+), not CamAPS Companion.

---

## Investigation artifacts

- Decompiled trees: `%TEMP%\camaps-deep\189-base`, `%TEMP%\camaps-deep\192`
- CGM error exports: `to-do/CGM-ERROR-CODES-192.csv`, `to-do/CGM-NOTIFICATION-ENUMS-192.csv`
- Norwegian report: `to-do/APK-COMPARISON-189-vs-192-REPORT.nb.md`
- Extractor script: `tools/extract-cgm-error-codes.ps1`
- Tools: APKEditor 1.4.5, platform-tools adb 37.0.0
- Original plan: `camaps_apk_comparison_7491c498.plan.md`
