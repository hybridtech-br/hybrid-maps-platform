# HYBRID Maps Platform

> **DOCUMENTATION FREEZE — ACTIVE (2026-08-10)**  
> Development, automated software-test implementation, production CI/CD, homologation and deployment are blocked until explicit project-owner authorization. The technical content below describes the existing platform baseline and historical planned milestones; it does not authorize implementation. See `docs/PROJECT_STATUS.md` and `docs/DOCUMENTATION_INDEX.md` for the current gate.

Plataforma geoespacial oficial da HYBRID, independente de provedores e reutilizável por todo o ecossistema.

## Objetivos

- API única para MapLibre, OpenStreetMap, Google Maps, HERE e futuros provedores.
- Arquitetura modular baseada em microkernel e capacidades.
- SDKs reutilizáveis e serviços geoespaciais independentes.
- Testes, documentação, Docker, CI/CD e versionamento semântico.

## Pacotes atuais

- `@hybrid/maps-core`: domínio geoespacial, coordenadas, bounding boxes, viewport, CRS, projeções e geometrias.
- `@hybrid/maps-runtime`: microkernel, ciclo de vida, eventos, serviços, módulos e capacidades.
- `@hybrid/maps-provider-sdk`: contratos, adapters, capacidades e registro lazy de providers.
- `@hybrid/maps-provider-maplibre`: provider MapLibre encapsulado para renderização, câmera, layers, markers, popups e controles.

## Runtime microkernel

O pacote `@hybrid/maps-runtime` orquestra módulos por um ciclo de vida determinístico e permite descoberta de capacidades sem expor APIs específicas de provedores.

```ts
import { HmpKernel } from "@hybrid/maps-runtime";

const kernel = new HmpKernel({ provider: "auto", locale: "pt-BR" });
kernel.register(mapLibreModule);
await kernel.start();

if (kernel.hasCapability("rendering")) {
  // O consumidor pode criar o mapa sem conhecer o provider.
}
```

## Primeiro mapa com MapLibre

```ts
import { Viewport } from "@hybrid/maps-core";
import { ProviderRegistry } from "@hybrid/maps-provider-sdk";
import { createMapLibreProvider } from "@hybrid/maps-provider-maplibre";

const providers = new ProviderRegistry();
providers.register("maplibre", () => createMapLibreProvider());

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

## Consumidores previstos

- HYBRID Starlink Tracker
- HYBRID Monitor
- HYBRID Home Assistant
- Micael Security
- futuros produtos HYBRID

## Marcos históricos planejados

Os itens abaixo permanecem como referência histórica e serão revalidados no PRD/roadmap antes de qualquer retomada do desenvolvimento:

1. Playground web com mapa do Rio de Janeiro.
2. Eventos normalizados do provider para o EventBus do runtime.
3. API pública `HybridMaps`.
4. Pacote React.
5. Integração inicial com o HYBRID Starlink Tracker.

## Status técnico anterior ao freeze

Versão registrada: `0.5.0-alpha.0` — provider MapLibre associado ao marco histórico **HMP-0001 — First Running Map**.

## Status oficial atual

Fase: documentação.  
Gate: Documentation Freeze.  
Desenvolvimento: bloqueado.  
Próxima atividade permitida: completar a documentação de produto e arquitetura e executar o Development Readiness Gate.
