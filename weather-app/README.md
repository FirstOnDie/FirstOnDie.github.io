# 🌤️ Weather App España

Aplicación web interactiva para visualizar el clima en tiempo real de las principales ciudades de España con mapa interactivo.

## ✨ Características

- 🗺️ **Mapa Interactivo**: Visualiza las principales ciudades de España con marcadores personalizados
- 🌡️ **Clima en Tiempo Real**: Datos actualizados de temperatura, humedad, presión y viento
- 🔍 **Búsqueda Global**: Busca **cualquier ciudad de España** usando geocodificación
- 📍 **Marcadores Dinámicos**: Pines animados con información climática al hacer clic
- 💨 **Vista Responsive**: Diseño adaptado a todos los dispositivos
- 🎨 **UI Moderna**: Interfaz elegante con gradientes y animaciones suaves
- 🌐 **Geocodificación**: Integración con Nominatim para búsqueda universal

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con Flexbox y Grid
- **JavaScript (ES6+)**: Lógica de la aplicación
- **Leaflet.js**: Mapas interactivos con OpenStreetMap
- **Open-Meteo API**: Datos climáticos (gratuita, sin API key)
- **Nominatim API**: Geocodificación de ciudades (gratuita, sin API key)

## 🚀 Inicio Rápido

1. Abre `index.html` en tu navegador
2. El mapa se cargará automáticamente con las principales ciudades de España
3. Haz clic en cualquier marcador para ver el clima
4. Usa el buscador para encontrar **cualquier ciudad de España** (no solo las predefinidas)

## 🎯 Ciudades Predefinidas (18)

- Madrid, Barcelona, Valencia, Sevilla, Bilbao, Málaga, Zaragoza, Murcia
- Palma, Las Palmas, Córdoba, Granada, Mérida, Alicante
- Oviedo, Santander, Logroño, Valladolid

**¡Pero puedes buscar CUALQUIER ciudad de España!** 🎉

## 📊 APIs Utilizadas

- **Open-Meteo**: Datos climáticos gratuitos sin necesidad de API key
  - Obtiene temperatura, viento, condiciones meteorológicas en tiempo real
  - Más de 10,000 llamadas diarias permitidas
  - [open-meteo.com](https://open-meteo.com/)

- **Nominatim (OpenStreetMap)**: Geocodificación gratuita
  - Busca cualquier ciudad de España y obtiene sus coordenadas
  - Sin necesidad de API key
  - [nominatim.openstreetmap.org](https://nominatim.openstreetmap.org/)

## 🌐 Despliegue

Esta aplicación es completamente estática y puede desplegarse en:
- GitHub Pages
- Netlify
- Vercel
- Cualquier servidor estático

## 📱 Responsive

La aplicación se adapta perfectamente a:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🔧 Personalización

Para cambiar las ciudades mostradas, edita el array `cities` en `app.js`:

```javascript
this.cities = [
    { name: 'Tu Ciudad', lat: 40.4168, lon: -3.7038 }
];
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

**Carlos Expósito**
- Portfolio: [firstondie.github.io](https://firstondie.github.io)
- GitHub: [@FirstOnDie](https://github.com/FirstOnDie)
- LinkedIn: [Carlos Expósito Ceballo](https://www.linkedin.com/in/carlos-exposito-ceballo)

---

Desarrollado con ❤️ usando tecnologías web modernas
