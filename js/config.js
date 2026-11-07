/* ==========================================================
   DATOS DEL NEGOCIO
   Editá estos valores y guardá el archivo. No hace falta
   tocar nada más para que la web los muestre.
   ========================================================== */
window.COPLA_CONFIG = {
  // Número de WhatsApp en formato internacional, SOLO dígitos,
  // sin "+", espacios ni guiones.
  // Ejemplo Argentina (código 54, celular 9, área 11): "5491112345678"
  // Mientras esté vacío, la sección Contacto avisa que el canal
  // llega pronto y el botón del carrito abre WhatsApp para que el
  // cliente elija a quién enviar el mensaje (también puede copiarlo).
  whatsapp: "5493625320932",

  // Cómo se muestra el número en la sección Contacto.
  // Si lo dejás vacío se muestra el número tal cual.
  whatsappVisible: "+54 9 362 532-0932",

  // Usuario de Instagram, sin "@". Dejalo vacío para ocultarlo.
  instagram: "",

  // RETIRO Y DELIVERY
  // Las zonas se dibujan en el mapa como círculos aproximados, para no
  // mostrar la dirección exacta. Para mover una zona:
  //   1. Abrí Google Maps y hacé clic derecho cerca del lugar.
  //   2. Tocá los números que aparecen arriba (se copian).
  //   3. Pegalos en lat (el primero) y lng (el segundo).
  // "radio" es el tamaño del círculo en metros.
  entregas: {
    retiro: [
      { nombre: "zona Ameghino", lat: -27.4690, lng: -58.9760, radio: 450 },
      { nombre: "zona Perón", lat: -27.4510, lng: -58.9990, radio: 450 },
    ],
    // Delivery: un círculo alrededor de "centro" con el radio en km.
    // Poné activo: false para ocultarlo.
    delivery: {
      activo: true,
      centro: { lat: -27.4600, lng: -58.9875 },
      radioKm: 3,
      texto: "Llevamos tu pedido a domicilio dentro de esta zona. Si estás un poco más lejos, consultanos.",
    },
  },

  // Moneda y formato de los precios.
  moneda: "$",
  locale: "es-AR",

  // Texto para productos que todavía no tienen precio cargado.
  textoSinPrecio: "A confirmar",
};
