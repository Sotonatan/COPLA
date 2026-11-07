/* ==========================================================
   COPITO · asistente de la tienda
   ----------------------------------------------------------
   Copito responde preguntas frecuentes con respuestas fijas
   (no usa inteligencia artificial ni guarda datos).
   Para cambiar lo que dice, editá los textos de PREGUNTAS.
   ========================================================== */
(function () {
  "use strict";

  const COPLA = window.COPLA || {};
  const AVATAR = "img/copo/copo-saludo.png";

  const SALUDO = [
    "¡Hola! Soy Copito, el osito de COPLA 🐻‍❄️",
    "Te ayudo a hacer tu pedido. ¿Qué querés saber?",
  ];

  // Cada pregunta tiene un texto para el botón y la respuesta de Copito.
  // La respuesta puede ser una lista de mensajes o una función que la arma.
  const PREGUNTAS = [
    {
      id: "comprar",
      boton: "¿Cómo compro?",
      respuesta: () => [
        "¡Es re fácil! Son 4 pasos:",
        "1️⃣ En la <b>Tienda</b>, elegí el producto, la presentación y la cantidad, y tocá <b>Agregar</b>.",
        "2️⃣ Abrí el <b>Carrito</b> (arriba a la derecha) y revisá tu pedido. Podés dejar tu nombre, tu zona y algún comentario.",
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
        const zonas = COPLA.zonasEntrega ? COPLA.zonasEntrega() : [];
        if (!zonas.length) return ["Entregamos en varias zonas. Contanos dónde estás cuando hagas tu pedido y lo coordinamos."];
        return [
          "Por ahora entregamos en:",
          zonas.map((z) => `📍 ${escapar(z)}`).join("<br>"),
          "El día y el horario los coordinamos con vos cuando nos mandás el pedido.",
        ];
      },
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
    carrito: { texto: "Abrir mi carrito", hacer: () => { cerrar(); COPLA.abrirCarrito && COPLA.abrirCarrito(); } },
  };

  function escapar(t) {
    return String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------- Interfaz ---------- */
  const raiz = document.createElement("div");
  raiz.className = "copito";
  raiz.innerHTML = `
    <div class="copito-burbuja" data-copito-burbuja hidden>
      <button type="button" class="copito-burbuja-cerrar" aria-label="Ocultar mensaje" data-copito-ocultar>✕</button>
      <span>¡Hola! ¿Te ayudo con tu pedido?</span>
    </div>
    <button type="button" class="copito-boton" data-copito-boton aria-expanded="false" aria-controls="copito-panel" aria-label="Abrir chat con Copito">
      <img src="${AVATAR}" alt="">
    </button>
    <section class="copito-panel" id="copito-panel" aria-label="Chat con Copito" aria-hidden="true">
      <header class="copito-cabecera">
        <img src="${AVATAR}" alt="">
        <div>
          <p class="copito-nombre">Copito</p>
          <p class="copito-estado">Asistente de COPLA</p>
        </div>
        <button type="button" class="copito-cerrar" data-copito-cerrar aria-label="Cerrar chat">✕</button>
      </header>
      <div class="copito-mensajes" data-copito-mensajes aria-live="polite"></div>
      <div class="copito-opciones" data-copito-opciones></div>
    </section>`;
  document.body.appendChild(raiz);

  const $ = (s) => raiz.querySelector(s);
  const panel = $("#copito-panel");
  const botonAbrir = $("[data-copito-boton]");
  const mensajes = $("[data-copito-mensajes]");
  const opciones = $("[data-copito-opciones]");
  const burbuja = $("[data-copito-burbuja]");
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
    m.className = `copito-msj copito-msj-${quien}`;
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
      agregarMensaje(texto, "copito");
    }
    ocupado = false;
  }

  function mostrarOpciones(extra) {
    opciones.innerHTML = "";
    (extra || []).forEach((clave) => {
      const accion = ACCIONES[clave];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "copito-opcion copito-opcion-accion";
      b.textContent = accion.texto;
      b.addEventListener("click", accion.hacer);
      opciones.appendChild(b);
    });
    PREGUNTAS.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "copito-opcion";
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
  $("[data-copito-cerrar]").addEventListener("click", cerrar);
  $("[data-copito-ocultar]").addEventListener("click", (e) => { e.stopPropagation(); burbuja.hidden = true; });
  burbuja.addEventListener("click", abrir);
  document.querySelectorAll("[data-abrir-copito]").forEach((b) => b.addEventListener("click", abrir));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });

  // Saludo breve unos segundos después de entrar (una vez por visita).
  let yaSaludo = false;
  try { yaSaludo = sessionStorage.getItem("copito-saludo") === "1"; } catch (e) { /* sin almacenamiento */ }
  if (!yaSaludo) {
    setTimeout(() => {
      if (!iniciado) burbuja.hidden = false;
      try { sessionStorage.setItem("copito-saludo", "1"); } catch (e) { /* sin almacenamiento */ }
    }, 2500);
  }
})();
