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
  whatsapp: "",

  // Cómo se muestra el número en la sección Contacto.
  // Si lo dejás vacío se muestra el número tal cual.
  whatsappVisible: "",

  // Usuario de Instagram, sin "@". Dejalo vacío para ocultarlo.
  instagram: "",

  // Zonas de entrega: una por línea, entre comillas y separadas por coma.
  entregas: [
    "Ameghino al 1800 y alrededores",
    "Juan Domingo Perón al 1100 y alrededores",
  ],

  // Moneda y formato de los precios.
  moneda: "$",
  locale: "es-AR",

  // Texto para productos que todavía no tienen precio cargado.
  textoSinPrecio: "A confirmar",
};
