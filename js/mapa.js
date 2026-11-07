/* COPLA · mapa de retiro y delivery
   Las zonas se editan en js/config.js (entregas). */
(function () {
  "use strict";

  const CONFIG = window.COPLA_CONFIG || {};
  const entregas = CONFIG.entregas || {};
  const retiro = (entregas.retiro || []).filter((z) => z && isFinite(z.lat) && isFinite(z.lng));
  const delivery = entregas.delivery && entregas.delivery.activo ? entregas.delivery : null;

  const COLORES = { azul: "#084C73", naranja: "#ED6335", verde: "#8DB5AC", crema: "#FCF4E2" };

  const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Leyenda debajo del mapa
  const leyenda = document.querySelector("[data-zonas-leyenda]");
  if (leyenda) {
    const items = retiro.map((z) => `
      <li class="leyenda-item">
        <span class="leyenda-marca leyenda-retiro" aria-hidden="true"></span>
        <div><p class="leyenda-titulo">Retiro · ${escapar(z.nombre)}</p>
        <p class="leyenda-texto">Coordinamos día y horario por WhatsApp.</p></div>
      </li>`);
    if (delivery) {
      items.push(`
      <li class="leyenda-item">
        <span class="leyenda-marca leyenda-delivery" aria-hidden="true"></span>
        <div><p class="leyenda-titulo">Delivery</p>
        <p class="leyenda-texto">${escapar(delivery.texto || "")}</p></div>
      </li>`);
    }
    leyenda.innerHTML = items.join("");
  }

  const contenedor = document.getElementById("mapa");
  if (!contenedor) return;

  if (!window.L || (!retiro.length && !delivery)) {
    contenedor.innerHTML = '<p class="mapa-cargando">No pudimos cargar el mapa. Escribinos y te contamos dónde estamos.</p>';
    return;
  }
  contenedor.innerHTML = "";

  const mapa = L.map(contenedor, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    subdomains: "abcd",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(mapa);

  // Límites calculados a mano: L.circle necesita una vista previa para medir.
  const limites = L.latLngBounds([]);

  if (delivery && delivery.centro) {
    const zonaDelivery = L.circle([delivery.centro.lat, delivery.centro.lng], {
      radius: (Number(delivery.radioKm) || 3) * 1000,
      color: COLORES.azul, weight: 2, dashArray: "6 8",
      fillColor: COLORES.verde, fillOpacity: 0.28,
    }).addTo(mapa);
    zonaDelivery.bindTooltip("Zona de delivery", { direction: "top", className: "mapa-etiqueta mapa-etiqueta-delivery" });
    limites.extend(L.latLng(delivery.centro.lat, delivery.centro.lng).toBounds((Number(delivery.radioKm) || 3) * 2000));
  }

  retiro.forEach((z) => {
    const circulo = L.circle([z.lat, z.lng], {
      radius: Number(z.radio) || 450,
      color: COLORES.naranja, weight: 3,
      fillColor: COLORES.naranja, fillOpacity: 0.35,
    }).addTo(mapa);
    circulo.bindTooltip(`Retiro · ${escapar(z.nombre)}`, { permanent: true, direction: "center", className: "mapa-etiqueta" });
    limites.extend(L.latLng(z.lat, z.lng).toBounds((Number(z.radio) || 450) * 2));
  });

  mapa.fitBounds(limites, { padding: [24, 24] });

  // Si el mapa estaba oculto o cambió el tamaño, recalcula.
  window.addEventListener("resize", () => mapa.invalidateSize());
})();
