/* ==========================================================
   CATÁLOGO DE PRODUCTOS
   ----------------------------------------------------------
   Para cambiar un PRECIO: editá el número en "precio"
     (sin puntos ni "$"). Ejemplo: precio: 4500
     Si lo dejás en null se muestra "A confirmar".

   Para agregar una FOTO: subí la imagen a la carpeta
     img/productos/ y escribí su nombre en "foto".
     Ejemplo: foto: "img/productos/empanadas.jpg"
     Si "foto" está vacío se muestra a Copo, la mascota.

   Para agregar un producto nuevo: copiá un bloque { ... },
     pegalo debajo y cambiá sus datos. El "id" no se puede
     repetir.

   Colores disponibles: "naranja", "rosa", "verde",
     "amarillo", "lima", "azul".

   Al final está la lista PRÓXIMAMENTE: productos que se
     muestran sin botón de compra. Para pasarlos a la tienda,
     movelos a la lista de arriba y sumales "opciones".
   ========================================================== */
window.COPLA_PRODUCTOS = [
  {
    id: "empanadas",
    nombre: "Empanadas",
    descripcion: "Caseras, de masa tierna y relleno generoso. Del freezer al horno en minutos.",
    color: "naranja",
    foto: "img/productos/empanadas.jpg",
    copo: "img/copo/copo-empanada.png",
    etiqueta: "Favorita",
    // Sabores para elegir. Dejá la lista vacía [] si no hay opciones.
    sabores: ["Jamón y queso", "Cebolla y queso", "Soja", "Carne cortada a cuchillo"],
    opciones: [
      { nombre: "Bandeja x6", precio: null },
    ],
  },
  {
    id: "pizzas",
    nombre: "Pizzas y pizzetas",
    descripcion: "Masa casera y salsa de verdad. Para la cena de la semana o la juntada del finde.",
    color: "rosa",
    foto: "img/productos/pizzas.jpg",
    copo: "img/copo/copo-pizza.png",
    etiqueta: "",
    sabores: ["Muzzarella", "Especial", "Fugazzeta", "Napolitana"],
    opciones: [
      { nombre: "Pizza x unidad", precio: null },
      { nombre: "Pizzeta x unidad", precio: null },
    ],
  },
  {
    id: "tartines",
    nombre: "Tartines",
    descripcion: "Tartas individuales bien doradas, listas para el horno. Una porción justa para cualquier día.",
    color: "azul",
    foto: "img/productos/tartines.jpg",
    copo: "img/copo/copo-saludo.png",
    etiqueta: "Nuevo",
    sabores: ["Choclo", "Espinaca"],
    opciones: [
      { nombre: "x unidad", precio: null },
    ],
  },
  {
    id: "hamburguesitas",
    nombre: "Hamburguesitas de verdura",
    descripcion: "Livianas, sabrosas y separadas una por una para cocinar solo las que necesitás.",
    color: "verde",
    foto: "img/productos/hamburguesitas.jpg",
    copo: "img/copo/copo-hamburguesa.png",
    etiqueta: "",
    sabores: ["Lentejas", "Remolacha y lentejas", "Zanahoria y porotos"],
    opciones: [
      { nombre: "Bolsa x6", precio: null },
      { nombre: "Bolsa x12", precio: null },
    ],
  },
  {
    id: "chipacitos",
    nombre: "Chipacitos",
    descripcion: "Bien quesudos y doraditos. El mate nunca estuvo tan bien acompañado.",
    color: "amarillo",
    foto: "img/productos/chipacitos.jpg",
    copo: "img/copo/copo-chipacitos.png",
    etiqueta: "",
    sabores: [],
    opciones: [
      { nombre: "Bolsa 500 g", precio: null },
      { nombre: "Bolsa 1 kg", precio: null },
    ],
  },
  {
    id: "postres",
    nombre: "Postres",
    descripcion: "Vasitos individuales de 200 ml y bomboncitos de banana bañados en chocolate. Elegí tu antojo.",
    color: "lima",
    foto: "img/productos/postres.jpg",
    copo: "img/copo/copo-postres.png",
    etiqueta: "",
    conservacion: "Conservar congelado a −18 °C. Consumir antes de 60 días. Descongelar en heladera. Una vez descongelado, consumir dentro de las 48 h. No recongelar.",
    sabores: [],
    opciones: [
      { nombre: "Cheesecake · 200 ml", precio: null },
      { nombre: "Chocotorta · 200 ml", precio: null },
      { nombre: "Tiramisú · 200 ml", precio: null },
      { nombre: "Bomboncitos de banana x3", precio: null },
    ],
  },
];

window.COPLA_PROXIMAMENTE = [
  {
    nombre: "Yogurth natural",
    descripcion: "Cremoso y casero, como el de la abuela.",
    color: "rosa",
    foto: "img/productos/yogurth.jpg",
  },
  {
    nombre: "Condimentos",
    descripcion: "Orégano, cúrcuma, pimentón, provenzal y nuez moscada.",
    color: "azul",
    foto: "img/productos/condimentos.jpg",
  },
];
