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
   ========================================================== */
window.COPLA_PRODUCTOS = [
  {
    id: "empanadas",
    nombre: "Empanadas",
    descripcion: "Caseras, de masa tierna y relleno generoso. Del freezer al horno en minutos.",
    color: "naranja",
    foto: "",
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
    foto: "",
    copo: "img/copo/copo-pizza.png",
    etiqueta: "",
    sabores: ["Muzzarella", "Especial", "Fugazzeta", "Napolitana"],
    opciones: [
      { nombre: "Pizza x unidad", precio: null },
      { nombre: "Pizzeta x unidad", precio: null },
    ],
  },
  {
    id: "hamburguesitas",
    nombre: "Hamburguesitas de verdura",
    descripcion: "Livianas, sabrosas y separadas una por una para cocinar solo las que necesitás.",
    color: "verde",
    foto: "",
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
    foto: "",
    copo: "img/copo/copo-chipacitos.png",
    etiqueta: "",
    sabores: [],
    opciones: [
      { nombre: "Bolsa 500 g", precio: null },
      { nombre: "Bolsa 1 kg", precio: null },
    ],
  },
  {
    id: "bomboncitos",
    nombre: "Bomboncitos de banana",
    descripcion: "Banana y chocolate en un bocado helado. Un mimo dulce para cualquier momento.",
    color: "lima",
    foto: "",
    copo: "img/copo/copo-saludo.png",
    etiqueta: "",
    sabores: [],
    opciones: [
      { nombre: "1 unidad · 150 g", precio: null },
      { nombre: "3 unidades", precio: null },
    ],
  },
  {
    id: "postres-vaso",
    nombre: "Postres en vaso",
    descripcion: "Vasitos individuales de 200 ml, listos para el antojo: elegí tu favorito o probalos todos.",
    color: "lima",
    foto: "",
    copo: "img/copo/copo-postres.png",
    etiqueta: "Nuevo",
    sabores: ["Chocotorta", "Tiramisú", "Cheesecake de frutos rojos"],
    opciones: [
      { nombre: "Vaso individual · 200 ml", precio: null },
    ],
  },
];
