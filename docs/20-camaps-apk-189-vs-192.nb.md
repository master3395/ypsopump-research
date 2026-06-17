# CamAPS FX (mmol/L): sammenlign 189 vs 192

> **Dokument 20** | master3395 fork-tillegg | Undersøkelsesdato: 17/06/2026  
> Relatert: [11 — CamAPS-algoritme](11-camaps-algorithm-analysis.md), [21 — Liberty-tilgjengelighet](21-camaps-liberty-availability.md), [22 — CGM-feilkoder](22-cgm-error-codes-reference.md)

Undersøkelsesdato: 17/06/2026 (oppdatert med CamAPS Liberty-funn)

Sammenlign **189 vs 192**:

| Versjon | Kilde | versionCode |
|-------|--------|-------------|
| **189** | `1.4(189).101` (referanse-XAPK, eldre build) | 423 |
| **192** | `1.4(192).101` (Google Play, OnePlus 11) | 524 |

Metode: APKEditor-dekompilering, manifest-diff, strings/arrays-diff, smali-pakkeskanning, offentlige kilder.

---

## Kort oppsummert

| Spørsmål | Svar |
|----------|--------|
| Er 192 en stor funksjonsoppdatering for brukere? | **Yes.** To hovednyheter: **Dexcom G7 CGM-støtte** og **CamAPS Liberty** (fullt lukket sløyfe). |
| Er det bare feilrettinger/kompatibilitet? | **Også ja.** CamDiab/Ypsomed omtaler nylige Android-oppdateringer som **OS-kompatibilitet** og **cybersikkerhet**. |
| Finnes CamAPS Liberty i 192? | **Ja** (kode + UI-tekster). Kan være **skjult eller begrenset** av land, pumpe, eller server-flagg til lokalt godkjent. |
| Ny Companion / xDrip+ / Nightscout-eksport i 192? | **Nei.** Samme E2E Companion-kanal; bruk Glooko, Dexcom Follow eller parallell CGM-bro for NS/xDrip+. |
| Finnes offisiell endringslogg 189→192? | **Ingen detaljert offentlig endringslogg** funnet. |
| Kan 189 og 192 behandles som samme app? | **Nei.** 192 legger til G7-kode (+160 smali-filer), Liberty/FCL-kode (`com.camdiab.fx_alert.fxfcl`), og hever **minSdk fra 31 til 33**. |

### Nytt i 192 på et blikk

| Funksjon | 189 | 192 |
|---------|-----|-----|
| Dexcom G7 CGM | Nei | **Ja** |
| CamAPS Liberty (fullt lukket sløyfe) | Nei | **Yes** (kode finnes; UI kan være regionsbegrenset) |
| Dexcom G6 / Libre 3 | Ja | Yes |
| Standard hybrid lukket sløyfe (Auto-modus) | Ja | Yes |

---

## Versjon og plattform

| Punkt | 189 (referanse) | 192 (din telefon) |
|------|---------------|------------------|
| versionName | 1.4(189).101 | 1.4(192).101 |
| versionCode | 423 | 524 |
| minSdk | 31 (Android 12+) | 33 (Android 13+) |
| targetSdk | 35 | 35 |
| CPU i pakke | armeabi-v7a (32-bit) | arm64-v8a (64-bit) |
| Språk-split | English (`en`) | Norwegian (`nb`) |
| Tetthet-split | mdpi | xxhdpi |
| DEX-filer | 3 | 4 |
| Smali-filer (ca.) | 16,094 | 24,992 |
| Play Integrity-klient | 1.3.0 | 1.6.0 |
| Kildetillit | Tredjepartsspeil | Google Play-uttrekk |

---

## Helt NYTT i 192 (finnes ikke i 189)

### 1. Dexcom G7 CGM-integrasjon (stor)

Bevis: **160 smali-filer** under `com.camdiab.dexcomg7` og `com.dexcom.coresdk.g7*` i 192; **null** i 189.

| Komponent | 189 | 192 |
|-----------|-----|-----|
| `com.camdiab.dexcomg7.LoginActivity` | Mangler | **Finnes** (Dexcom-kontoinnlogging via web/UAM) |
| `com.camdiab.fx_alert.activities.SubmenuDexcomG7InfoActivity` | Mangler | **Finnes** (G7-hjelpeundermeny) |
| `com.dexcom.coresdk.g7txkit.g7core.G7CoreService` | Mangler | **Finnes** (bakgrunnstjeneste for G7-kjerne) |
| `com.dexcom.coresdk.cgmkit.watchcommunication.WatchDataListener` | Mangler | **Finnes** |
| Dexcom G7 Library | Mangler | **v1.0.0** (in-app string) |
| G7 FAQ i `arrays.xml` | Ingen G7-seksjon | **Full G7 spørsmål/svar-blokk** (paring, kalibrering, påsettingssteder, 10 dager + grace) |
| G7-brukertekster | Ingen | Pairing code, login consent, switch-sensor logout flow, DG7X error codes, etc. |

**Brukersynlige G7-funksjoner i 192:**

- Velg **Dexcom G7** som CGM-type (ved siden av G6 og Libre 3).
- Logg inn med **Dexcom-konto** i CamAPS.
- Par G7 med **4-sifret paringskode** (ikke G6-sensorkode).
- G7-spesifikk hjelp, feilsøking og kalibreringsmeldinger.
- Fabrikkskalibrert G7-flyt (annerledes enn G6 sensorkode-flyt).

**Merk:** 189 har cloud DTO enum `DEXCOM_G7` i `BaseDTO$CGMType` (kun backend-typing). Det finnes **ingen kjørbar G7-stack** i 189-APK.

### 2. CamAPS Liberty fullt lukket sløyfe (stor)

