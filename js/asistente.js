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
  const AVATAR = "img/copo/copo-saludo.png";

  const SALUDO = [
    "¡Hola! Soy Copo, el oso polar de COPLA 🐻‍❄️",
    "Te ayudo a hacer tu pedido. ¿Qué querés saber?",
  ];

  // Cada pregunta tiene un texto para el botón y la respuesta de Copo.
  // La respuesta puede ser una lista de mensajes o una función que la arma.
  const PREGUNTAS = [
    {
      id: "comprar",
      boton: "¿Cómo compro?",
      respuesta: () => [
        "¡Es re fácil! Son 4 pasos:",
        "1️⃣ En la <b>Tienda</b>, elegí el producto, la presentación y la cantidad, y tocá <b>Agregar</b>.",
        "2️⃣ Abrí el <b>Carrito</b> (arriba a la derecha), revisá tu pedido y elegí si lo retirás o preferís delivery.",
        COPLA.hayWhatsApp && COPLA.hayWhatsApp()
          ? "3️⃣ Tocá <b>Enviar pedido por WhatsApp</b>: se abre una conversación con nosotros con tu pedido y el total ya escritos."
          : "3️⃣ Tocá <b>Enviar pedido por WhatsApp</b> y se arma el mensaje con tu pedido y el total. También podés tocar <b>Copiar pedido</b> y pegarlo donde quieras.",
        "4️⃣ Nos lo mandás y te respondemos para coordinar la entrega. ¡Listo!",
      ],
      acciones: ["tienda", "carrito"],
    },
    {
      id: "entregas",
      boton: "¿Dónde entregan?",
      respuesta: () => {
        const zonas = COPLA.zonasRetiro ? COPLA.zonasRetiro().map((z) => z.nombre) : [];
        const lista = [];
        if (zonas.length) lista.push(`📍 Podés <b>retirar</b> tu pedido en ${escapar(COPLA.unirLista(zonas, "o"))}. La dirección exacta te la pasamos por WhatsApp.`);
        if (COPLA.hayDelivery && COPLA.hayDelivery()) lista.push("🛵 También hacemos <b>delivery</b>. En el mapa ves hasta dónde llegamos.");
        if (!lista.length) lista.push("Contanos dónde estás cuando hagas tu pedido y coordinamos la entrega.");
        lista.push("En el carrito elegís retiro o delivery, y el día y el horario los coordinamos con vos.");
        return lista;
      },
      acciones: ["mapa"],
    },
    {
      id: "precios",
      boton: "¿Y los precios?",
      respuesta: [
        "Cada producto muestra su precio en el botón <b>Agregar</b>, y en el carrito ves el total.",
        "Si alguno dice <b>A confirmar</b>, te pasamos el precio final cuando nos mandás el pedido.",
      ],
      acciones: ["tienda"],
    },
    {
      id: "conservar",
      boton: "¿Cómo los conservo?",
      respuesta: [
        "Guardalos en el freezer a <b>−18 °C</b> hasta el momento de cocinarlos ❄️",
        "Una vez que se descongelan, no los vuelvas a congelar.",
      ],
    },
    {
      id: "productos",
      boton: "¿Qué venden?",
      respuesta: [
        "Hacemos todo casero y congelado: empanadas, pizzas y pizzetas, hamburguesitas de verdura, chipacitos, bomboncitos de banana y postres en vaso 😋",
      ],
      acciones: ["tienda"],
    },
  ];

  const ACCIONES = {
    tienda: { texto: "Ver la tienda", hacer: () => { cerrar(); document.getElementById("tienda").scrollIntoView({ behavior: "smooth" }); } },
    mapa: { texto: "Ver el mapa", hacer: () => { cerrar(); document.getElementById("zonas").scrollIntoView({ behavior: "smooth" }); } },
    carrito: { texto: "Abrir mi carrito", hacer: () => { cerrar(); COPLA.abrirCarrito && COPLA.abrirCarrito(); } },
  };

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
      <img src="${AVATAR}" alt="">
    </button>
    <section class="asistente-panel" id="asistente-panel" aria-label="Chat con Copo" aria-hidden="true">
      <header class="asistente-cabecera">
        <img src="${AVATAR}" alt="">
        <div>
          <p class="asistente-nombre">Copo</p>
          <p class="asistente-estado">Asistente de COPLA</p>
        </div>
        <button type="button" class="asistente-cerrar" data-asistente-cerrar aria-label="Cerrar chat">✕</button>
      </header>
      <div class="asistente-mensajes" data-asistente-mensajes aria-live="polite"></div>
      <div class="asistente-opciones" data-asistente-opciones></div>
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
