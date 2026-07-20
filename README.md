# Adontex - Catálogo Web Responsive

Este es el sitio web oficial y catálogo interactivo de **Adontex**, una marca de indumentaria especializada en remeras personalizadas y servicios de estampado textil.

## 🚀 Cómo iniciar el sitio en desarrollo

El sitio utiliza **Vite** para ofrecer una experiencia de desarrollo ultra rápida con recarga en vivo (hot reload).

### Requisitos previos
* Tener instalado [Node.js](https://nodejs.org/) en la computadora.

### Pasos
1. Abrí una terminal en la carpeta del proyecto.
2. Si es la primera vez, instalá las dependencias ejecutando:
   ```bash
   npm install
   ```
3. Iniciá el servidor local con:
   ```bash
   npm run dev
   ```
4. Abrí el enlace local que te indicará la consola (ej. `http://localhost:5173`).

---

## 🛠️ Configuración rápida

### Cambiar el número de WhatsApp
Para modificar el número al cual llegan los mensajes y consultas de la web, edita la variable `WHATSAPP_NUMBER` al inicio del archivo:
📂 `js/main.js`
```javascript
// Edita el número con código de país sin símbolos (+ o -)
const WHATSAPP_NUMBER = "5491123919842"; 
```

### Modificar productos del catálogo
Los productos se administran de forma dinámica y centralizada desde la base de datos en:
📂 `js/components/catalog.js`
Podés agregar, quitar o editar propiedades como `price`, `name`, `desc` o `img`. El sistema generará automáticamente la tarjeta y configurará el botón de consulta de WhatsApp.

---

## 📁 Estructura del proyecto

```text
├── assets/
│   └── images/          # Imágenes de trabajos y prendas generadas en alta resolución
├── css/
│   ├── variables.css    # Paleta de colores, fuentes, bordes y sombras
│   ├── styles.css       # Archivo maestro de estilos globales
│   ├── header.css       # Menú superior y versión móvil
│   ├── carousel.css     # Carrusel "Resultados" auto-scroll
│   ├── presentation.css # Sección hero y características de la marca
│   ├── catalog.css      # Grid del catálogo y diseño mobile (2 por fila)
│   ├── printing.css     # Sección de servicios de estampado
│   ├── contact.css      # Formulario y canales de contacto
│   ├── footer.css       # Pie de página responsive
│   ├── whatsapp.css     # Estilos de botones de WhatsApp flotantes y fijos
│   └── animations.css   # Clases de transiciones y scroll reveals
├── js/
│   ├── main.js          # Inicializador principal y manejo de formularios
│   └── components/
│       ├── header.js    # Lógica de barra de navegación y hamburguesa
│       ├── carousel.js  # Lógica del carrusel infinito táctil/arrastrable
│       ├── catalog.js   # Filtros del catálogo y modal de detalles
│       └── animations.js# Lógica de aparición suave al hacer scroll
├── index.html           # Estructura principal y SEO optimizado
└── package.json         # Configuración del servidor de desarrollo local
```

---

## ✨ Características clave implementadas

* **Carrusel Infinito e Interactivo:** Inspirado en el diseño de Printirol, con desplazamiento automático a 60fps usando `requestAnimationFrame` que se pausa ante el cursor del mouse, admite arrastre táctil (swipe) en celulares y clic-y-arrastre en PC.
* **Diseño Catálogo Mobile (2 por fila):** Cumpliendo con el requerimiento de negocio estricto, en pantallas móviles el catálogo muestra exactamente 2 columnas de tarjetas optimizadas sin desbordar textos ni botones.
* **Modal de Detalles del Producto:** Hacer clic en "Consultar" abre una ventana emergente premium con información detallada, talles, materiales y un botón que abre WhatsApp directo con un mensaje pre-completado del producto específico.
* **Formulario Integrado con WhatsApp:** Al enviar el formulario de contacto, el sitio compila los campos (Nombre, Email, Mensaje) y los envía formateados directamente al chat de la marca.
* **Estilo Visual Moderno:** Paleta de tonos azules premium y cianes eléctricos, tipografías elegantes (Outfit e Inter), bordes redondeados limpios y animaciones de scroll sutiles.
