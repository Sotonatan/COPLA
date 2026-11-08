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
    const intro = `<li class="leyenda-intro">Tenemos ${retiro.length === 2 ? "dos puntos" : retiro.length + " puntos"} de entrega${delivery ? " y delivery" : ""}.</li>`;
    const items = retiro.map((z) => `
      <li class="leyenda-item">
        <span class="leyenda-marca leyenda-retiro" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s7-6.6 7-12.2A7 7 0 0 0 5 9.8C5 15.4 12 22 12 22Z" fill="currentColor"/><circle cx="12" cy="9.8" r="2.6" fill="#FFFCF7"/></svg></span>
        <div><p class="leyenda-titulo">${escapar(z.nombre.charAt(0).toUpperCase() + z.nombre.slice(1))}</p>
        <p class="leyenda-texto">Retiro y entrega gratis a ${escapar(entregas.zonaGratis || "la redonda")}.</p></div>
      </li>`);
    if (delivery) {
      items.push(`
      <li class="leyenda-item">
        <span class="leyenda-marca leyenda-delivery" aria-hidden="true"><svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17" r="2.8"/><circle cx="18.5" cy="17" r="2.8"/><path d="M8.3 17h6.2l2.2-6.5H20"/><path d="M14.5 17 12 10.5H8.5"/><path d="M3 10.5h5.5V7H5"/><path d="M15.5 6h2.2l1.2 4.5"/></g></svg></span>
        <div><p class="leyenda-titulo">Delivery</p>
        <p class="leyenda-texto">${escapar(delivery.texto || "")}</p></div>
      </li>`);
    }
    leyenda.innerHTML = intro + items.join("");
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
      fillColor: COLORES.naranja, fillOpacity: 0.18,
    }).addTo(mapa);
    const pin = L.divIcon({
      className: "mapa-pin",
      html: '<svg viewBox="0 0 24 32" width="34" height="44"><path d="M12 31s10-9.4 10-17.5A10 10 0 0 0 2 13.5C2 21.6 12 31 12 31Z" fill="#ED6335" stroke="#084C73" stroke-width="1.6"/><circle cx="12" cy="13" r="4" fill="#FFFCF7"/></svg>',
      iconSize: [34, 44],
      iconAnchor: [17, 43],
      tooltipAnchor: [0, -40],
    });
    L.marker([z.lat, z.lng], { icon: pin, keyboard: false })
      .addTo(mapa)
      .bindTooltip(escapar(z.nombre.charAt(0).toUpperCase() + z.nombre.slice(1)), { permanent: true, direction: "top", className: "mapa-etiqueta" });
    limites.extend(L.latLng(z.lat, z.lng).toBounds((Number(z.radio) || 450) * 2));
  });

  mapa.fitBounds(limites, { padding: [24, 24] });

  // Si el mapa estaba oculto o cambió el tamaño, recalcula.
  window.addEventListener("resize", () => mapa.invalidateSize());
})();
