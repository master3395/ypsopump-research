# Changelog

All notable changes to this fork are documented here. Upstream history before the fork is preserved in git history from [SandraK82/ypsopump-research](https://github.com/SandraK82/ypsopump-research).

## [2.0.1] - 17/06/2026

### Added

- **What's new in v2 summary** ([docs/00](docs/00-whats-new-in-v2.md), [Norwegian](docs/00-whats-new-in-v2.nb.md)): easy-to-read overview of all fork changes

## [2.0.0] - 17/06/2026

### Added

- **CamAPS FX 189 vs 192 APK comparison** ([docs/20](docs/20-camaps-apk-189-vs-192.md), [Norwegian](docs/20-camaps-apk-189-vs-192.nb.md)): Dexcom G7, CamAPS Liberty FCL, minSdk 33, Play Integrity 1.6
- **Liberty availability guide** ([docs/21](docs/21-camaps-liberty-availability.md)): server-side gating, Norway rollout notes
- **CGM error code reference** ([docs/22](docs/22-cgm-error-codes-reference.md)) and CSV data in [data/](data/)
- **GitHub Pages site** in [site/](site/) with shared styling and navigation
- **Build tooling** in [tools/](tools/) (`npm run build-site`)
- [ATTRIBUTION.md](ATTRIBUTION.md) crediting upstream

### Changed

- **README.md**: redesigned landing page with architecture overview, v2 highlights, grouped doc index
- Cross-links in docs 06, 09, 11, 13 pointing to new CamAPS build analysis

### Unchanged from upstream

- Docs 01–19, guides, `aaps-driver/`, `ypsopump-test/` (content preserved; light cross-links only)
- MIT License

## [1.0.0] - upstream (SandraK82)

Initial release: YpsoPump reverse engineering documentation and AAPS driver scaffold. See [upstream commits](https://github.com/SandraK82/ypsopump-research/commits/main).
