/* COPLA · tienda y carrito
   Los datos se editan en js/config.js y js/productos.js. */
(function () {
  "use strict";

  const CONFIG = window.COPLA_CONFIG || {};
  const PRODUCTOS = window.COPLA_PRODUCTOS || [];
  const CLAVE_CARRITO = "copla-carrito-v1";

  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));

  const formatoNumero = new Intl.NumberFormat(CONFIG.locale || "es-AR", { maximumFractionDigits: 2 });
  const tienePrecio = (p) => typeof p === "number" && isFinite(p) && p > 0;
  const precioTexto = (p) => tienePrecio(p) ? `${CONFIG.moneda || "$"} ${formatoNumero.format(p)}` : (CONFIG.textoSinPrecio || "A confirmar");

  const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Carrito: estado ---------- */
  let carrito = cargarCarrito();

  function cargarCarrito() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "[]");
      return Array.isArray(datos) ? datos.filter(buscarItem) : [];
    } catch (e) {
      return [];
    }
  }

  function guardarCarrito() {
    try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ }
  }

  // Devuelve producto y opción actuales (el precio siempre sale del catálogo).
  function buscarItem(item) {
    const producto = PRODUCTOS.find((p) => p.id === item.id);
    if (!producto) return null;
    const opcion = producto.opciones[item.opcion];
    if (!opcion) return null;
    return { producto, opcion };
  }

  function agregar(id, opcion, sabor, cantidad) {
    const existente = carrito.find((i) => i.id === id && i.opcion === opcion && (i.sabor || "") === (sabor || ""));
    if (existente) existente.cantidad += cantidad;
    else carrito.push({ id, opcion, sabor: sabor || "", cantidad });
    guardarCarrito();
    pintarCarrito();
  }

  function calcularTotales() {
    let total = 0, unidades = 0, faltanPrecios = false;
    carrito.forEach((item) => {
      const info = buscarItem(item);
      if (!info) return;
      unidades += item.cantidad;
      if (tienePrecio(info.opcion.precio)) total += info.opcion.precio * item.cantidad;
      else faltanPrecios = true;
    });
    return { total, unidades, faltanPrecios };
  }

  /* ---------- Tienda ---------- */
  function pintarTienda() {
    const grilla = $("#grilla-productos");
    grilla.innerHTML = PRODUCTOS.map((p) => {
      const imagen = p.foto
        ? `<img class="tarjeta-foto" src="${escapar(p.foto)}" alt="${escapar(p.nombre)}" loading="lazy">`
        : `<img class="tarjeta-copo" src="${escapar(p.copo || "img/copo/copo-saludo.png")}" alt="Copo con ${escapar(p.nombre.toLowerCase())}" loading="lazy">`;
      const opciones = p.opciones.length > 1
        ? `<div class="opciones" role="radiogroup" aria-label="Presentación">${p.opciones.map((o, i) =>
            `<button type="button" class="opcion${i === 0 ? " activa" : ""}" role="radio" aria-checked="${i === 0}" data-opcion="${i}">${escapar(o.nombre)}</button>`).join("")}</div>`
        : `<p class="opcion-unica">${escapar(p.opciones[0].nombre)}</p>`;
      const meta = metaArmar(p, 0);
      const sabores = !(p.sabores && p.sabores.length) ? ""
        : meta
          ? `<div class="armar" data-armar="${meta}">
              <p class="armar-titulo"><span data-armar-titulo>Elegí tus ${meta} gustos</span> <span class="armar-cuenta" data-armar-cuenta>0 de ${meta}</span></p>
              ${p.sabores.map((s, i) => `
                <div class="armar-fila">
                  <span>${escapar(s)}</span>
                  <div class="cantidad cantidad-chica">
                    <button type="button" data-armar-menos="${i}" aria-label="Una menos de ${escapar(s)}">−</button>
                    <output data-armar-cant="${i}">0</output>
                    <button type="button" data-armar-mas="${i}" aria-label="Una más de ${escapar(s)}">+</button>
                  </div>
                </div>`).join("")}
            </div>`
          : `<label class="sabor">Sabor <select data-sabor>${p.sabores.map((s) => `<option>${escapar(s)}</option>`).join("")}</select></label>`;
      return `
        <article class="tarjeta color-${escapar(p.color || "naranja")}" data-producto="${escapar(p.id)}">
          ${p.etiqueta ? `<span class="tarjeta-etiqueta">${escapar(p.etiqueta)}</span>` : ""}
          <h3>${escapar(p.nombre)}</h3>
          <div class="tarjeta-imagen${p.foto ? " con-foto" : ""}">${imagen}</div>
          <p class="tarjeta-desc">${escapar(p.descripcion || "")}</p>
          ${p.conservacion ? `<details class="tarjeta-conservacion"><summary>Cómo conservarlos</summary><p>${escapar(p.conservacion)}</p></details>` : ""}
          ${opciones}
          ${sabores}
          <div class="tarjeta-acciones">
            <div class="cantidad" aria-label="Cantidad">
              <button type="button" data-menos aria-label="Restar uno">−</button>
              <output data-cantidad>1</output>
              <button type="button" data-mas aria-label="Sumar uno">+</button>
            </div>
            <button type="button" class="boton boton-azul boton-agregar" data-agregar>
              Agregar · <span data-precio></span>
            </button>
          </div>
        </article>`;
    }).join("");

    $$(".tarjeta", grilla).forEach(actualizarTarjeta);

    grilla.addEventListener("click", (e) => {
      const tarjeta = e.target.closest(".tarjeta");
      if (!tarjeta) return;
      const salida = $("[data-cantidad]", tarjeta);
      let cant = parseInt(salida.textContent, 10) || 1;

      const botonOpcion = e.target.closest("[data-opcion]");
      const armarMas = e.target.closest("[data-armar-mas]");
      const armarMenos = e.target.closest("[data-armar-menos]");
      if (armarMas || armarMenos) {
        const i = (armarMas || armarMenos).dataset[armarMas ? "armarMas" : "armarMenos"];
        const celda = $(`[data-armar-cant="${i}"]`, tarjeta);
        const n = parseInt(celda.textContent, 10) || 0;
        const { total, meta } = armado(tarjeta);
        if (armarMas && total < meta) celda.textContent = n + 1;
        if (armarMenos && n > 0) celda.textContent = n - 1;
      } else if (botonOpcion) {
        $$(".opcion", tarjeta).forEach((b) => { b.classList.remove("activa"); b.setAttribute("aria-checked", "false"); });
        botonOpcion.classList.add("activa");
        botonOpcion.setAttribute("aria-checked", "true");
        const caja = $("[data-armar]", tarjeta);
        if (caja) {
          const producto = PRODUCTOS.find((p) => p.id === tarjeta.dataset.producto);
          const meta = metaArmar(producto, opcionElegida(tarjeta));
          caja.dataset.armar = meta;
          $("[data-armar-titulo]", caja).textContent = `Elegí tus ${meta} gustos`;
          if (armado(tarjeta).total > meta) $$("[data-armar-cant]", caja).forEach((o) => (o.textContent = "0"));
        }
      } else if (e.target.closest("[data-mas]")) {
        cant = Math.min(cant + 1, 99);
      } else if (e.target.closest("[data-menos]")) {
        cant = Math.max(cant - 1, 1);
      } else if (e.target.closest("[data-agregar]")) {
        const producto = PRODUCTOS.find((p) => p.id === tarjeta.dataset.producto);
        const opcion = opcionElegida(tarjeta);
        const mezcla = armado(tarjeta);
        if (mezcla.meta && mezcla.total !== mezcla.meta) {
          avisar(`Te faltan ${mezcla.meta - mezcla.total} para completar`);
          return;
        }
        const sabor = mezcla.meta ? mezcla.texto : ($("[data-sabor]", tarjeta)?.value || "");
        agregar(producto.id, opcion, sabor, cant);
        $$("[data-armar-cant]", tarjeta).forEach((o) => (o.textContent = "0"));
        cant = 1;
        avisar(`Sumaste ${producto.nombre} al carrito`);
        const boton = e.target.closest("[data-agregar]");
        boton.classList.add("agregado");
        setTimeout(() => boton.classList.remove("agregado"), 600);
      }
      salida.textContent = cant;
      actualizarTarjeta(tarjeta);
    });
  }

  function pintarProximamente() {
    const lista = window.COPLA_PROXIMAMENTE || [];
    const seccion = $("[data-proximamente-seccion]");
    if (!lista.length) { seccion.hidden = true; return; }
    $("[data-proximamente]").innerHTML = lista.map((p) => `
      <article class="tarjeta tarjeta-pronto color-${escapar(p.color || "azul")}">
        <span class="tarjeta-etiqueta">Pronto</span>
        <h3>${escapar(p.nombre)}</h3>
        <div class="tarjeta-imagen con-foto">${p.foto ? `<img class="tarjeta-foto" src="${escapar(p.foto)}" alt="${escapar(p.nombre)}" loading="lazy">` : ""}</div>
        <p class="tarjeta-desc">${escapar(p.descripcion || "")}</p>
      </article>`).join("");
  }

  // Cuántas unidades se arman: la de la presentación elegida o la del producto.
  function metaArmar(producto, i) {
    const opcion = producto.opciones[i] || {};
    return opcion.armar || producto.armar || 0;
  }

  // Cuántas eligió de cada gusto en los productos para armar (ej. media docena).
  function armado(tarjeta) {
    const caja = $("[data-armar]", tarjeta);
    if (!caja) return { meta: 0, total: 0, texto: "" };
    const producto = PRODUCTOS.find((p) => p.id === tarjeta.dataset.producto);
    const partes = [];
    let total = 0;
    $$("[data-armar-cant]", caja).forEach((o) => {
      const n = parseInt(o.textContent, 10) || 0;
      total += n;
      if (n) partes.push(`${n} ${producto.sabores[o.dataset.armarCant]}`);
    });
    return { meta: parseInt(caja.dataset.armar, 10), total, texto: partes.join(", ") };
  }

  function opcionElegida(tarjeta) {
    const activa = $(".opcion.activa", tarjeta);
    return activa ? parseInt(activa.dataset.opcion, 10) : 0;
  }

  function actualizarTarjeta(tarjeta) {
    const producto = PRODUCTOS.find((p) => p.id === tarjeta.dataset.producto);
    const opcion = producto.opciones[opcionElegida(tarjeta)];
    const cant = parseInt($("[data-cantidad]", tarjeta).textContent, 10) || 1;
    $("[data-precio]", tarjeta).textContent = tienePrecio(opcion.precio) ? precioTexto(opcion.precio * cant) : precioTexto(null);
    const { meta, total } = armado(tarjeta);
    if (meta) {
      const cuenta = $("[data-armar-cuenta]", tarjeta);
      cuenta.textContent = `${total} de ${meta}`;
      cuenta.classList.toggle("completa", total === meta);
      $$("[data-armar-mas]", tarjeta).forEach((b) => (b.disabled = total >= meta));
      $$("[data-armar-menos]", tarjeta).forEach((b) => (b.disabled = $(`[data-armar-cant="${b.dataset.armarMenos}"]`, tarjeta).textContent === "0"));
      $("[data-agregar]", tarjeta).classList.toggle("incompleto", total !== meta);
    }
  }

  /* ---------- Carrito: vista ---------- */
  function pintarCarrito() {
    const lista = $("[data-carrito-lista]");
    const { total, unidades, faltanPrecios } = calcularTotales();

    lista.innerHTML = carrito.map((item, indice) => {
      const info = buscarItem(item);
      if (!info) return "";
      const { producto, opcion } = info;
      const subtotal = tienePrecio(opcion.precio) ? precioTexto(opcion.precio * item.cantidad) : precioTexto(null);
      const miniatura = producto.foto || producto.copo || "img/copo/copo-saludo.png";
      return `
        <li class="item color-${escapar(producto.color || "naranja")}">
          <div class="item-mini${producto.foto ? " con-foto" : ""}"><img src="${escapar(miniatura)}" alt=""></div>
          <div class="item-info">
            <p class="item-nombre">${escapar(producto.nombre)}</p>
            <p class="item-detalle">${escapar(opcion.nombre)}${item.sabor ? ` · ${escapar(item.sabor)}` : ""}</p>
            <div class="cantidad cantidad-chica">
              <button type="button" data-item-menos="${indice}" aria-label="Restar uno">−</button>
              <output>${item.cantidad}</output>
              <button type="button" data-item-mas="${indice}" aria-label="Sumar uno">+</button>
            </div>
          </div>
          <div class="item-lado">
            <p class="item-subtotal">${subtotal}</p>
            <button type="button" class="item-quitar" data-item-quitar="${indice}">Quitar</button>
          </div>
        </li>`;
    }).join("");

    const vacio = carrito.length === 0;
    $("[data-carrito-vacio]").hidden = !vacio;
    $("[data-carrito-pie]").hidden = vacio;
    lista.hidden = vacio;

    const textoTotal = faltanPrecios && total === 0 ? precioTexto(null) : precioTexto(total) + (faltanPrecios ? " + a confirmar" : "");
    $("[data-total]").textContent = textoTotal;
    $("[data-aviso-precio]").hidden = !faltanPrecios;

    $$("[data-contador]").forEach((c) => { c.textContent = unidades; c.hidden = unidades === 0; });
    const flotante = $(".carrito-flotante");
    flotante.hidden = unidades === 0;
    $("[data-total-flotante]").textContent = `${unidades} ${unidades === 1 ? "producto" : "productos"}`;
  }

  function enlazarCarrito() {
    const panel = $("#carrito");
    const fondo = $(".carrito-fondo");

    const abrir = () => {
      panel.classList.add("abierto");
      panel.setAttribute("aria-hidden", "false");
      fondo.hidden = false;
      document.body.classList.add("sin-scroll");
      setTimeout(() => $(".carrito-cerrar").focus(), 50);
    };
    const cerrar = () => {
      panel.classList.remove("abierto");
      panel.setAttribute("aria-hidden", "true");
      fondo.hidden = true;
      document.body.classList.remove("sin-scroll");
    };

    $$("[data-abrir-carrito]").forEach((b) => b.addEventListener("click", abrir));
    $$("[data-cerrar-carrito]").forEach((b) => b.addEventListener("click", cerrar));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
    $("[data-ir-tienda]").addEventListener("click", () => { cerrar(); $("#tienda").scrollIntoView({ behavior: "smooth" }); });
    if (location.hash === "#carrito") abrir();

    panel.addEventListener("click", (e) => {
      const t = e.target;
      if (t.dataset.itemMas !== undefined) { const i = carrito[+t.dataset.itemMas]; i.cantidad = Math.min(i.cantidad + 1, 99); }
      else if (t.dataset.itemMenos !== undefined) { const i = carrito[+t.dataset.itemMenos]; if (i.cantidad > 1) i.cantidad--; else carrito.splice(+t.dataset.itemMenos, 1); }
      else if (t.dataset.itemQuitar !== undefined) { carrito.splice(+t.dataset.itemQuitar, 1); }
      else return;
      guardarCarrito();
      pintarCarrito();
    });

    $("[data-vaciar]").addEventListener("click", () => {
      carrito = [];
      guardarCarrito();
      pintarCarrito();
    });

    $("[data-copiar]").addEventListener("click", async () => {
      if (!carrito.length) return;
      const texto = armarMensaje();
      let copiado = false;
      try {
        await navigator.clipboard.writeText(texto);
        copiado = true;
      } catch (e) {
        const area = document.createElement("textarea");
        area.value = texto;
        document.body.appendChild(area);
        area.select();
        try { copiado = document.execCommand("copy"); } catch (err) { /* sin portapapeles */ }
        document.body.removeChild(area);
      }
      avisar(copiado ? "Pedido copiado. ¡Pegalo en tu mensaje!" : "No pudimos copiar el pedido en este navegador.");
    });

    $("[data-enviar]").addEventListener("click", () => {
      if (!carrito.length) return;
      window.open(linkWhatsApp(armarMensaje()), "_blank", "noopener");
    });
  }

  /* ---------- Mensaje de WhatsApp ---------- */
  function armarMensaje() {
    const form = $("[data-carrito-form]");
    const nombre = form.nombre.value.trim();
    const delivery = form.entrega.value === "envio";
    const direccion = form.direccion.value.trim();
    const entrega = delivery
      ? `Envío a domicilio${direccion ? ` a ${direccion}` : " (te paso la dirección)"}`
      : `Retiro en ${form.retiro.value || "una de sus zonas"}`;
    const nota = form.nota.value.trim();
    const { total, faltanPrecios } = calcularTotales();

    const lineas = ["¡Hola COPLA! 👋 Quiero hacer este pedido:", ""];
    carrito.forEach((item) => {
      const info = buscarItem(item);
      if (!info) return;
      const { producto, opcion } = info;
      const detalle = [opcion.nombre, item.sabor].filter(Boolean).join(", ");
      const subtotal = tienePrecio(opcion.precio) ? precioTexto(opcion.precio * item.cantidad) : (CONFIG.textoSinPrecio || "A confirmar").toLowerCase();
      lineas.push(`• ${item.cantidad} × ${producto.nombre} (${detalle}): ${subtotal}`);
    });
    lineas.push("");
    if (faltanPrecios) {
      lineas.push(total > 0 ? `*Total parcial: ${precioTexto(total)}* (hay precios a confirmar)` : "*Total: a confirmar*");
    } else {
      lineas.push(`*Total: ${precioTexto(total)}*`);
    }
    lineas.push("");
    if (nombre) lineas.push(`Nombre: ${nombre}`);
    lineas.push(`Entrega: ${entrega}`);
    if (nota) lineas.push(`Comentarios: ${nota}`);
    lineas.push("", "¿Coordinamos la entrega? ¡Gracias!");
    return lineas.join("\n");
  }

  function numeroWhatsApp() {
    return String(CONFIG.whatsapp || "").replace(/\D/g, "");
  }

  function linkWhatsApp(texto) {
    const numero = numeroWhatsApp();
    const base = numero ? `https://wa.me/${numero}` : "https://wa.me/";
    return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
  }

  /* ---------- Contacto y pie ---------- */
  function pintarContacto() {
    const saludo = "¡Hola COPLA! Quería hacerles una consulta.";
    $$("[data-wa-link]").forEach((a) => { a.href = linkWhatsApp(saludo); });
    $("[data-wa-item]").hidden = numeroWhatsApp() === "";

    // Instagram: el ícono se muestra siempre; el enlace se activa al cargar el usuario.
    const ig = String(CONFIG.instagram || "").replace(/^@/, "").trim();
    const enlaceIg = $("[data-instagram-link]");
    if (ig) {
      enlaceIg.href = `https://instagram.com/${encodeURIComponent(ig)}`;
      $("[data-instagram-texto]").textContent = "Seguinos";
    } else {
      enlaceIg.removeAttribute("href");
      enlaceIg.removeAttribute("target");
      enlaceIg.classList.add("acceso-pronto");
      $("[data-instagram-texto]").textContent = "Muy pronto";
    }
    const fb = String(CONFIG.facebook || "").trim();
    if (fb) $("[data-facebook-link]").href = fb;
    $("[data-facebook-item]").hidden = !fb;

    $("[data-anio]").textContent = new Date().getFullYear();
  }

  function zonasRetiro() {
    const e = CONFIG.entregas || {};
    return (e.zonas || []).filter((z) => z && z.nombre);
  }

  function hayDelivery() {
    const d = (CONFIG.entregas || {}).delivery;
    return !!(d && d.activo);
  }

  function textoZonaGratis() {
    return (CONFIG.entregas || {}).zonaGratis || "nuestras zonas";
  }

  function unirLista(items, conector = "y") {
    if (items.length < 2) return items.join("");
    return items.slice(0, -1).join(", ") + ` ${conector} ` + items[items.length - 1];
  }

  // Formulario del carrito: retiro o delivery.
  function prepararEntrega() {
    const form = $("[data-carrito-form]");
    const select = $("[data-select-retiro]");
    const zonas = zonasRetiro();
    select.innerHTML = zonas.map((z) => `<option>${escapar(z.nombre)}</option>`).join("");
    if (!zonas.length) {
      form.querySelector('input[value="retiro"]').closest("label").hidden = true;
      form.querySelector('input[value="envio"]').checked = true;
    }
    const actualizar = () => {
      const delivery = form.entrega.value === "envio";
      $("[data-campo-retiro]").hidden = delivery || !zonas.length;
      $("[data-campo-delivery]").hidden = !delivery;
    };
    const nombres = unirLista(zonas.map((z) => z.nombre), "o");
    $("[data-ayuda-envio]").textContent = zonas.length
      ? `Gratis dentro de ${textoZonaGratis()} de ${nombres}. Si estás más lejos, coordinamos el envío por WhatsApp.`
      : "";
    form.addEventListener("change", actualizar);
    actualizar();
  }

  // Funciones que usa Copo (js/asistente.js).
  window.COPLA = {
    abrirCarrito: () => $("[data-abrir-carrito]").click(),
    zonasRetiro,
    hayDelivery,
    unirLista,
    textoZonaGratis,
    hayWhatsApp: () => numeroWhatsApp() !== "",
    linkWhatsApp,
    precioTexto,
    unidadesEnCarrito: () => calcularTotales().unidades,
  };

  /* ---------- Aviso breve ---------- */
  let temporizador;
  function avisar(texto) {
    const toast = $("[data-toast]");
    toast.textContent = texto;
    toast.classList.add("visible");
    clearTimeout(temporizador);
    temporizador = setTimeout(() => toast.classList.remove("visible"), 2200);
  }

  pintarTienda();
  pintarProximamente();
  pintarContacto();
  prepararEntrega();
  enlazarCarrito();
  pintarCarrito();
})();
