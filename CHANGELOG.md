[<img src="https://images.emojiterra.com/google/android-10/512px/1f1fa-1f1f8.png" width="15"> Read in English](CHANGELOG.en.md)  
[<img src="https://flagmatch.com/assets/flags/emojis/google/br-9a073877.png" width="15"> Leia em português](CHANGELOG.pt.md)

# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

## [5.0.0] - Versión Final (Release)
### Añadido
- **Modos PDF:** Ahora puedes elegir entre exportar en "Light Mode" (fondo claro) o "Dark Mode" (fondo oscuro).
- **Subida Local:** Opción para subir una imagen de portada desde el PC si la web la bloquea.
- **UI:** Mejoras visuales en el asistente, botones de alto contraste para mejor accesibilidad.
- **Estructura:** Código optimizado y limpieza de estilos CSS.

## [4.5.0] - Navegación Fluida
### Añadido
- **Modo Navegación:** Botón en la barra del asistente para pausar la selección y permitir hacer clic en enlaces (esencial para pasar de la portada al Cap 1).
- **Persistencia:** El asistente recuerda en qué paso estabas aunque cambies de página.

## [4.0.0] - Metadata y Estimaciones
### Añadido
- **Captura Completa:** Soporte para seleccionar Imagen de Portada y Sinopsis.
- **Algoritmo de Tiempo:** Cálculo en tiempo real de cuánto falta para terminar la descarga.
- **PDF Profesional:** Nueva primera página en el PDF con portada centrada, estadísticas y sinopsis.

## [3.0.0] - Internacionalización (i18n)
### Añadido
- **Soporte Multi-idioma:** Español, Inglés y Portugués.
- Selector de idioma dinámico en el Popup.
- Archivo centralizado `locales.js` para fácil traducción.

## [2.0.0] - Optimización de Rendimiento
### Cambiado
- **Motor de Scrapeo:** Reemplazo de `setTimeout` fijos por `setInterval` dinámico.
- **Velocidad:** Detección instantánea del contenido para saltar al siguiente capítulo sin esperas.
- **UX:** Se eliminaron los botones manuales del popup en favor del "Wizard" (Asistente en página).

## [1.0.0] - Prototipo Inicial
- Funcionalidad básica de selección de elementos (Título, Contenido, Botón Siguiente).
- Generación básica de PDF con `jsPDF`.

- Almacenamiento local en Chrome Storage.
