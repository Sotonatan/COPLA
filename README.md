# COPLA · Alimentos congelados

Tienda web de COPLA: el cliente ve los productos, arma su carrito y, al finalizar, se abre WhatsApp con un mensaje listo que incluye el pedido y el total.

Es un sitio estático (HTML, CSS y JavaScript, sin instalaciones), listo para publicar con GitHub Pages.

## Qué editar

| Quiero cambiar… | Archivo |
| --- | --- |
| Número de WhatsApp, Instagram, zonas de entrega | `js/config.js` |
| Lo que responde Copo, el asistente | `js/asistente.js` |
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

### Conservación

Si un producto tiene indicaciones de conservación, completá `conservacion: "..."` y la tarjeta muestra un botón **Cómo conservarlos** que despliega el texto.

### WhatsApp

En `js/config.js`, completá `whatsapp` solo con dígitos y el código de país, por ejemplo `"5491112345678"`.

Mientras esté vacío:
- La sección Contacto oculta WhatsApp y avisa que el canal llega pronto (lo mismo con Instagram).
- El botón del carrito abre WhatsApp y el cliente elige a quién mandarle el mensaje. También puede tocar **Copiar pedido** y pegarlo donde quiera.

### Zonas de retiro y entrega gratis (mapa)

En `js/config.js`, dentro de `entregas`:

- `zonas`: cada zona con su nombre, su ubicación (`lat` y `lng`) y el tamaño del círculo en metros (`radio`; 5 cuadras ≈ 600 m). Dentro del círculo se puede retirar el pedido o recibirlo gratis. El mapa nunca muestra la dirección exacta.
- `zonaGratis`: el texto que explica el alcance ("5 cuadras a la redonda").
- `delivery`: el texto para quienes están más lejos (envío a cargo del cliente). No se dibuja en el mapa. Con `activo: false` se oculta.

Para sacar `lat` y `lng`: en Google Maps hacé clic derecho sobre el lugar y tocá los números que aparecen arriba (se copian). El primero es `lat` y el segundo `lng`.

El mapa usa Leaflet y mapas de OpenStreetMap, gratis y sin clave. En el carrito, el cliente elige retiro (y la zona) o envío a domicilio (y su dirección), y eso viaja en el mensaje de WhatsApp.

### Copo, el asistente

El botón con el osito abajo a la derecha abre un chat donde Copo explica cómo comprar, dónde retirar o pedir delivery, los precios y cómo conservar los productos. Tiene respuestas fijas (no usa inteligencia artificial). Para cambiar los textos o sumar preguntas, editá la lista `PREGUNTAS` en `js/asistente.js`.

## Ver la web en tu compu

Abrí `index.html` con doble clic en el navegador. No hace falta servidor.

## Dónde está publicada

La web está en **https://coplacongelados.netlify.app/**. Netlify toma los archivos de la rama del repo y la actualiza sola cada vez que se sube un cambio (tarda uno o dos minutos).

Después de cambiar CSS o JS, subí el número `?v=` de los enlaces en `index.html` para que los navegadores no muestren la versión vieja.

## Estructura

```
index.html          página principal
css/estilos.css     estilos con la paleta de COPLA
js/config.js        datos del negocio
js/productos.js     catálogo
js/app.js           tienda, carrito y mensaje de WhatsApp
js/asistente.js     chat de Copo con preguntas frecuentes
js/mapa.js          mapa de zonas de retiro y entrega gratis
img/marca/          logo, sol y luna, íconos
img/copo/           Copo, la mascota, en sus distintas poses
img/productos/      fotos de productos (vacía por ahora)
```