[CamAPS Liberty](https://camdiab.com/liberty) er CamDiabs **fullt lukket sløyfe (FCL)**-funksjon: når aktivert kan brukere **hoppe over måltids-/snackbolus og karbohydrattelling** mens Auto-modus er på. Valgfritt og ment for periodisk bruk.

Bevis i 192: **finnes**. I 189: **null** Liberty-tekster, **ingen** `fxfcl`-pakke.

| Komponent | 189 | 192 |
|-----------|-----|-----|
| Package `com.camdiab.fx_alert.fxfcl` (`FxFcl.smali`) | Mangler | **Finnes** |
| Modes (`FxFcl$Mode`) | Mangler | **OFF**, **ON**, **MIN**, **MAX** |
| Brukertekster som nevner "CamAPS Liberty" | **Ingen** | **7 tekster** (engelsk standard + norsk `nb`-split) |
| Funksjonsflagg-nøkler | Mangler | `camaps_liberty_ypso`, `camaps_liberty_dana` |
| Land/tilgjengelighets-gating | Mangler | `setFxFclFeatureCountryAllowed`, `setFxFclFeatureCountryPersisting` |
| Telemetrinøkkel for bruk | Mangler | `liberty_mode_usage` |

**App-tekster funnet i 192 (engelsk):**

| Teksttema | Oppsummering |
|--------------|---------|
| CamAPS Liberty-opplæring | Kort opplæring kreves før bruk |
| Slå på Liberty | Bekrefter at bruker er **13+** og **ikke gravid** |
| Liberty aktiv | Ingen måltidsbolus nødvendig mens Auto-modus er på |
| Liberty av | Påminnelse om å bolusere for måltider og snacks igjen |
| Liberty + Auto-modus | Liberty **fungerer bare når Auto-modus er på** |

**Norske tekster** følger også med (f.eks. `CamAPS Liberty-opplæring`, `CamAPS Liberty er aktiv`).

**Brukersynlig oppførsel (når aktivert og tilgjengelig):**

- Slå Liberty av/på fra **Innstillinger** (jf. [CamDiab Liberty](https://camdiab.com/liberty)).
- Mer proaktiv algoritme; ingen pre-meal-bolus eller karbohydrattelling under aktiv Liberty.
- Standard hybrid lukket sløyfe (manuelle boluser) er tilgjengelig når Liberty er av.

**Innebygd vs synlig i appen din:**

| Situasjon | Betydning |
|-----------|---------|
| Liberty-bryter synlig i Innstillinger | Funksjon aktivert for konto, pumpe og region |
| Ingen bryter synlig | Kode finnes i APK, men CamDiab har kanskje ikke sluppet den for ditt marked ennå |
| 189-APK | **Ingen Liberty i det hele tatt** |

CamDiabs nettside oppgir at utrulling **venter på lokale markedsgodkjenninger** for noen grupper (YpsoPump / Dana). 192-APK inneholder funksjonen; synlighet kan avhenge av server-flagg.

### 3. Wearable / Dexcom-klokke (ny infrastruktur)

| Punkt | 189 | 192 |
|------|-----|-----|
| Permission `com.google.android.gms.permission.WEARABLE_INTERNAL` | Nei | **Ja** |
| Intent filters `com.google.android.gms.wearable.DATA_CHANGED` / `CHANNEL_EVENT` | Nei | **Ja** |
| `WatchDataListener` service | Nei | **Ja** |

Dette er **Dexcom SDK-klokkekommunikasjon**, ikke en ferdig frittstående CamAPS Wear OS-app. Støtter G7/Dexcom-økosystemet; CamDiab lister fortsatt Wear OS CamAPS som fremtidig veikart.

### 4. Tilgang til varslingspolicy (ny tillatelse)

| Tillatelse | 189 | 192 |
|------------|-----|-----|
| `android.permission.ACCESS_NOTIFICATION_POLICY` | Nei | **Ja** |

Lar sannsynligvis appen bruke Ikke forstyrr / varslingspolicy for alarmer. Ingen brukervis etikett funnet; antatt for bedre alarmlevering på nyere Android.

---

## ENDRET i 192 (eksisterende områder)

### 5. Android OS-kompatibilitet og minimumsversjon

| Endring | Detalj |
|--------|--------|
| minSdk **31 → 33** | **Android 12 støttes ikke lenger** på 192. Krever Android 13+. |
| Regulatorisk kommunikasjon | Feltsikkerhetsmeldinger og [CamDiab notifications](https://camdiab.com/notifications) understreker **smarttelefon + OS-kompatibilitet** med CGM og pumpe. |
| Brukerrapporter | [Insulinclub.de](https://insulinclub.de/index.php?thread/37192-camaps-fx-update-x-195-ios-x-192-android/) users report 192 running on Android 15 without issues. |
| Din enhet | Uttrekk fra **OnePlus 11, Android 16** (CPH2449). |

CamDiab publiserer **ikke** en punktvis "Android 16 fixes"-liste for build 192. Oppdateringen beskrives best som **å holde appen i gang på gjeldende OS-versjoner**.

### 6. Sikkerhet / lisensiering

| Punkt | 189 | 192 |
|------|-----|-----|
| Play Integrity-klient | 1.3.0 | **1.6.0** |
| `com.pairip.licensecheck.LicenseContentProvider` | Finnes | **Fjernet** |
| `com.android.vending.CHECK_LICENSE` | Finnes | Finnes |

192 oppdaterer anti-tamper / Play-lisensintegrasjon. Ikke brukersynlig, men relevant for installasjonskilde-validering.

### 7. Appstørrelse og kodestruktur

| Måltall | 189 | 192 |
|--------|-----|-----|
| Total smali files | 16,094 | 24,992 (+55%) |
| DEX count | 3 | 4 |
| APK-størrelse | ~26 MB (XAPK total) | ~49 MB |

Vekst skyldes hovedsakelig **G7 SDK**, **CamAPS Liberty (FCL)**, oppdaterte avhengigheter og arm64/xxhdpi-ressurser (189 XAPK-pakken er også mindre/feil arkitektur).

### 8. Avhengigheter / biblioteker (endret, ikke nye produktfunksjoner)

Obfuskasjonspakke-omdøping (`b.*` → `a.*` for mange støttestubber) er **bygge-artefakt**, ikke brukerfunksjon.

Google Play Services-komponenter oppdatert (f.eks. `GoogleApiActivity` registrert i 192).

---

## UENDRET kjernefunksjoner (begge versjoner)

Dette finnes i **begge** 189 og 192:

| Funksjonsområde | Status |
|--------------|--------|
| Hybrid lukket sløyfe (Auto-modus av/på) | Samme produkt (standard HCL uendret) |
| CamAPS Liberty (fullt lukket sløyfe, valgfritt) | **Kun 192** (se avsnitt over) |
| Dexcom **G6** CGM support | Finnes in both |
| FreeStyle **Libre 3** (+ Plus-tekster i 192) | Finnes in both |
| YpsoPump / Dana pumpe-tilkobling | Samme app-familie |
| SMS-følgere (opptil 5) | Samme |
| CamAPS Companion fjernovervåking | Samme |
| Boluskalkulator, måltider, personlige glukosemål | Samme |
| Glooko / sky-opplasting | Samme |
| Kjernetillatelser (Bluetooth, posisjon, SMS, NFC, osv.) | Samme set, plus 192 additions above |

---

## Funksjoner IKKE funnet som nye i 192

Søkt, men **ikke** dokumentert som nye brukerfunksjoner i 192 vs 189:

| Rykte / sjekket | Resultat |
|-------------------|--------|
| Full CamAPS Wear OS-app | **Ikke i 192** (kun Dexcom-klokkelytter) |
| Health Connect-integrasjon | Kun bibliotekreferanser i 192 smali; **ingen Health Connect-tillatelse i manifest** |
| Nye pumpertyper | Ikke funnet |
| CamAPS Liberty (FCL) | **Finnes in 192**; absent in 189 (see section 2) |
| Generelle algoritme-/målendringer utenfor Liberty | Ikke dokumentert separat i offentlige kilder |
| Libre 3 Plus kun i 192 | Streng finnes i 192; Libre 3-familien var allerede i 189 |

---

## Offentlig endringslogg vs APK-analyse

| Kilde | Hva den sier om 189 → 192 |
|--------|------------------------------|
| [CamDiab notifications](https://camdiab.com/notifications) | Nye versjoner for **OS-kompatibilitet** og **cybersikkerhet**; versjoner under 1.4(190) utgår fra 31/03/2026 |
| [TGA market action](https://www.tga.gov.au/safety/recalls-and-other-market-actions/market-actions/mylife-camaps-fx-app) | Programvareoppdatering for **nyere smarttelefon-OS** |
| [Insulinclub.de](https://insulinclub.de/index.php?thread/37192-camaps-fx-update-x-195-ios-x-192-android/) | 192 rulles ut på Play; forskjøvet etter app-variant/region |
| [Pieter de Bruijn changelog](https://pieterdebruijn.nl/camaps-fx-development-and-changelog/) | **Ikke oppdatert** etter 2024; ingen 189/192-poster |
| [CamAPS Liberty](https://camdiab.com/liberty) | FCL innebygd i CamAPS FX; markedsutrulling **venter** for noen pumpe/region-kombinasjoner |
| **Denne APK-diffen** | **Dexcom G7** og **CamAPS Liberty** er de tydelige funksjonsnyhetene i 192 |

---

## Anbefalinger

| Mål | Bruk |
|------|-----|
| Kjøre på OnePlus 11 / Android 13+ | **Kun 192** |
| Bruke Dexcom G7-sensor | **Kun 192** |
| Bruke CamAPS Liberty (FCL, uten måltidsbolus) | **Kun 192** (hvis bryter vises for region/pumpe) |
| Beholde Play-signert sikkerhetskopi | **4 split-APK-er** fra telefonuttrekk |
| Referanse / ikke installer | Eldre **189** XAPK (feil CPU-arkitektur + eldre build) |

---

## CGM-feilkoder (Libre, G6, G7)

**Ja:** alle brukerrettede støttekoder og interne varslings-enums kan hentes fra dekompilert APK. CamAPS har **ikke** offentlig feilkodehåndbok; APK `strings.xml` og `HandleErrorMessage$NotificationCodes` smali er autoritative kilder.

### To lag med feilkoder

| Lag | Hva det er | Hvor du finner det |
|-------|------------|------------------|
| **Brukerrettede støttekoder** | Korte ID-er i varsler (f.eks. `LBR012`, `DDC045`, `DG7X023`) | `resources/package_1/res/values/strings.xml` |
| **Interne varslings-enums** | Utviklernavn (f.eks. `LS3_MSG_SIGNAL_LOSS`, `DX_MSG_PAIRING_FAILED`) | `HandleErrorMessage$NotificationCodes.smali` per CGM package |

Brukermeldinger for interne feil er mest generiske ("Intern feil XXXXX. Start smartenheten på nytt."). Koden er nyttig ved kontakt med CamDiab / mylife-støtte.

### Antall i 1.4(192).101

| CGM | Strengprefiks | Brukerrettede koder | Interne enum-konstanter | 189 vs 192 |
|-----|---------------|-------------------|-------------------------|------------|
| **FreeStyle Libre 3** | `LBR###` | **25** (`LBR001`–`LBR025`) | **44** (`LS3_*` in `uk.ac.cam.ap.libre.error`) | Samme in 189 |
| **Dexcom G6** | `DDC###` + `DCI###` | **81** + **82** = **163** | **59** (`DX_*` in `uk.ac.cam.ap.dexcom.error`) | Samme in 189 |
| **Dexcom G7** | `DG7X###` | **18** (`DG7X001`–`DG7X041`, non-contiguous) | **44** (`DX_*` in `com.camdiab.dexcomg7.alerts`) | **Kun 192** (0 in 189) |

**G7 brukerrettede koder (192):** DG7X001, DG7X002, DG7X003, DG7X023, DG7X024, DG7X025, DG7X026, DG7X027, DG7X028, DG7X029, DG7X030, DG7X031, DG7X032, DG7X033, DG7X034, DG7X037, DG7X038, DG7X041.

**Libre brukerrettede koder (begge builds):** LBR001 til LBR025.

**G6 brukerrettede koder (begge builds):** DDC001 til DDC081 and DCI001 til DCI082 (sekvensielle blokker). Samme meldingsmønster unntatt der det står annet under.

### Full liste: brukerrettede feilkoder (1.4(192).101)

Source: `to-do/CGM-ERROR-CODES-192.csv`. Libre and G6 codes are **identical in 189 and 192**. G7 codes are **Kun 192**.

#### FreeStyle Libre 3 (`LBR###`) — 25 codes, 189 og 192

| Kode | Melding (norsk) |
|------|-------------------|
| LBR001 | Intern feil LBR001. Start smartenheten på nytt. |
| LBR002 | Intern feil LBR002. Start smartenheten på nytt. |
| LBR003 | Intern feil LBR003. Start smartenheten på nytt. |
| LBR004 | Intern feil LBR004. Start smartenheten på nytt. |
| LBR005 | Intern feil LBR005. Start smartenheten på nytt. |
| LBR006 | Intern feil LBR006. Start smartenheten på nytt. |
| LBR007 | Intern feil LBR007. Start smartenheten på nytt. |
| LBR008 | Intern feil LBR008. Start smartenheten på nytt. |
| LBR009 | Intern feil LBR009. Start smartenheten på nytt. |
| LBR010 | Intern feil LBR010. Start smartenheten på nytt. |
| LBR011 | Intern feil LBR011. Start smartenheten på nytt. |
| LBR012 | Intern feil LBR012. Start smartenheten på nytt. |
| LBR013 | Intern feil LBR013. Start smartenheten på nytt. |
| LBR014 | Intern feil LBR014. Start smartenheten på nytt. |
| LBR015 | Intern feil LBR015. Start smartenheten på nytt. |
| LBR016 | Intern feil LBR016. Start smartenheten på nytt |
| LBR017 | Intern feil LBR017. Start smartenheten på nytt. |
| LBR018 | Intern feil LBR018. Start smartenheten på nytt. |
| LBR019 | Intern feil LBR019. Start smartenheten på nytt. |
| LBR020 | Intern feil LBR020. Start smartenheten på nytt. |
| LBR021 | Intern feil LBR021. Start smartenheten på nytt. |
| LBR022 | Intern feil LBR022. Start smartenheten på nytt. |
| LBR023 | Intern feil LBR023. Start smartenheten på nytt. |
| LBR024 | Intern feil LBR024. Start smartenheten på nytt. |
| LBR025 | Intern feil LBR025. Start smartenheten på nytt. |

Norsk locale (`nb`): `Intern feil LBRnnn. Start smartenheten på nytt.`

#### Dexcom G7 (`DG7X###`) — 18 codes, **Kun 192**

| Kode | Melding (norsk) |
|------|-------------------|
| DG7X001 | Intern feil DG7X001. Start smartenheten på nytt. |
| DG7X002 | Intern feil DG7X002. Start smartenheten på nytt. |
| DG7X003 | Intern feil DG7X003. Start smartenheten på nytt. |
| DG7X023 | Intern feil DG7X023. Start smartenheten på nytt. |
| DG7X024 | Intern feil DG7X024. Start smartenheten på nytt. |
| DG7X025 | Intern feil DG7X025. Start smartenheten på nytt. |
| DG7X026 | Intern feil DG7X026. Start smartenheten på nytt. |
| DG7X027 | Intern feil DG7X027. Start smartenheten på nytt |
| DG7X028 | Intern feil DG7X028. Start smartenheten på nytt. |
| DG7X029 | Intern feil DG7X029. Start smartenheten på nytt. |
| DG7X030 | Intern feil DG7X030. Start smartenheten på nytt. |
| DG7X031 | Intern feil DG7X031. Start smartenheten på nytt. |
| DG7X032 | Intern feil DG7X032. Start smartenheten på nytt. |
| DG7X033 | Intern feil DG7X033. Start smartenheten på nytt. |
| DG7X034 | Intern feil DG7X034. Start smartenheten på nytt. |
| DG7X037 | Intern feil DG7X037. Start smartenheten på nytt. |
| DG7X038 | Intern feil DG7X038. Start smartenheten på nytt. |
| DG7X041 | En feil DG7X041 har oppstått. Start appen på nytt eller start smartenheten på nytt. |

#### Dexcom G6 (`DDC###` + `DCI###`) — 163 codes, 189 og 192

Alle koder bruker: **Intern feil {kode}. Start smartenheten på nytt.**

**DDC-blokk (81 koder):** DDC001, DDC002, DDC003, DDC004, DDC005, DDC006, DDC007, DDC008, DDC009, DDC010, DDC011, DDC012, DDC013, DDC014, DDC015, DDC016, DDC017, DDC018, DDC019, DDC020, DDC021, DDC022, DDC023, DDC024, DDC025, DDC026, DDC027, DDC028, DDC029, DDC030, DDC031, DDC032, DDC033, DDC034, DDC035, DDC036, DDC037, DDC038, DDC039, DDC040, DDC041, DDC042, DDC043, DDC044, DDC045, DDC046, DDC047, DDC048, DDC049, DDC050, DDC051, DDC052, DDC053, DDC054, DDC055, DDC056, DDC057, DDC058, DDC059, DDC060, DDC061, DDC062, DDC063, DDC064, DDC065, DDC066, DDC067, DDC068, DDC069, DDC070, DDC071, DDC072, DDC073, DDC074, DDC075, DDC076, DDC077, DDC078, DDC079, DDC080, DDC081

**DCI-blokk (82 koder):** DCI001, DCI002, DCI003, DCI004, DCI005, DCI006, DCI007, DCI008, DCI009, DCI010, DCI011, DCI012, DCI013, DCI014, DCI015, DCI016, DCI017, DCI018, DCI019, DCI020, DCI021, DCI022, DCI023, DCI024, DCI025, DCI026, DCI027, DCI028, DCI029, DCI030, DCI031, DCI032, DCI033, DCI034, DCI035, DCI036, DCI037, DCI038, DCI039, DCI040, DCI041, DCI042, DCI043, DCI044, DCI045, DCI046, DCI047, DCI048, DCI049, DCI050, DCI051, DCI052, DCI053, DCI054, DCI055, DCI056, DCI057, DCI058, DCI059, DCI060, DCI061, DCI062, DCI063, DCI064, DCI065, DCI066, DCI067, DCI068, DCI069, DCI070, DCI071, DCI072, DCI073, DCI074, DCI075, DCI076, DCI077, DCI078, DCI079, DCI080, DCI081, DCI082

### Full liste: interne varslings-enums (1.4(192).101)

Source: `to-do/CGM-NOTIFICATION-ENUMS-192.csv`. Used in logs and developer mapping; not always shown to users. Libre and G6 enums are **identical in 189 and 192**. G7 enums are **Kun 192**.

#### Libre (`LS3_*`) — 44 konstanter

`LS3_DB_CONTEXT_NULL`, `LS3_DB_CREATION_FAIL`, `LS3_DB_DELETE_FAIL`, `LS3_DB_DEL_EXCEPTION`, `LS3_DB_DEL_EXCEPTION2`, `LS3_DB_DEL_EXCEPTION3`, `LS3_DB_GET_EXCEPTION1`, `LS3_DB_GET_EXCEPTION2`, `LS3_DB_INS_EXCEPTION`, `LS3_DB_INS_FAILED`, `LS3_DB_INTEGRITY_FAIL`, `LS3_DB_OPEN_EXCEPTION`, `LS3_HANDLER_STUCK`, `LS3_MSG_BAD_IDX_1`, `LS3_MSG_BAD_IDX_2`, `LS3_MSG_BAD_IDX_3`, `LS3_MSG_BAD_IDX_4`, `LS3_MSG_CRC_CALC`, `LS3_MSG_CRC_CHECK`, `LS3_MSG_CURR_SENSOR`, `LS3_MSG_EXC_MSG_ACK`, `LS3_MSG_EXC_SAVE_INFO`, `LS3_MSG_FALL_RATE`, `LS3_MSG_HIGH`, `LS3_MSG_LOW`, `LS3_MSG_NO_READINGS`, `LS3_MSG_RISE_RATE`, `LS3_MSG_SENSOR_2HOURS`, `LS3_MSG_SENSOR_30MINUTES`, `LS3_MSG_SENSOR_6HOURS`, `LS3_MSG_SENSOR_EXPIRED`, `LS3_MSG_SENSOR_FAILED`, `LS3_MSG_SENSOR_WARM_UP`, `LS3_MSG_SIGNAL_LOSS`, `LS3_MSG_START_SESS_ERR`, `LS3_MSG_TEMP_HIGH`, `LS3_MSG_TEMP_LOW`, `LS3_MSG_UNKNOWN_ERROR`, `LS3_MSG_URGENT_LOW`, `LS3_MSG_URGENT_LOW_SOON`, `LS3_MSG_VITAMIN_C`, `LS3_MSG_WAKELOCK_ERROR`, `LS3_MSG_WRONG_PIN`, `LS3_TOO_BIG_GAP`

#### Dexcom G6 (`DX_*`) — 59 konstanter

`DX_DB_CIPHER`, `DX_DB_CONTEXT_NULL`, `DX_DB_CREATION_FAIL`, `DX_DB_DELETE_FAIL`, `DX_DB_DEL_EXCEPTION`, `DX_DB_DEL_EXCEPTION2`, `DX_DB_DEL_EXCEPTION3`, `DX_DB_GET_EXCEPTION1`, `DX_DB_GET_EXCEPTION2`, `DX_DB_INS_EXCEPTION`, `DX_DB_INS_FAILED`, `DX_DB_INTEGRITY_FAIL`, `DX_DB_OPEN_EXCEPTION`, `DX_END_OF_LIFE`, `DX_MSG_1ST_CALIB`, `DX_MSG_2ND_CALIB`, `DX_MSG_CALIB_ERR`, `DX_MSG_CRC_CALC`, `DX_MSG_CRC_CHECK`, `DX_MSG_CYCLE_BLUETOOTH`, `DX_MSG_END_SESS_ERR`, `DX_MSG_EXCEPTION`, `DX_MSG_EXC_MSG_ACK`, `DX_MSG_FALL_RATE`, `DX_MSG_GATT_ERROR_NOTI`, `DX_MSG_HIGH`, `DX_MSG_INVALID_BG`, `DX_MSG_LOW`, `DX_MSG_NEXT_CALIB`, `DX_MSG_NEXT_NEW_CALIB`, `DX_MSG_NO_READINGS`, `DX_MSG_PAIRED`, `DX_MSG_PAIRING`, `DX_MSG_PAIRING_FAILED`, `DX_MSG_PLANNED_CALIB`, `DX_MSG_RESTART_APP`, `DX_MSG_RISE_RATE`, `DX_MSG_SCAN_STUCK`, `DX_MSG_SENSOR_2HOURS`, `DX_MSG_SENSOR_30MINUTES`, `DX_MSG_SENSOR_6HOURS`, `DX_MSG_SENSOR_EXPIRED`, `DX_MSG_SENSOR_FAILED`, `DX_MSG_SENSOR_RESTART`, `DX_MSG_SENSOR_WARM_UP`, `DX_MSG_SIGNAL_LOSS`, `DX_MSG_SN_NAME_WRONG`, `DX_MSG_START_SESS_ERR`, `DX_MSG_TRANS_14DAYS`, `DX_MSG_TRANS_22DAYS`, `DX_MSG_TRANS_FAILED`, `DX_MSG_TRANS_LAST_END`, `DX_MSG_TRANS_LAST_START`, `DX_MSG_TRANS_LOW_BATTERY`, `DX_MSG_TRANS_TAKEN`, `DX_MSG_UNKNOWN_ERROR`, `DX_MSG_URGENT_LOW`, `DX_MSG_URGENT_LOW_SOON`, `DX_MSG_WAKELOCK_ERROR`

#### Dexcom G7 (`DX_*`, egen pakke) — 44 konstanter, **Kun 192**

`DX_DB_CONTEXT_NULL`, `DX_DB_CREATION_FAIL`, `DX_DB_DELETE_FAIL`, `DX_DB_DEL_EXCEPTION`, `DX_DB_DEL_EXCEPTION2`, `DX_DB_DEL_EXCEPTION3`, `DX_DB_GET_EXCEPTION1`, `DX_DB_GET_EXCEPTION2`, `DX_DB_INS_EXCEPTION`, `DX_DB_INS_FAILED`, `DX_DB_INTEGRITY_FAIL`, `DX_DB_OPEN_EXCEPTION`, `DX_INVALID_TEST_CODE`, `DX_MSG_BAD_CALIBRATION`, `DX_MSG_CRC_CALC`, `DX_MSG_CRC_CHECK`, `DX_MSG_EXC_MSG_ACK`, `DX_MSG_FALL_RATE`, `DX_MSG_HIGH`, `DX_MSG_LOW`, `DX_MSG_OUT_OF_RANGE`, `DX_MSG_PAIRED`, `DX_MSG_PAIRING`, `DX_MSG_PAIRING_FAILED`, `DX_MSG_RESTART_APP`, `DX_MSG_RISE_RATE`, `DX_MSG_SENSOR_24_HOURS`, `DX_MSG_SENSOR_2HOURS`, `DX_MSG_SENSOR_FAILED`, `DX_MSG_SENSOR_GRACE`, `DX_MSG_SENSOR_NO_GRACE`, `DX_MSG_SIGNAL_LOSS`, `DX_MSG_SIV_FAIL`, `DX_MSG_STOPPED`, `DX_MSG_TEMP_PROBLEM`, `DX_MSG_TRANS_FAILED`, `DX_MSG_UNKNOWN_ERROR`, `DX_MSG_URGENT_LOW`, `DX_MSG_URGENT_LOW_SOON`, `DX_MSG_WARMUP`, `DX_NO_DEXCOM_CERT`, `DX_NO_DISK_SPACE`, `DX_NO_FACTORY_TIME`, `DX_NO_ROOT_CERT`

### Smali-stier (192-dekompilering)

| CGM | NotificationCodes enum file |
|-----|----------------------------|
| Libre 3 | `smali/classes4/uk/ac/cam/ap/libre/error/HandleErrorMessage$NotificationCodes.smali` |
| Dexcom G6 | `smali/classes/uk/ac/cam/ap/dexcom/error/HandleErrorMessage$NotificationCodes.smali` |
| Dexcom G7 | `smali/classes3/com/camdiab/dexcomg7/alerts/HandleErrorMessage$NotificationCodes.smali` |

Eksempel interne Libre-koder: `LS3_MSG_SENSOR_EXPIRED`, `LS3_MSG_WRONG_PIN`, `LS3_MSG_VITAMIN_C`, `LS3_MSG_SIGNAL_LOSS`.

Eksempel interne G6-koder: `DX_MSG_1ST_CALIB`, `DX_MSG_TRANS_LOW_BATTERY`, `DX_MSG_PAIRING_FAILED`, `DX_END_OF_LIFE`.

Eksempel interne G7-koder: `DX_MSG_BAD_CALIBRATION`, `DX_MSG_SENSOR_GRACE`, `DX_MSG_WARMUP`, `DX_INVALID_TEST_CODE`.

G6 og G7 deler `DX_`-prefiks i enums men ligger i **ulike pakker**; G7-enums er ikke et superset av G6.

### Slik trekker du ut (repeterbart)

1. Dekomplier build 192:
   ```powershell
   java -jar backups\camaps-fx\tools\APKEditor.jar d -i <path-to-192.apk> -o $env:TEMP\camaps-deep\192
   ```
2. Kjør uttrekksskriptet:
   ```powershell
   .\backups\camaps-fx\tools\extract-cgm-error-codes.ps1 -DecompileRoot $env:TEMP\camaps-deep\192
   ```
3. Eller grep `strings.xml` manuelt:
   ```powershell
   Select-String -Path "$env:TEMP\camaps-deep\192\resources\package_1\res\values\strings.xml" -Pattern '\b(DG7X|DDC|DCI|LBR)\d{3}\b'
   ```

### Eksporterte lister (denne undersøkelsen)

| Fil | Innhold |
|------|----------|
| `to-do/CGM-ERROR-CODES-192.csv` | 206 brukerrettede kode + meldingsrader |
| `to-do/CGM-NOTIFICATION-ENUMS-192.csv` | 147 interne enum-navn |
| `APK-COMPARISON-189-vs-192-REPORT.nb.md` | Norsk versjon av denne rapporten (samme struktur) |
| `APK-COMPARISON-189-vs-192-REPORT.html` | HTML-eksport av denne rapporten |
| `APK-COMPARISON-189-vs-192-REPORT.nb.html` | HTML-eksport av norsk rapport |
| `index.html` | Lenker til begge HTML-rapporter |
| `tools/extract-cgm-error-codes.ps1` | Regenererer begge CSV-er fra et dekompilerings-tre |

### Begrensninger

- Kodene er **CamAPS-interne** referanse-ID-er, ikke Dexcom- eller Abbott-offentlige feilkoder.
- De fleste brukerstrenger forklarer ikke rotårsak; støtte bruker koden til å slå opp logger.
- Norsk (`nb`) og andre locale-splitter kan overstyre meldingstekst; kodene er like.
- Kun runtime-feil (uten strengressurs) vises ikke i `strings.xml`; enum smali er reserve-liste.

### Abbott Libre numeriske koder (2024 fellesliste) vs CamAPS-koder

Din august 2024-liste bruker **Abbott LibreLink / sensorfeil-tall** (f.eks. 57, 335, 373, 380, 4000-serien, 410–725). CamAPS bruker **et annet skjema** og har **ikke** disse Abbott-tallene i `strings.xml`.

| System | Eksempelkoder | Hvor sett | I CamAPS 189/192 APK? |
|--------|---------------|------------|--------------------------|
| **Abbott Libre-app / NFC-skanning** | 373, 365, 335, 57, 380 | LibreLink, skannefeil, sensorfeil | **Nei** (ikke i strings) |
| **CamAPS støtte-referanse** | `LBR001`–`LBR025` | "Intern feil LBR012. Start smartenheten på nytt." | **Yes** (25 koder, **uendret** 189→192) |
| **CamAPS Libre driver-enums** | `LS3_MSG_SIGNAL_LOSS`, `LS3_MSG_SENSOR_EXPIRED`, … | Utvikler / logg-mapping | **Yes** (44 enums, **uendret** 189→192) |

**Praktisk mapping (konseptuell, ikke 1:1 i APK):**

| Din 2024 Abbott-kode | Typisk betydning | CamAPS-tilsvarende (ca.) |
|-----------------------|-----------------|----------------------------|
| 57 (Libre 3) | Ny sensor / starter opp | `LS3_MSG_SENSOR_WARM_UP`, warmup UI strings |
| 335 (Libre 2 scan) | Skanning feilet, prøv igjen | NFC scan help strings; `LS3_MSG_START_SESS_ERR` |
| 338 | Sensor starter, ikke klar | Warmup / 30 min messages (`LS3_MSG_SENSOR_30MINUTES`) |
| 365 | Sensor fungerer ikke, bytt | `LS3_MSG_SENSOR_FAILED` |
| 366 | Sjekk feste / start på nytt | Sensor failed / contact distributor strings |
| 373 (+ P/E/F/I variants) | Glukose utilgjengelig / rat endring | `LS3_MSG_NO_READINGS`, `LS3_MSG_RISE_RATE`, `LS3_MSG_FALL_RATE` |
| 380 | Måleproblemer | `LS3_MSG_UNKNOWN_ERROR` or internal `LBR###` |
| 4000-series (4005, 4010, …) | Generelle feil (fellesskap rapportert) | **Ikke listet** i CamAPS; kan internt mappes til `LBR###` |
| 410–725 block | Fellesskapets "generelle" beskrivelser | **Ikke i APK** som numeriske koder; behandles som uoffisielle med mindre Abbott dokumenterer dem |

**Fortsatt gjeldende for CamAPS (192):** bruk **`LBR###` + `LS3_*`** fra denne rapporten og `CGM-ERROR-CODES-192.csv`, ikke 2024 Abbott-nummerlisten, når du kontakter CamDiab / mylife om CamAPS. Behold Abbott-listen for **kun LibreLink** eller **rå NFC**-feilsøking.

**Uendret 189→192:** Libre brukerrettet (`LBR###`) og intern (`LS3_*`) er identiske. **Nytt i 192:** kun **G7**-koder (`DG7X###`, 18 brukerrettede).

---

## Companion, Glooko og tredjepartsdeling (xDrip+ / Nightscout)

### Kort svar

| Spørsmål | Svar |
|----------|--------|
| Nye Companion-felt i 192 for xDrip+ / Nightscout? | **No.** No `nightscout`, `xdrip`, or glucose broadcast intents in either APK. |
| Kan Companion mate xDrip+ eller Nightscout direkte? | **Nei.** Companion er **kun E2E-kryptert CamAPS-til-CamAPS**. |
| Hva endret seg for deling i 192? | **No new export API.** Samme share menu; **new data types** may appear inside existing channels when you use **G7** or **Liberty**. |

### Official sharing channels (189 og 192)

| Kanal | Retning | Data (jf. app-tekster / GDPR) | xDrip+ / Nightscout-sti |
|---------|-----------|-----------------------------------|---------------------------|
| **CamAPS Companion** | Pasienttelefon → Companions CamAPS-app (E2E) | Sensorglukose, insulindata, valgfri trendgraf; pumpe/CGM **kun visning** på Companion | **Ingen built-in.** Companion cannot re-share or control devices. |
| **Glooko / Glooko XT** | Opplasting til tilknyttet Glooko-bruker | Terapi + enhetsopplasting (cloud DTO-er) | **Indirekte:** fellesskap Glooko → Nightscout-broer (utenfor CamAPS). |
| **mylife Cloud** | Opplasting til Ypsomed sky-konto | Samme DTO family as Glooko path | **Indirekte:** proprietært; ingen NS/xDrip-strenger i APK. |
| **Dexcom Follow** | Til Dexcom Follow-app følgere | CGM-data, varsler, valgfri trendgraf (**G6/G7**) | **Separat fra Companion.** xDrip+ kan bruke Dexcom Share/Follow som egen kilde, ikke fra CamAPS Companion. |
| **SMS Followers** | SMS-varsler (opptil 5) | Kun varselmeldinger | Ikke en glukosestrøm for Nightscout. |

Companion og SMS-følgere er **gjensidig utelukkende** (som før).

### Hva Companion deler (uendret GDPR-tekst 189 vs 192)

GDPR-avsnittet **Usage and Linkage Data** er **byte-identisk** i 189 og 192:

- Pumpe- og senderserienummer
- Pumpe, sensor og **lukket-/åpen-sløyfe-handlingslogg**
- App-kommando-flytlogg
- Hendelseslogg
- Følger-/portal-kontoinfo som lagt inn i appen
- Støttehenvendelser, trenerdetaljer

Companion-invitasjonstekst (192): del **sensorglukose og insulindata** med valgfri **trendgraf**. Companion-modus: **ingen** vidaredeling, **ingen** pumpe/CGM-styring.

### Cloud DTO-felt (Glooko / mylife-opplasting): diff 189 vs 192

Sammenlignet `com.camdiab.fx_alert.cloud.mylife.data.dto.*` mellom builds:

| DTO / enum | 189 | 192 | Nye felt for NS? |
|------------|-----|-----|-------------------|
| `CGMReadingDTO` public fields | 15 fields (Egv, Rate, PredictedEgv, …) | **Samme 15** | Nei |
| `TherapyEventDTO$RecordType` | Bolus, Carbs, AutoMode, BasalRate, … | **Samme set** | Ingen `Liberty`-recordtype |
| `DeviceUploadDTO` public fields | device settings, basal programs, … | **Samme set** | Nei |
| `BaseDTO$CGMType` | DEXCOM_G6, DEXCOM_G7, LIBRE_3, LIBRE_3_PLUS | **Samme** (G7 enum existed in 189 DTO only) | G7 **live** i 192 |

Det finnes **ingen nye JSON/DTO-egenskaper** i 192 som xDrip+ eller Nightscout kan bruke uten egen bro.

### Hva som er *nytt i praksis* for følgere (kun 192)

Dette er ikke nye Companion-**innstillinger**, men nytt **innhold** Companion eller sky-opplasting kan bære når pasienten bruker 192-funksjoner:

| Funksjon | Synlig for Companion? | Synlig via Glooko/mylife? | Merknad |
|---------|----------------------|----------------------------|-------|
| **Dexcom G7** CGM readings | Ja (samme glukose/insulin-UI) | Yes (`DEXCOM_G7` CGM type) | G7-stack er **kun 192**; DTO enum fantes allerede i 189. |
| **CamAPS Liberty** (FCL) | Sannsynligvis **indirekte** (annet sløyfe/bolusmønster) | Ukjent; telemetrinøkkel `liberty_mode_usage` i 192 | Ingen `Liberty`-streng i cloud DTO-er; ingen dedikert Companion-bryter i strings. |
| **Libre 3 Plus** | Ja hvis den CGM-en er valgt | Yes (`LIBRE_3_PLUS`) | Allerede i 189 strings/DTO. |
| **G7 error codes** (`DG7X###`) | Kun hvis vist på pasientenhet | Usannsynlig i opplastinger | 18 koder, kun 192. |

### Anbefalte stier til Nightscout / xDrip+ (utenfor CamAPS)

| Oppsett | Typisk tilnærming |
|-------|------------------|
| Libre 3 on CamAPS | xDrip+ **Juggluco / Libre broadcast** eller **OOP** på egen enhet; CamAPS Companion **erstatter ikke** dette. |
| Dexcom G6/G7 on CamAPS | **Dexcom Follow** eller Share på følgertelefon → xDrip+ follower-modus; parallelt med CamAPS, ikke via Companion. |
| Full therapy + pump data to NS | **Glooko-opplasting** fra CamAPS → tredjeparts Glooko-synk (fellesskap); verifiser at broen støtter gjeldende CamAPS/Glooko XT. |
| Companion phone only | Installer CamAPS som Companion; data blir i CamAPS. Reverse engineering av E2E-kanal **støttes ikke** av appen. |

**Konklusjon:** 192 legger til **G7** og **Liberty** som terapifunksjoner, men **ingen ny åpen eksport** for xDrip+ eller Nightscout. For åpne integrasjoner, bruk **Glooko**, **Dexcom Follow** eller **parallell CGM-sti** (Juggluco/xDrip+), ikke CamAPS Companion.

---

## Undersøkelsesartefakter

- Dekompilerte trær: `%TEMP%\camaps-deep\189-base`, `%TEMP%\camaps-deep\192`
- CGM error exports: `to-do/CGM-ERROR-CODES-192.csv`, `to-do/CGM-NOTIFICATION-ENUMS-192.csv`
- Norsk rapport: `to-do/APK-COMPARISON-189-vs-192-REPORT.nb.md`
- Uttrekksskript: `tools/extract-cgm-error-codes.ps1`
- Tools: APKEditor 1.4.5, platform-tools adb 37.0.0
- Opprinnelig plan: `camaps_apk_comparison_7491c498.plan.md`
