/* ==========================================================
   COPITO · asistente de la tienda
   ----------------------------------------------------------
   Copo responde preguntas frecuentes con respuestas fijas
   (no usa inteligencia artificial ni guarda datos).
   Para cambiar lo que dice, editá los textos de PREGUNTAS.
   ========================================================== */
(function () {
  "use strict";

  const COPLA = window.COPLA || {};

  // Copo saludando: cuerpo, rayitas y brazo van en capas separadas
  // para que la manito se mueva sola (la animación está en estilos.css).
  const COPO_SALUDA = `
    <span class="copo-saluda" aria-hidden="true">
      <img src="img/copo/copo-saludo-cuerpo.png" alt="">
      <img class="copo-saluda-lineas" src="img/copo/copo-saludo-lineas.png" alt="">
      <img class="copo-saluda-brazo" src="img/copo/copo-saludo-brazo.png" alt="">
    </span>`;

  const SALUDO = [
    "¡Hola! Soy Copo, el oso polar de COPLA 🐻‍❄️",
    "Te ayudo a hacer tu pedido. ¿Qué querés saber?",
  ];

  // Cada pregunta tiene un texto para el botón y la respuesta de Copo.
  // La respuesta puede ser una lista de mensajes o una función que la arma.
  const PREGUNTAS = [
    {
      id: "comprar",
      palabras: ["compr", "pedido", "pedir", "encarg", "como hago", "carrito", "orden"],
      boton: "¿Cómo compro?",
      respuesta: () => [
        "¡Es re fácil! Son 4 pasos:",
        "1️⃣ En la <b>Tienda</b>, elegí el producto, la presentación y la cantidad, y tocá <b>Agregar</b>.",
        "2️⃣ Abrí el <b>Carrito</b> (arriba a la derecha), revisá tu pedido y elegí si lo retirás o preferís que te lo llevemos.",
        COPLA.hayWhatsApp && COPLA.hayWhatsApp()
          ? "3️⃣ Tocá <b>Enviar pedido por WhatsApp</b>: se abre una conversación con nosotros con tu pedido y el total ya escritos."
          : "3️⃣ Tocá <b>Enviar pedido por WhatsApp</b> y se arma el mensaje con tu pedido y el total. También podés tocar <b>Copiar pedido</b> y pegarlo donde quieras.",
        "4️⃣ Nos lo mandás y te respondemos para coordinar la entrega. ¡Listo!",
        "⏰ Tené en cuenta que los pedidos se hacen con <b>24 hs de anticipación</b>.",
      ],
      acciones: ["tienda", "carrito"],
    },
    {
      id: "entregas",
      palabras: ["entreg", "envio", "envian", "delivery", "retir", "zona", "donde", "llevan", "domicilio", "mapa", "barrio", "direccion"],
      boton: "¿Dónde entregan?",
      respuesta: () => {
        const zonas = COPLA.zonasRetiro ? COPLA.zonasRetiro().map((z) => z.nombre) : [];
        const lista = [];
        if (zonas.length) lista.push(`📍 Tenemos dos puntos de entrega: ${escapar(COPLA.unirLista(zonas, "y"))}. Podés <b>retirar</b> tu pedido ahí o te lo llevamos <b>gratis</b> si estás a ${escapar(COPLA.textoZonaGratis())}.`);
        if (COPLA.hayDelivery && COPLA.hayDelivery()) lista.push("🛵 ¿Estás más lejos? Igual llegamos con tu pedido, para que lo disfrutes sin moverte de casa.");
        if (!lista.length) lista.push("Contanos dónde estás cuando hagas tu pedido y coordinamos la entrega.");
        lista.push("En el carrito elegís retiro o envío, y el día y el horario los coordinamos con vos.");
        return lista;
      },
      acciones: ["mapa"],
    },
    {
      id: "precios",
      palabras: ["precio", "cuanto", "cuesta", "salen", "sale", "valor", "cost", "$"],
      boton: "¿Y los precios?",
      respuesta: [
        "Cada producto muestra su precio en el botón <b>Agregar</b>, y en el carrito ves el total.",
        "Si alguno dice <b>A confirmar</b>, te pasamos el precio final cuando nos mandás el pedido.",
      ],
      acciones: ["tienda"],
    },
    {
      id: "conservar",
      palabras: ["conserv", "freezer", "congel", "descongel", "dura", "vencim", "heladera", "guard"],
      boton: "¿Cómo los conservo?",
      respuesta: [
        "Guardalos en el freezer a <b>−18 °C</b> hasta el momento de cocinarlos ❄️",
        "Una vez que se descongelan, no los vuelvas a congelar.",
      ],
    },
    {
      id: "productos",
      palabras: ["venden", "tienen", "producto", "menu", "carta", "que hay", "variedad", "ofrecen", "hacen"],
      boton: "¿Qué venden?",
      respuesta: [
        "Hacemos todo casero y congelado: empanadas, pizzas y pizzetas, tartines, medias tartas, hamburguesitas de verdura, chipacitos y postres 😋",
        "Y muy pronto se suman el yogurth natural, los condimentos y las conservas.",
      ],
      acciones: ["tienda"],
    },
  ];

  // Respuestas que solo aparecen cuando la persona escribe.
  const CHARLA = [
    { palabras: ["hola", "buenas", "buen dia", "buenos dias", "buenas tardes", "buenas noches"],
      respuesta: ["¡Hola! 👋 Contame qué necesitás o elegí una de las preguntas de abajo."] },
    { palabras: ["gracias", "genial", "perfecto", "buenisimo", "joya"],
      respuesta: ["¡De nada! Cualquier otra cosa, acá estoy 🐻‍❄️"] },
    { palabras: ["horario", "hora", "que dia", "cuando", "anticipacion", "demora", "tarda"],
      respuesta: ["Los pedidos se hacen con <b>24 hs de anticipación</b> ⏰", "El día y el horario de entrega los coordinamos con vos por WhatsApp."],
      acciones: ["whatsapp"] },
    { palabras: ["tacc", "celiac", "gluten", "vegan", "vegetarian", "lactosa", "sin sal", "diabet", "azucar", "alergi", "ingrediente"],
      prioridad: 3,
      respuesta: ["Buena pregunta 🙌 Para eso preferimos responderte directo y con todo el detalle de cada producto.", "Tocá <b>Escribir por WhatsApp</b> y te contestamos."],
      acciones: ["whatsapp"] },
    { palabras: ["docena", "cumple", "evento", "fiesta", "por mayor", "mayorista", "cantidad", "especial", "a medida", "a gusto"],
      prioridad: 2,
      respuesta: ["¡Qué lindo! 🎉 Armamos pedidos a tu gusto, también para juntadas y eventos.", "Escribinos por WhatsApp y lo coordinamos con vos."],
      acciones: ["whatsapp", "tienda"] },
    { palabras: ["pago", "pagar", "transferencia", "efectivo", "mercado pago", "tarjeta", "alias", "cbu"],
      respuesta: ["Los medios de pago te los pasamos cuando confirmamos tu pedido por WhatsApp 💳"],
      acciones: ["whatsapp"] },
  ];

  const ACCIONES = {
    tienda: { texto: "Ver la tienda", hacer: () => { cerrar(); document.getElementById("tienda").scrollIntoView({ behavior: "smooth" }); } },
    mapa: { texto: "Ver el mapa", hacer: () => { cerrar(); document.getElementById("zonas").scrollIntoView({ behavior: "smooth" }); } },
    carrito: { texto: "Abrir mi carrito", hacer: () => { cerrar(); COPLA.abrirCarrito && COPLA.abrirCarrito(); } },
    whatsapp: { texto: "Escribir por WhatsApp", hacer: () => abrirWhatsApp(ultimaConsulta) },
  };

  /* ---------- Entender lo que escriben ---------- */
  const normalizar = (t) => String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿?¡!.,;:]/g, " ").replace(/\s+/g, " ").trim();
  const puntaje = (texto, palabras) => (palabras || []).reduce((n, p) => n + (texto.includes(normalizar(p)) ? 1 : 0), 0);

  // Busca si nombran un producto: por nombre, id o sabor.
  function buscarProducto(texto) {
    const lista = window.COPLA_PRODUCTOS || [];
    return lista.find((p) => {
      const claves = [p.id, p.nombre, ...(p.sabores || [])].map(normalizar).filter(Boolean);
      return claves.some((c) => texto.includes(c) || c.split(" ").some((w) => w.length > 4 && texto.includes(w.replace(/s$/, ""))));
    });
  }

  function respuestaProducto(p) {
    const lista = [`¡Sí! Tenemos <b>${escapar(p.nombre)}</b> 😋`];
    if (p.sabores && p.sabores.length) lista.push(`Sabores: ${escapar(COPLA.unirLista ? COPLA.unirLista(p.sabores, "y") : p.sabores.join(", "))}.`);
    if (p.armar || (p.opciones || []).some((o) => o.armar)) lista.push("La armás vos, combinando los gustos que más te gusten.");
    const precios = (p.opciones || []).map((o) =>
      `${escapar(o.nombre)}: <b>${o.precio != null ? (COPLA.precioTexto ? COPLA.precioTexto(o.precio) : "$ " + o.precio) : "a confirmar"}</b>`);
    if (precios.length) lista.push(precios.join("<br>"));
    return lista;
  }

  let ultimaConsulta = "";

  function abrirWhatsApp(consulta) {
    const texto = consulta ? `¡Hola COPLA! Les quería consultar: ${consulta}` : "¡Hola COPLA! Les quería hacer una consulta.";
    const link = COPLA.linkWhatsApp ? COPLA.linkWhatsApp(texto) : "https://wa.me/?text=" + encodeURIComponent(texto);
    window.open(link, "_blank", "noopener");
  }

  async function responderTexto(original) {
    if (ocupado) return;
    const texto = normalizar(original);
    if (!texto) return;
    ultimaConsulta = original.trim();
    opciones.innerHTML = "";
    const preguntaMsj = agregarMensaje(escapar(original.trim()), "cliente");

    const producto = buscarProducto(texto);
    const candidatos = [...PREGUNTAS, ...CHARLA].map((q) => { const n = puntaje(texto, q.palabras); return { q, n: n ? n + (q.prioridad || 0) : 0 }; }).filter((c) => c.n > 0).sort((a, b) => b.n - a.n);
    let respuesta, acciones;
    if (producto && !candidatos.some((c) => c.q.prioridad) && !candidatos.some((c) => c.q.id === "entregas" || c.q.id === "conservar" || c.q.id === "comprar")) {
      respuesta = respuestaProducto(producto); acciones = ["tienda"];
    } else if (candidatos.length) {
      const q = candidatos[0].q;
      respuesta = typeof q.respuesta === "function" ? q.respuesta() : q.respuesta; acciones = q.acciones;
    } else {
      respuesta = ["Mmm, esa no la sé responder 🙈", "Pero las chicas de COPLA sí: tocá <b>Escribir por WhatsApp</b> y les llega tu consulta ya escrita."];
      acciones = ["whatsapp"];
    }
    await decir(respuesta);
    mostrarOpciones(acciones);
    mensajes.scrollTop = Math.max(0, preguntaMsj.offsetTop - 8);
  }

  function escapar(t) {
    return String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------- Interfaz ---------- */
  const raiz = document.createElement("div");
  raiz.className = "asistente";
  raiz.innerHTML = `
    <div class="asistente-burbuja" data-asistente-burbuja hidden>
      <button type="button" class="asistente-burbuja-cerrar" aria-label="Ocultar mensaje" data-asistente-ocultar>✕</button>
      <span>¡Hola! ¿Te ayudo con tu pedido?</span>
    </div>
    <button type="button" class="asistente-boton" data-asistente-boton aria-expanded="false" aria-controls="asistente-panel" aria-label="Abrir chat con Copo">
      ${COPO_SALUDA}
    </button>
    <section class="asistente-panel" id="asistente-panel" aria-label="Chat con Copo" aria-hidden="true">
      <header class="asistente-cabecera">
        <span class="asistente-avatar">${COPO_SALUDA}</span>
        <div>
          <p class="asistente-nombre">Copo</p>
          <p class="asistente-estado">Asistente de COPLA</p>
        </div>
        <button type="button" class="asistente-cerrar" data-asistente-cerrar aria-label="Cerrar chat">✕</button>
      </header>
      <div class="asistente-mensajes" data-asistente-mensajes aria-live="polite"></div>
      <div class="asistente-opciones" data-asistente-opciones></div>
      <form class="asistente-escribir" data-asistente-form autocomplete="off">
        <input type="text" name="consulta" maxlength="300" placeholder="Escribí tu consulta…" aria-label="Escribí tu consulta" data-asistente-input>
        <button type="submit" aria-label="Enviar consulta">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12 2-12 2z" fill="currentColor"/></svg>
        </button>
      </form>
    </section>`;
  document.body.appendChild(raiz);

  const $ = (s) => raiz.querySelector(s);
  const panel = $("#asistente-panel");
  const botonAbrir = $("[data-asistente-boton]");
  const mensajes = $("[data-asistente-mensajes]");
  const opciones = $("[data-asistente-opciones]");
  const burbuja = $("[data-asistente-burbuja]");
  let iniciado = false;
  let ocupado = false;

  function abrir() {
    raiz.classList.add("abierto");
    panel.setAttribute("aria-hidden", "false");
    botonAbrir.setAttribute("aria-expanded", "true");
    burbuja.hidden = true;
    if (!iniciado) {
      iniciado = true;
      decir(SALUDO).then(() => mostrarOpciones());
    }
  }

  function cerrar() {
    raiz.classList.remove("abierto");
    panel.setAttribute("aria-hidden", "true");
    botonAbrir.setAttribute("aria-expanded", "false");
  }

  function agregarMensaje(html, quien) {
    const m = document.createElement("div");
    m.className = `asistente-msj asistente-msj-${quien}`;
    m.innerHTML = html;
    mensajes.appendChild(m);
    mensajes.scrollTop = mensajes.scrollHeight;
    return m;
  }

  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  const sinMovimiento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  async function decir(lista) {
    ocupado = true;
    for (const texto of lista) {
      const escribiendo = agregarMensaje("<span></span><span></span><span></span>", "escribiendo");
      await esperar(sinMovimiento ? 0 : Math.min(400 + texto.length * 8, 1100));
      escribiendo.remove();
      agregarMensaje(texto, "asistente");
    }
    ocupado = false;
  }

  function mostrarOpciones(extra) {
    opciones.innerHTML = "";
    (extra || []).forEach((clave) => {
      const accion = ACCIONES[clave];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "asistente-opcion asistente-opcion-accion";
      b.textContent = accion.texto;
      b.addEventListener("click", accion.hacer);
      opciones.appendChild(b);
    });
    PREGUNTAS.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "asistente-opcion";
      b.textContent = p.boton;
      b.addEventListener("click", () => responder(p));
      opciones.appendChild(b);
    });
  }

  async function responder(pregunta) {
    if (ocupado) return;
    opciones.innerHTML = "";
    const preguntaMsj = agregarMensaje(escapar(pregunta.boton), "cliente");
    const respuesta = typeof pregunta.respuesta === "function" ? pregunta.respuesta() : pregunta.respuesta;
    await decir(respuesta);
    mostrarOpciones(pregunta.acciones);
    // Deja visible el comienzo de la respuesta aunque las opciones ocupen lugar.
    mensajes.scrollTop = Math.max(0, preguntaMsj.offsetTop - 8);
  }

  const form = $("[data-asistente-form]");
  const entrada = $("[data-asistente-input]");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (ocupado) return;
    const valor = entrada.value;
    entrada.value = "";
    responderTexto(valor);
  });

  botonAbrir.addEventListener("click", () => (raiz.classList.contains("abierto") ? cerrar() : abrir()));
  $("[data-asistente-cerrar]").addEventListener("click", cerrar);
  $("[data-asistente-ocultar]").addEventListener("click", (e) => { e.stopPropagation(); burbuja.hidden = true; });
  burbuja.addEventListener("click", abrir);
  document.querySelectorAll("[data-abrir-asistente]").forEach((b) => b.addEventListener("click", abrir));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });

  // Saludo breve unos segundos después de entrar (una vez por visita).
  let yaSaludo = false;
  try { yaSaludo = sessionStorage.getItem("asistente-saludo") === "1"; } catch (e) { /* sin almacenamiento */ }
  if (!yaSaludo) {
    setTimeout(() => {
      if (!iniciado) burbuja.hidden = false;
      try { sessionStorage.setItem("asistente-saludo", "1"); } catch (e) { /* sin almacenamiento */ }
    }, 2500);
  }
})();
