# HYBRID Maps Platform — Installation & Development Guide

Status: V1.0
Date: 2026-08-14

## Requirements

- Node.js 22
- pnpm 9.15.0
- Git

## Linux / macOS

```bash
git clone https://github.com/hybridtech-br/hybrid-maps-platform.git
cd hybrid-maps-platform
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install --frozen-lockfile
pnpm build
pnpm test
```

## Windows PowerShell

```powershell
git clone https://github.com/hybridtech-br/hybrid-maps-platform.git
cd hybrid-maps-platform
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install --frozen-lockfile
pnpm build
pnpm test
```

## Playground

```bash
pnpm --filter @hybrid/maps-playground dev
```

Use the local URL printed by Vite. The reference scenario starts in Rio de Janeiro.

## Useful checks

```bash
pnpm build
pnpm test
pnpm --filter @hybrid/hgk test
pnpm --filter @hybrid/maps-spatial-engine test
pnpm --filter @hybrid/maps-core test
pnpm --filter @hybrid/maps-runtime test
```

## Troubleshooting

If dependency resolution differs from CI, confirm Node 22 and pnpm 9.15.0 and reinstall from the committed lockfile. Do not regenerate the lockfile casually. If the Playground map does not render, check network access to the configured development style/tile endpoint. Provider/data service availability is separate from HGK/Spatial Engine correctness.

## Production note

The repository source release does not select a commercial tile/style service. A consuming deployment must choose and document provider credentials, attribution, quotas, caching, CSP, observability and rollback before production rollout.
