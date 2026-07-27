import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";
import { Coordinate, Viewport } from "@hybrid/maps-core";
import { createMapLibreProvider } from "@hybrid/maps-provider-maplibre";
import { PROVIDER_CAPABILITIES, ProviderRegistry } from "@hybrid/maps-provider-sdk";

const RIO_CENTER = new Coordinate(-43.1729, -22.9068);
const HYBRID_STYLE = "https://demotiles.maplibre.org/style.json";

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("Playground root element #app was not found.");

app.innerHTML = `
  <main class="shell">
    <header class="topbar">
      <div>
        <span class="eyebrow">HYBRID Tecnologia Inteligente</span>
        <h1>Maps Platform Playground</h1>
      </div>
      <div class="provider-badge"><span></span> MapLibre ativo</div>
    </header>
    <section class="workspace">
      <aside class="panel">
        <div class="panel-section">
          <label for="provider">Provider</label>
          <select id="provider" disabled><option>MapLibre GL JS</option></select>
        </div>
        <div class="panel-section">
          <h2>Capacidades</h2>
          <ul id="capabilities" class="capabilities"></ul>
        </div>
        <div class="panel-section actions">
          <h2>Controles</h2>
          <button id="focus-rio" type="button">Centralizar no Rio</button>
          <button id="open-popup" type="button" class="secondary">Abrir identificação</button>
        </div>
      </aside>
      <div class="map-stage">
        <div id="map" aria-label="Mapa interativo do Rio de Janeiro"></div>
        <div class="map-caption">HMP-0001 · First Running Map</div>
      </div>
      <aside class="console-panel">
        <div class="console-heading">
          <h2>Event Console</h2>
          <button id="clear-console" type="button" class="text-button">Limpar</button>
        </div>
        <ol id="event-console" class="event-console"></ol>
      </aside>
    </section>
  </main>
`;

const eventConsole = document.querySelector<HTMLOListElement>("#event-console");
const capabilities = document.querySelector<HTMLUListElement>("#capabilities");
if (!eventConsole || !capabilities) throw new Error("Playground UI could not be initialized.");

function logEvent(message: string): void {
  const item = document.createElement("li");
  const time = document.createElement("time");
  time.textContent = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
  const description = document.createElement("span");
  description.textContent = message;
  item.append(time, description);
  eventConsole.prepend(item);
}

const registry = new ProviderRegistry();
registry.register("maplibre", () => createMapLibreProvider());
logEvent("Provider registrado");

const provider = await registry.resolve("maplibre");
logEvent("Provider inicializado");

for (const capability of PROVIDER_CAPABILITIES) {
  const enabled = provider.metadata.capabilities[capability];
  const item = document.createElement("li");
  item.className = enabled ? "enabled" : "disabled";
  item.innerHTML = `<span>${enabled ? "✓" : "–"}</span><strong>${capability}</strong>`;
  capabilities.append(item);
}

const map = await provider.createMap({
  container: "map",
  viewport: new Viewport({ center: RIO_CENTER, zoom: 10.5, pitch: 20 }),
  style: { id: "hybrid-light", url: HYBRID_STYLE },
});
logEvent("Mapa criado no Rio de Janeiro");

const markerElement = document.createElement("button");
markerElement.className = "hybrid-marker";
markerElement.type = "button";
markerElement.title = "HYBRID Tecnologia Inteligente";
markerElement.setAttribute("aria-label", "Abrir identificação da HYBRID");

await map.markers.add({
  id: "hybrid-rio",
  coordinate: RIO_CENTER,
  element: markerElement,
});
logEvent("Marcador HYBRID adicionado");

async function openHybridPopup(): Promise<void> {
  const popup = document.createElement("article");
  popup.className = "hybrid-popup";
  popup.innerHTML = `<strong>HYBRID Maps Platform</strong><span>Runtime cartográfico independente de provider.</span>`;
  await map.popups.open({
    id: "hybrid-identification",
    coordinate: RIO_CENTER,
    content: popup,
    closeButton: true,
  });
  logEvent("Popup institucional aberto");
}

markerElement.addEventListener("click", () => void openHybridPopup());
document.querySelector("#open-popup")?.addEventListener("click", () => void openHybridPopup());
document.querySelector("#focus-rio")?.addEventListener("click", () => {
  void map.camera.flyTo(new Viewport({ center: RIO_CENTER, zoom: 12, pitch: 30 }));
  logEvent("Câmera centralizada no Rio de Janeiro");
});
document.querySelector("#clear-console")?.addEventListener("click", () => {
  eventConsole.replaceChildren();
  logEvent("Console limpo");
});

window.addEventListener("resize", () => map.resize());
window.addEventListener("beforeunload", () => void provider.dispose());
