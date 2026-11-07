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

  // RETIRO Y ENTREGA GRATIS
  // Cada zona se dibuja en el mapa como un círculo, sin mostrar la
  // dirección exacta. Dentro del círculo se puede retirar el pedido o
  // recibirlo gratis.
  // Para mover una zona:
  //   1. Abrí Google Maps y hacé clic derecho sobre el lugar.
  //   2. Tocá los números que aparecen arriba (se copian).
  //   3. Pegalos en lat (el primero) y lng (el segundo).
  // "radio" es el tamaño del círculo en metros (5 cuadras ≈ 600 m).
  entregas: {
    zonaGratis: "5 cuadras a la redonda",
    zonas: [
      { nombre: "zona Perón", lat: -27.4438, lng: -58.9982, radio: 600 },
      { nombre: "zona Ameghino", lat: -27.4650, lng: -58.9775, radio: 600 },
    ],
    // Delivery fuera de las zonas: no se marca en el mapa.
    // Poné activo: false para ocultarlo.
    delivery: {
      activo: true,
      texto: "Fuera de estas zonas también te lo llevamos. El costo del envío corre por tu cuenta.",
    },
  },

  // Moneda y formato de los precios.
  moneda: "$",
  locale: "es-AR",

  // Texto para productos que todavía no tienen precio cargado.
  textoSinPrecio: "A confirmar",
};
