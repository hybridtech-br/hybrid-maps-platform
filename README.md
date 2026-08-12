# HYBRID Maps Platform

**Version 1.0.0 — source/engineering release**

Plataforma geoespacial oficial da HYBRID Tecnologia Inteligente, provider-neutral e reutilizável pelos produtos do ecossistema HYBRID.

## V1.0

A V1.0 consolida a arquitetura em camadas:

- `@hybrid/hgk` — kernel matemático e geométrico 2D, sem semântica terrestre, provider, DOM ou browser;
- `@hybrid/maps-spatial-engine` — coordenadas e bounds geográficos, validação, medições geográficas e adapters para HGK;
- `@hybrid/maps-core` — contratos estáveis de mapas, `Coordinate`, `BoundingBox`, `Viewport`, projeções e geometrias provider-neutral;
- `@hybrid/maps-runtime` — microkernel, ciclo de vida, eventos, serviços, módulos e capacidades;
- `@hybrid/maps-provider-sdk` — contratos, capacidades e registro lazy de providers;
- `@hybrid/maps-provider-maplibre` — provider MapLibre para renderização, câmera, layers, markers, popups e controles;
- `@hybrid/maps-feature-store`, `@hybrid/maps-events` e `@hybrid/maps-theme-manager` — infraestrutura complementar da plataforma;
- `apps/playground` — referência executável da V1 com cenário do Rio de Janeiro e identidade visual oficial HYBRID Maps Platform.

## Princípios

- Provider neutrality: consumidores usam contratos HMP, não objetos concretos do MapLibre.
- Separação de domínio: HGK é planar; Spatial Engine concentra semântica geográfica.
- Compatibilidade: a migração para HGK não remove APIs públicas legadas do Maps Core.
- Privacidade por minimização: a V1 não cria datastore próprio de histórico de localização.
- Reprodutibilidade: `pnpm-lock.yaml` é versionado e os principais gates usam instalação `--frozen-lockfile`.

## Requisitos de desenvolvimento

- Node.js 22
- pnpm 9.15.0

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm test
```

## Primeiro mapa com MapLibre

```ts
import { Viewport } from "@hybrid/maps-core";
import { ProviderRegistry } from "@hybrid/maps-provider-sdk";

const providers = new ProviderRegistry();
providers.register("maplibre", async () => {
  const { createMapLibreProvider } = await import("@hybrid/maps-provider-maplibre");
  return createMapLibreProvider();
});

const provider = await providers.resolve("maplibre");
const map = await provider.createMap({
  container: "map",
  viewport: new Viewport({
    center: [-43.1729, -22.9068],
    zoom: 12,
  }),
});
```

A aplicação consumidora não recebe nem precisa conhecer `MapLibre.Map`.

## Playground

```bash
pnpm --filter @hybrid/maps-playground dev
```

O cenário de referência usa o Rio de Janeiro e MapLibre. O style `demotiles.maplibre.org` é utilizado somente para demonstração/desenvolvimento; a escolha de tiles/style de produção pertence ao deployment de cada consumidor e não faz parte do source release V1.0.

## Escopo V1

Incluído:

- mapa provider-neutral;
- MapLibre como provider inicial;
- viewport/câmera;
- layers;
- markers;
- popups;
- controls;
- capacidades do provider;
- HGK e Spatial Engine;
- APIs TypeScript e fixtures de compatibilidade;
- CI de qualidade e limites arquiteturais;
- documentação de migração, segurança e provider.

Pós-V1:

- geocoding/reverse geocoding;
- routing/navigation;
- offline map packs;
- providers adicionais de produção;
- backend geoespacial hospedado pela HMP.

## Consumidores de referência

O HYBRID Starlink Tracker é o primeiro consumidor de integração planejado. HYBRID Monitor, HYBRID Home Assistant, Micael Security e outros produtos podem consumir a plataforma preservando os limites de autenticação, dados e infraestrutura definidos por cada produto.

## Compatibilidade e migração

Consulte:

- `docs/guides/HGK_MIGRATION_GUIDE.md`
- `docs/api/HGK_API.md`
- `docs/api/MAPS_CORE_WAVE4_API_REVIEW.md`
- `docs/security/SECURITY_PRIVACY_BOUNDARIES.md`
- `docs/providers/MAPLIBRE_V1_MATRIX.md`
- `docs/release/V1_RELEASE_CHECKLIST.md`

## Estado da release

As Waves 0–5 da migração HGK foram concluídas com gates de build, testes e compatibilidade. A V1.0 é a primeira release estável do código-fonte/SDK. Deployments em produção, contratação de serviços de tiles e integração em repositórios externos são etapas de rollout separadas e não alteram a condição desta source release.
