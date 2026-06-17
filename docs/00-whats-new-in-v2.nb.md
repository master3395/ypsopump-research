# Hva er nytt i v2 (master3395-fork)

> **Start her** hvis du kjenner [SandraK82/ypsopump-research](https://github.com/SandraK82/ypsopump-research) og vil ha en kort oversikt over hva denne fork-en legger til.  
> Sist oppdatert: 17/06/2026 | [English summary](00-whats-new-in-v2.md)

---

## Én setning

Denne fork-en beholder **alt originalt YpsoPump-arbeid** og legger til **ny CamAPS FX-dokumentasjon** for Android-build **189 vs 192**, inkludert Dexcom G7, CamAPS Liberty, CGM-feilkoder og et nettsted du kan bla i.

---

## Fork vs upstream

| | [SandraK82 (upstream)](https://github.com/SandraK82/ypsopump-research) | [master3395 (denne fork-en)](https://github.com/master3395/ypsopump-research) |
|---|--------|-------------|
| **Fokus** | YpsoPump BLE, ProRegia backend, mylife-app, AAPS-driver | Samme, **pluss** nyere CamAPS APK-analyse |
| **CamAPS-versjon** | v1.4(190).111 | v1.4(189).101 vs v1.4(192).101 (mmol/L) |
| **Antall dokumenter** | 01–19 + 3 guider | 01–22 + 3 guider |
| **Nettsted** | Kun README på GitHub | README + [GitHub Pages](../site/index.html) |
| **Lisens** | MIT | MIT (med [ATTRIBUTION.md](../ATTRIBUTION.md)) |

Ingenting er fjernet fra upstream. Vi har bare **lagt til** filer og **lette krysslenker** i noen eksisterende dokumenter.

---

## Nye funksjoner på ett blikk (CamAPS build 192)

| Funksjon | Build 189 | Build 192 | Hvorfor det betyr noe |
|---------|-----------|-----------|----------------|
| **Dexcom G7 CGM** | Nei | **Ja** | Full G7-innlogging, paring og feilkoder i appen |
| **CamAPS Liberty (FCL)** | Nei | **Ja** (kode i APK) | Fullt lukket sløyfe uten måltidsbolus; kan være skjult til landet ditt er åpnet |
| **Minimum Android** | Android 12+ (SDK 31) | **Android 13+** (SDK 33) | Eldre telefoner kan ikke kjøre 192 |
| **Play Integrity-bibliotek** | 1.3.0 | **1.6.0** | Kan påvirke root-oppsett (se dokument 13) |
| **Libre 3 / G6 hybrid sløyfe** | Ja | Ja | Uendret kjerneprodukt |
| **Nightscout / xDrip+ i appen** | Nei | Nei | Fortsatt ikke innebygd; bruk Glooko eller parallelle broer |

---

## Nye dokumenter (les disse først)

### [20 — CamAPS APK 189 vs 192](20-camaps-apk-189-vs-192.nb.md)

**Hovedrapporten.** Sammenligner to ekte APK-er:

- Hva som er helt nytt i 192 (G7, Liberty, tillatelser)
- Hva som endret seg uten å være en «funksjon» (minSdk, Play Integrity, appstørrelse)
- Hva som er likt (G6, Libre 3, Companion, Glooko)
- Fullstendige CGM-feilkodetabeller

Også på [engelsk](20-camaps-apk-189-vs-192.md).

### [21 — CamAPS Liberty-tilgjengelighet](21-camaps-liberty-availability.md)

Svar på det praktiske spørsmålet: **«Liberty finnes i APK-en min, men jeg ser ikke bryteren.»**

- Liberty styres av **serverflagg**, ikke bare av at du har build 192
- Norge kan ha strenger i appen uten at funksjonen er fullt utrullet
- Hva du kan gjøre legitimt mens du venter (ingen omgåelsestricks)

### [22 — CGM-feilkoder](22-cgm-error-codes-reference.md)

Rask oversikt over støttekoder som vises **i CamAPS**:

- `LBR###` = Libre 3
- `DCI###` / `DDC###` = Dexcom G6
- `DG7X###` = Dexcom G7 (**kun 192**)

**Ikke** det samme som numeriske koder i Abbott LibreLink (373, 410, osv.).

Last ned fullstendige lister: [cgm-error-codes-192.csv](../data/cgm-error-codes-192.csv), [cgm-notification-enums-192.csv](../data/cgm-notification-enums-192.csv).

---

## Ny infrastruktur (ikke om pumpen i seg selv)

| Tillegg | Hva det gjør |
|----------|----------------|
| **[site/](../site/)** | Stilisert HTML-dokumentasjon for GitHub Pages |
| **[tools/build-site.mjs](../tools/build-site.mjs)** | Bygg nettstedet fra Markdown (`npm run build-site`) |
| **[CHANGELOG.md](../CHANGELOG.md)** | Versjonshistorikk for denne fork-en |
| **[ATTRIBUTION.md](../ATTRIBUTION.md)** | Krediterer upstream-forfatter |

---

## Små oppdateringer i eksisterende upstream-dokumenter

Kun **korte notater og lenker** (ingen omskrivinger):

| Dokument | Hva vi la til |
|-----|----------------|
| [06 — Algoritme](06-closed-loop-algorithm.md) | Peker til APK-sammenligning og Liberty-dokument |
| [09 — Bypass](09-bypass-options.md) | Skiller pumpenøkkel-bypass fra Liberty server-gating |
| [11 — CamAPS-algoritme](11-camaps-algorithm-analysis.md) | Dyp analyse er build 190; se dokument 20 for 192 |
| [13 — Play Integrity](13-play-integrity-bypass-success.md) | Play Integrity **1.6** i build 192 |

---

## Vanlige spørsmål (korte svar)

| Spørsmål | Kort svar | Les mer |
|----------|--------------|-----------|
| Bør jeg oppdatere fra 189 til 192? | Ja hvis du vil ha G7 eller Liberty (når aktivert) og har Android 13+ | [Dok. 20](20-camaps-apk-189-vs-192.nb.md) |
| Er Liberty tilgjengelig i Norge? | Kode finnes i 192; utrulling skjer marked for marked | [Dok. 21](21-camaps-liberty-availability.md) |
| Feilen sier `LBR012`, hva er det? | CamAPS Libre-støttekode, ikke LibreLink 373 | [Dok. 22](22-cgm-error-codes-reference.md) |
| Endret pumpe-BLE-forskningen seg? | Ingen nye pumpprotokoll-dokumenter i v2 | Dok. [01–04](01-hardware.md) |
| Hvor er AAPS-driveren? | Uendret pågående arbeid fra upstream | [aaps-driver/](../aaps-driver/) |

---

## Hva endret seg **ikke**

- YpsoPump maskinvare, BLE-kommandoer, kryptering og nøkkelutveksling (01–04)
- mylife-app-analyse (14–19)
- Frida / bypass-forskningskontekst (09, guider)
- **Ingen APK-filer, dekompilert kode eller exploit-skript** i dette repoet

---

## Anbefalt leserrekkefølge

1. **Denne siden** (du er her)
2. [20 — APK 189 vs 192](20-camaps-apk-189-vs-192.nb.md) hvis du bruker eller planlegger build 192
3. [21 — Liberty](21-camaps-liberty-availability.md) hvis du vil ha fullt lukket sløyfe uten karbohydrattelling
4. [22 — Feilkoder](22-cgm-error-codes-reference.md) når du får CGM-varsel med bokstavkode
5. Upstream [01 — Maskinvare](01-hardware.md) hvis du bryr deg om åpen kilde pumpedrivere

---

## Kreditter

Original forskning: [SandraK82/ypsopump-research](https://github.com/SandraK82/ypsopump-research).  
v2 CamAPS APK-arbeid og nettsted: [master3395/ypsopump-research](https://github.com/master3395/ypsopump-research).
