# HYBRID Maps Platform

Plataforma geoespacial oficial da HYBRID, independente de provedores e reutilizável por todo o ecossistema.

## Objetivos

- API única para MapLibre, OpenStreetMap, Google Maps, HERE e futuros provedores.
- Arquitetura modular baseada em microkernel e capacidades.
- SDKs reutilizáveis e serviços geoespaciais independentes.
- Testes, documentação, Docker, CI/CD e versionamento semântico.

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

## Consumidores previstos

- HYBRID Starlink Tracker
- HYBRID Monitor
- HYBRID Home Assistant
- Micael Security
- futuros produtos HYBRID

## Status

Versão atual: `0.5.0-alpha.0` — fundação do microkernel em desenvolvimento.
