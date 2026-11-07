# COPLA · Alimentos congelados

Tienda web de COPLA: el cliente ve los productos, arma su carrito y, al finalizar, se abre WhatsApp con un mensaje listo que incluye el pedido y el total.

Es un sitio estático (HTML, CSS y JavaScript, sin instalaciones), listo para publicar con GitHub Pages.

## Qué editar

| Quiero cambiar… | Archivo |
| --- | --- |
| Número de WhatsApp, Instagram, zona y días de entrega | `js/config.js` |
| Precios, productos, presentaciones, descripciones | `js/productos.js` |
| Fotos de productos | carpeta `img/productos/` + `js/productos.js` |
| Textos de la portada, pasos y contacto | `index.html` |
| Colores y estilos | `css/estilos.css` |

### Precios

En `js/productos.js`, cada producto tiene sus presentaciones en `opciones`. Escribí el precio como número, sin `$` ni puntos:

```js
opciones: [
  { nombre: "Bolsa 500 g", precio: 3800 },
  { nombre: "Bolsa 1 kg", precio: 7200 },
],
```

Si el precio queda en `null`, la web muestra "A confirmar" y el mensaje de WhatsApp lo avisa.

### Fotos

1. Subí la foto a `img/productos/` (por ejemplo `chipacitos.jpg`). Conviene que sea horizontal (4:3) y pese menos de 300 KB.
2. En `js/productos.js`, completá `foto: "img/productos/chipacitos.jpg"`.

Mientras `foto` esté vacío, la tarjeta muestra a Copo con el color del producto.

### Sabores

Si un producto tiene sabores para elegir (por ejemplo empanadas), completá `sabores: ["Carne", "Pollo", "Jamón y queso"]` y aparece un selector.

### WhatsApp

En `js/config.js`, completá `whatsapp` solo con dígitos y el código de país, por ejemplo `"5491112345678"`. Mientras esté vacío, el botón abre WhatsApp y el cliente elige a quién mandarle el mensaje.

## Ver la web en tu compu

Abrí `index.html` con doble clic en el navegador. No hace falta servidor.

## Publicar con GitHub Pages

1. En GitHub, entrá a **Settings → Pages**.
2. En **Build and deployment**, elegí **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
3. Guardá. En un par de minutos la web queda en `https://sotonatan.github.io/COPLA/`.

## Estructura

```
index.html          página principal
css/estilos.css     estilos con la paleta de COPLA
js/config.js        datos del negocio
js/productos.js     catálogo
js/app.js           tienda, carrito y mensaje de WhatsApp
img/marca/          logo, sol y luna, íconos
img/copo/           Copo, la mascota, en sus distintas poses
img/productos/      fotos de productos (vacía por ahora)
```
