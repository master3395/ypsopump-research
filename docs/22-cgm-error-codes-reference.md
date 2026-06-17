# 22 — CGM error codes in CamAPS FX (build 192)

> **Document 22** | master3395 fork addition | Build: **1.4(192).101**  
> Data: [`data/cgm-error-codes-192.csv`](../data/cgm-error-codes-192.csv), [`data/cgm-notification-enums-192.csv`](../data/cgm-notification-enums-192.csv)  
> Related: [20 — APK 189 vs 192](20-camaps-apk-189-vs-192.md)

## Important: CamAPS codes vs LibreLink codes

CamAPS FX shows **short support IDs** such as `LBR012`, `DDC045`, or `DG7X023`. These are **not** the same as numeric codes in the standalone **Abbott LibreLink** app (for example 373, 335, 410).

If support asks for a CamAPS error code, quote the **letter prefix ID** from the alert, not LibreLink numbers from a different app.

## Two layers in the APK

| Layer | Examples | Where defined |
|-------|----------|---------------|
| **User-facing support codes** | `LBR###`, `DDC###`, `DCI###`, `DG7X###` | `strings.xml` (shown in alerts) |
| **Internal notification enums** | `LS3_*`, `DX_*`, etc. | Java/Kotlin alert handlers |

Full machine-readable lists:

- [cgm-error-codes-192.csv](../data/cgm-error-codes-192.csv) (206 user-facing rows)
- [cgm-notification-enums-192.csv](../data/cgm-notification-enums-192.csv) (147 internal enums)

## Summary by CGM type (build 192)

| CGM | User-facing prefix | Count in 192 | 189 vs 192 |
|-----|-------------------|--------------|------------|
| FreeStyle Libre 3 | `LBR###` | 25 (`LBR001`–`LBR025`) | Same in 189 and 192 |
| Dexcom G6 | `DCI###` | 25+ | Same in 189 and 192 |
| Dexcom G6 (alt) | `DDC###` | varies | Same in 189 and 192 |
| Dexcom G7 | `DG7X###` | 18 codes | **192 only** (G7 stack absent in 189) |

### Dexcom G7 user-facing codes (192 only)

`DG7X001`, `DG7X002`, `DG7X003`, `DG7X023`, `DG7X024`, `DG7X025`, `DG7X026`, `DG7X027`, `DG7X028`, `DG7X029`, `DG7X030`, `DG7X031`, `DG7X032`, `DG7X033`, `DG7X034`, `DG7X037`, `DG7X038`, `DG7X041`.

### FreeStyle Libre 3 user-facing codes (both builds)

`LBR001` through `LBR025`. Most messages follow the pattern: *"Internal error LBRnnn. Restart your smart device."*

## Sample rows (user-facing)

| CGM | Code | Message (excerpt) |
|-----|------|-------------------|
| Dexcom G6 (DCI) | DCI001 | Internal error DCI001. Restart your smart device. |
| Dexcom G6 (DDC) | DDC045 | (see CSV for full text) |
| Libre 3 | LBR012 | Internal error LBR012. Restart your smart device. |
| Dexcom G7 | DG7X023 | (see CSV; 192 only) |

## Regenerating the CSV files

If you decompile a newer CamAPS build locally, adapt the extractor from the [master3395 fork CHANGELOG](../CHANGELOG.md) or the original CamAPS backup tooling. Do not commit APK binaries or smali trees to this repository.

## See also

- [20 — CamAPS APK 189 vs 192](20-camaps-apk-189-vs-192.md): full tables and CGM section
- [11 — CamAPS algorithm analysis](11-camaps-algorithm-analysis.md): upstream analysis on build 190
