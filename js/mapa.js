/* COPLA · mapa de retiro y delivery
   Las zonas se editan en js/config.js (entregas). */
(function () {
  "use strict";

  const CONFIG = window.COPLA_CONFIG || {};
  const entregas = CONFIG.entregas || {};
  const retiro = (entregas.zonas || []).filter((z) => z && isFinite(z.lat) && isFinite(z.lng));
  const delivery = entregas.delivery && entregas.delivery.activo ? entregas.delivery : null;

  const COLORES = { azul: "#084C73", naranja: "#ED6335", verde: "#8DB5AC", crema: "#FCF4E2" };

  const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Leyenda debajo del mapa
  const leyenda = document.querySelector("[data-zonas-leyenda]");
  if (leyenda) {
    const items = retiro.map((z) => `
      <li class="leyenda-item">
        <span class="leyenda-marca leyenda-retiro" aria-hidden="true"></span>
        <div><p class="leyenda-titulo">${escapar(z.nombre.charAt(0).toUpperCase() + z.nombre.slice(1))}</p>
        <p class="leyenda-texto">Retiro y entrega gratis, ${escapar(entregas.zonaGratis || "en la zona marcada")}.</p></div>
      </li>`);
    if (delivery) {
      items.push(`
      <li class="leyenda-item">
        <span class="leyenda-marca leyenda-delivery" aria-hidden="true">🛵</span>
        <div><p class="leyenda-titulo">Delivery</p>
        <p class="leyenda-texto">${escapar(delivery.texto || "")}</p></div>
      </li>`);
    }
    leyenda.innerHTML = items.join("");
  }

  const contenedor = document.getElementById("mapa");
  if (!contenedor) return;

  if (!window.L || !retiro.length) {
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

  retiro.forEach((z) => {
    const circulo = L.circle([z.lat, z.lng], {
      radius: Number(z.radio) || 450,
      color: COLORES.naranja, weight: 3,
      fillColor: COLORES.naranja, fillOpacity: 0.35,
    }).addTo(mapa);
    circulo.bindTooltip(escapar(z.nombre.charAt(0).toUpperCase() + z.nombre.slice(1)), { permanent: true, direction: "center", className: "mapa-etiqueta" });
    limites.extend(L.latLng(z.lat, z.lng).toBounds((Number(z.radio) || 450) * 2));
  });

  mapa.fitBounds(limites, { padding: [24, 24] });

  // Si el mapa estaba oculto o cambió el tamaño, recalcula.
  window.addEventListener("resize", () => mapa.invalidateSize());
})();
