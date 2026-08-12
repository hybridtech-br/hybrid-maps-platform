# Changelog

Todas as mudanças relevantes deste projeto serão registradas aqui.

## [1.0.0] - 2026-08-12

### Added

- HYBRID Geometry Kernel (HGK) com primitivas matemáticas, geometrias 2D, validação estrutural e algoritmos planares.
- Spatial Engine com coordenadas/bounds geográficos, validação geográfica e adapters para HGK.
- Maps Core provider-neutral com compatibilidade pública preservada.
- Provider SDK e provider MapLibre para o baseline V1.
- Playground de referência com cenário do Rio de Janeiro e identidade visual oficial do HYBRID Maps Platform.
- Gates de CI para qualidade HGK, compatibilidade de API, build/test do repositório e validação estrutural.
- Migration Guide, documentação de segurança/privacidade, matriz MapLibre e checklist de release.

### Fixed

- `GeometryFactory.point()` passou a preservar corretamente o contrato de criação de pontos.
- Compatibilidade das mensagens públicas de validação do Maps Core durante a delegação ao Spatial Engine.
- Tipagens estritas em centroides e na fronteira GeoJSON/MapLibre.
- Testes do Runtime alinhados aos contratos atuais.
- Inicialização do Playground removida de top-level await para compatibilidade com o target de produção.

### Compatibility

- Nenhuma API pública legada do Maps Core foi removida na V1.0.0.
- Tipos internos do HGK não vazam para os contratos provider-neutral.
- HGK permanece sem dependências de Maps Core, Spatial Engine, providers, DOM ou APIs de navegador.

### Known limitations

- `GeographicBounds` simples não representa bounds que cruzam o antimeridiano.
- Geocoding, routing/navigation e offline maps permanecem pós-V1.
- O Playground de referência usa `demotiles.maplibre.org` para demonstração; a escolha de tiles/style de produção é uma decisão de implantação separada.

## [Unreleased]

Sem alterações ainda.
