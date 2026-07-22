export type ThemeCategory = "light" | "dark" | "satellite" | "terrain" | "custom";

export interface ThemeStyleReference {
  readonly url?: string;
  readonly mapId?: string;
  readonly data?: Readonly<Record<string, unknown>>;
}

export interface ThemeDefinition {
  readonly id: string;
  readonly name: string;
  readonly category: ThemeCategory;
  readonly description?: string;
  readonly providers: Readonly<Record<string, ThemeStyleReference | undefined>>;
}

export interface ResolvedTheme {
  readonly theme: ThemeDefinition;
  readonly providerId: string;
  readonly style: ThemeStyleReference;
}

export type ThemeChangeListener = (theme: ThemeDefinition) => void;

export class ThemeManagerError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ThemeManagerError";
  }
}

function validateTheme(theme: ThemeDefinition): void {
  if (!theme.id.trim()) throw new ThemeManagerError("Theme id must not be empty.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(theme.id)) {
    throw new ThemeManagerError("Theme id must use lowercase kebab-case.");
  }
  if (!theme.name.trim()) throw new ThemeManagerError("Theme name must not be empty.");
  if (Object.keys(theme.providers).length === 0) {
    throw new ThemeManagerError(`Theme ${theme.id} must define at least one provider style.`);
  }
}

export class ThemeManager {
  readonly #themes = new Map<string, ThemeDefinition>();
  readonly #listeners = new Set<ThemeChangeListener>();
  #currentThemeId?: string;

  public constructor(themes: readonly ThemeDefinition[] = [], initialThemeId?: string) {
    for (const theme of themes) this.register(theme);
    if (initialThemeId) this.set(initialThemeId);
  }

  public register(theme: ThemeDefinition): void {
    validateTheme(theme);
    if (this.#themes.has(theme.id)) {
      throw new ThemeManagerError(`Theme ${theme.id} is already registered.`);
    }
    this.#themes.set(theme.id, Object.freeze({ ...theme, providers: Object.freeze({ ...theme.providers }) }));
  }

  public has(id: string): boolean {
    return this.#themes.has(id);
  }

  public list(): readonly ThemeDefinition[] {
    return Object.freeze([...this.#themes.values()]);
  }

  public current(): ThemeDefinition | undefined {
    return this.#currentThemeId ? this.#themes.get(this.#currentThemeId) : undefined;
  }

  public set(id: string): ThemeDefinition {
    const theme = this.#themes.get(id);
    if (!theme) throw new ThemeManagerError(`Theme ${id} is not registered.`);
    if (this.#currentThemeId === id) return theme;
    this.#currentThemeId = id;
    for (const listener of this.#listeners) listener(theme);
    return theme;
  }

  public resolve(themeId: string, providerId: string): ResolvedTheme {
    const theme = this.#themes.get(themeId);
    if (!theme) throw new ThemeManagerError(`Theme ${themeId} is not registered.`);
    const style = theme.providers[providerId];
    if (!style) {
      throw new ThemeManagerError(`Theme ${themeId} does not support provider ${providerId}.`);
    }
    return Object.freeze({ theme, providerId, style });
  }

  public subscribe(listener: ThemeChangeListener): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }
}

export const DEFAULT_THEMES: readonly ThemeDefinition[] = Object.freeze([
  {
    id: "hybrid-light",
    name: "HYBRID Light",
    category: "light",
    description: "Tema institucional claro da HYBRID.",
    providers: {
      maplibre: { url: "https://demotiles.maplibre.org/style.json" },
    },
  },
  {
    id: "hybrid-dark",
    name: "HYBRID Dark",
    category: "dark",
    description: "Tema institucional escuro da HYBRID.",
    providers: {
      maplibre: { url: "https://tiles.openfreemap.org/styles/dark" },
    },
  },
  {
    id: "openstreetmap",
    name: "OpenStreetMap",
    category: "light",
    providers: {
      maplibre: { url: "https://tiles.openfreemap.org/styles/liberty" },
    },
  },
  {
    id: "satellite",
    name: "Satellite",
    category: "satellite",
    providers: {
      maplibre: { data: { type: "satellite-placeholder" } },
    },
  },
  {
    id: "terrain",
    name: "Terrain",
    category: "terrain",
    providers: {
      maplibre: { data: { type: "terrain-placeholder" } },
    },
  },
]);

export function createDefaultThemeManager(initialThemeId = "hybrid-light"): ThemeManager {
  return new ThemeManager(DEFAULT_THEMES, initialThemeId);
}
