# HYBRID Maps Platform — Documentação V1.0

A documentação oficial da V1.0 está consolidada em `MAPS_PLATFORM_BOOK.md` e indexada em `DOCUMENTATION_INDEX.md`.

## Comece por aqui

1. `MAPS_PLATFORM_BOOK.md` — visão consolidada do produto.
2. `DOCUMENTATION_INDEX.md` — fonte oficial de verdade e mapa de documentos.
3. `product/MAPS_PLATFORM_PRD.md` — requisitos e escopo de produto.
4. `architecture/HGK_ARCHITECTURE_BOOK.md` — arquitetura do kernel e separação de camadas.
5. `api/API_INTEGRATION_ARCHITECTURE.md` — integração dos consumidores e providers.
6. `security/THREAT_MODEL.md` e `security/PRIVACY_LGPD.md` — segurança e privacidade.
7. `ux/VISUAL_IDENTITY_UX_UI.md` — identidade visual oficial do Maps Platform.
8. `guides/INSTALLATION_DEVELOPMENT.md` — instalação e desenvolvimento.
9. `release/V1_RELEASE_CHECKLIST.md` — gate de release.

## Estrutura

- `product/` — PRD, requisitos, riscos e roadmap.
- `architecture/` — arquitetura, dependências, dados, infraestrutura e migração.
- `api/` — APIs e arquitetura de integração.
- `testing/` — caracterização, compatibilidade, validação numérica, datasets e CI.
- `security/` — fronteiras, threat model e LGPD.
- `providers/` — MapLibre e dependências externas.
- `ux/` — identidade visual e acessibilidade.
- `operations/` — observabilidade, operação, recuperação e rollback.
- `guides/` — instalação e migração.
- `adr/` — decisões arquiteturais.
- `release/` — readiness, checklist e release notes.

A V1.0 é uma source/engineering release. Produção de um consumidor específico exige documentação adicional do deployment real: tiles/style, CSP, observabilidade, credenciais, licenciamento e rollback daquele ambiente.
