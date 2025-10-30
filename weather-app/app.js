// Weather App España - Main Application
class WeatherApp {
    constructor() {
        this.map = null;
        this.markers = [];
        this.cities = [
            { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
            { name: 'Barcelona', lat: 41.3851, lon: 2.1734 },
            { name: 'Valencia', lat: 39.4699, lon: -0.3763 },
            { name: 'Sevilla', lat: 37.3891, lon: -5.9845 },
            { name: 'Bilbao', lat: 43.2627, lon: -2.9253 },
            { name: 'Málaga', lat: 36.7213, lon: -4.4214 },
            { name: 'Zaragoza', lat: 41.6488, lon: -0.8891 },
            { name: 'Murcia', lat: 37.9922, lon: -1.1307 },
            { name: 'Palma', lat: 39.5696, lon: 2.6502 },
            { name: 'Las Palmas', lat: 28.1248, lon: -15.4300 },
            { name: 'Córdoba', lat: 37.8882, lon: -4.7794 },
            { name: 'Granada', lat: 37.1773, lon: -3.5986 },
            { name: 'Mérida', lat: 38.9163, lon: -6.3437 },
            { name: 'Alicante', lat: 38.3452, lon: -0.4810 },
            { name: 'Oviedo', lat: 43.3603, lon: -5.8448 },
            { name: 'Santander', lat: 43.4623, lon: -3.8099 },
            { name: 'Logroño', lat: 42.4627, lon: -2.4450 },
            { name: 'Valladolid', lat: 41.6523, lon: -4.7245 }
        ];
        this.currentView = 'map'; // 'map' or 'cards'
        
        this.initMap();
        this.initSearch();
        this.loadWeatherForAllCities();
    }

    // Initialize map
    initMap() {
        // Create map centered on Spain
        this.map = L.map('map').setView([40.4168, -3.7038], 6);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Add custom marker icon
        this.createCustomIcon();
        
        // Add context menu
        this.initContextMenu();
    }
    
    // Initialize context menu
    initContextMenu() {
        this.contextMenu = null;
        
        this.map.on('contextmenu', (e) => {
            // Prevent default context menu
            L.DomEvent.stop(e);
            
            // Remove existing context menu
            if (this.contextMenu) {
                this.map.removeLayer(this.contextMenu);
            }
            
            // Create context menu marker
            this.contextMenu = L.marker([e.latlng.lat, e.latlng.lng], { 
                icon: L.divIcon({
                    className: 'context-menu-marker',
                    iconSize: [20, 20]
                })
            }).addTo(this.map);
            
            // Show context menu popup
            this.showContextMenu(e.latlng);
        });
        
        // Close context menu on click
        this.map.on('click', () => {
            this.closeContextMenu();
        });
    }
    
    // Show context menu
    showContextMenu(latlng) {
        const menuHTML = `
            <div class="context-menu">
                <button class="context-menu-btn" onclick="app.getWeatherAtLocation(${latlng.lat}, ${latlng.lng})">
                    <i class="fas fa-cloud-sun"></i>
                    Ver tiempo aquí
                </button>
            </div>
        `;
        
        this.contextMenu.bindPopup(menuHTML, {
            className: 'context-menu-popup',
            closeButton: false,
            autoPan: false
        }).openPopup();
    }
    
    // Close context menu
    closeContextMenu() {
        if (this.contextMenu) {
            this.map.removeLayer(this.contextMenu);
            this.contextMenu = null;
        }
    }
    
    // Get weather at clicked location
    async getWeatherAtLocation(lat, lon) {
        this.closeContextMenu();
        this.showLoading(true);
        
        try {
            // Get location name using reverse geocoding
            const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
            const response = await fetch(geocodeUrl, {
                headers: {
                    'User-Agent': 'WeatherApp España'
                }
            });
            const data = await response.json();
            
            const locationName = data.address?.city || 
                               data.address?.town || 
                               data.address?.village || 
                               data.address?.municipality ||
                               'Ubicación';
            
            await this.focusOnCity(locationName, lat, lon);
        } catch (error) {
            console.error('Error getting location name:', error);
            await this.focusOnCity('Ubicación', lat, lon);
        } finally {
            this.showLoading(false);
        }
    }

    // Create custom marker icon
    createCustomIcon() {
        this.customIcon = L.divIcon({
            html: '<div class="custom-marker"><i class="fas fa-map-marker-alt"></i></div>',
            className: 'custom-marker-wrapper',
            iconSize: [30, 40],
            iconAnchor: [15, 40]
        });
    }

    // Initialize search functionality
    initSearch() {
        const searchBtn = document.getElementById('searchBtn');
        const citySearch = document.getElementById('citySearch');

        searchBtn.addEventListener('click', () => this.searchCity());
        citySearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchCity();
            }
        });
    }

    // Search for a city using geocoding API
    async searchCity() {
        const cityName = document.getElementById('citySearch').value.trim();
        if (!cityName) {
            this.showNotification('Por favor, ingresa el nombre de una ciudad', 'warning');
            return;
        }

        this.showLoading(true);

        try {
            // Try to find in predefined cities first
            const normalizeString = (str) => {
                return str.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');
            };

            const searchTerm = normalizeString(cityName);
            const foundCity = this.cities.find(city => 
                normalizeString(city.name).includes(searchTerm) || 
                searchTerm.includes(normalizeString(city.name))
            );

            if (foundCity) {
                await this.focusOnCity(foundCity.name, foundCity.lat, foundCity.lon);
                document.getElementById('citySearch').value = '';
                this.showLoading(false);
                return;
            }

            // If not found, use geocoding API
            const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)},España&format=json&limit=1&addressdetails=1`;
            const response = await fetch(geocodeUrl, {
                headers: {
                    'User-Agent': 'WeatherApp España'
                }
            });
            const data = await response.json();

            if (data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);
                const cityDisplayName = result.display_name.split(',')[0];
                
                await this.focusOnCity(cityDisplayName, lat, lon);
                document.getElementById('citySearch').value = '';
                this.showNotification(`${cityDisplayName} encontrada!`, 'success');
            } else {
                this.showNotification('Ciudad no encontrada en España', 'error');
            }
        } catch (error) {
            console.error('Error searching city:', error);
            this.showNotification('Error al buscar la ciudad', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Focus on a specific city
    async focusOnCity(cityName, lat, lon) {
        this.map.setView([lat, lon], 10);

        // Add or update marker
        const existingMarker = this.markers.find(m => m.cityName === cityName);
        if (existingMarker) {
            existingMarker.marker.openPopup();
        } else {
            const marker = L.marker([lat, lon], { icon: this.customIcon })
                .addTo(this.map)
                .bindPopup(`<b>${cityName}</b><br>Cargando clima...`);

            this.markers.push({ marker, cityName });
        }

        // Fetch weather data
        await this.loadWeatherData(cityName, lat, lon, true);
    }

    // Load weather for all cities
    async loadWeatherForAllCities() {
        this.showLoading(true);

        const weatherPromises = this.cities.map(city => 
            this.loadWeatherData(city.name, city.lat, city.lon, false)
        );

        try {
            await Promise.all(weatherPromises);
            this.addMarkersToMap();
        } catch (error) {
            console.error('Error loading weather:', error);
            this.showNotification('Error al cargar datos climáticos', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Add markers to map
    addMarkersToMap() {
        this.cities.forEach(city => {
            const marker = L.marker([city.lat, city.lon], { icon: this.customIcon })
                .addTo(this.map)
                .bindPopup(`<b>${city.name}</b><br>Cargando clima...`);

            this.markers.push({ marker, cityName: city.name });

            // Add click event to marker
            marker.on('click', async () => {
                await this.loadWeatherData(city.name, city.lat, city.lon, true);
            });
        });
    }

    // Load weather data for a specific city using Open-Meteo API (free, no key required)
    async loadWeatherData(cityName, lat, lon, isClick = false) {
        try {
            // Get current weather and hourly forecast for more data
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=Europe/Madrid`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.current_weather && data.hourly) {
                const now = new Date().getHours();
                const currentHourlyIndex = now;
                
                const weatherData = {
                    main: {
                        temp: data.current_weather.temperature,
                        feels_like: data.current_weather.temperature,
                        humidity: data.hourly.relativehumidity_2m[currentHourlyIndex],
                        pressure: 1013, // Not available in free tier
                        precipitation: data.hourly.precipitation[currentHourlyIndex]
                    },
                    wind: {
                        speed: data.current_weather.windspeed,
                        direction: data.current_weather.winddirection
                    },
                    daily: {
                        temp_max: data.daily.temperature_2m_max[0],
                        temp_min: data.daily.temperature_2m_min[0],
                        precipitation: data.daily.precipitation_sum[0]
                    },
                    weather: [{
                        description: this.getWeatherDescription(data.current_weather.weathercode),
                        icon: this.getWeatherIconCode(data.current_weather.weathercode)
                    }]
                };

                this.updateMarkerPopup(cityName, weatherData);
                this.updateWeatherCards(cityName, weatherData);
                
                if (isClick) {
                    this.showNotification(`Clima actualizado para ${cityName}`, 'success');
                }
            }
        } catch (error) {
            console.error(`Error loading weather for ${cityName}:`, error);
        }
    }

    // Get weather description from WMO weather code
    getWeatherDescription(code) {
        const descriptions = {
            0: 'Cielo despejado',
            1: 'Mayormente despejado',
            2: 'Parcialmente nublado',
            3: 'Nublado',
            45: 'Niebla',
            48: 'Niebla helada',
            51: 'Llovizna ligera',
            53: 'Llovizna moderada',
            55: 'Llovizna densa',
            61: 'Lluvia ligera',
            63: 'Lluvia moderada',
            65: 'Lluvia intensa',
            71: 'Nieve ligera',
            73: 'Nieve moderada',
            75: 'Nieve intensa',
            80: 'Chubascos ligeros',
            81: 'Chubascos moderados',
            82: 'Chubascos intensos',
            85: 'Chubascos de nieve ligeros',
            86: 'Chubascos de nieve intensos',
            95: 'Tormenta',
            96: 'Tormenta con granizo'
        };
        return descriptions[code] || 'Condiciones variables';
    }

    // Get weather icon code for display
    getWeatherIconCode(code) {
        // Map WMO codes to icon codes
        if (code === 0) return '01d';
        if (code === 1) return '02d';
        if ([2, 3].includes(code)) return '03d';
        if ([45, 48].includes(code)) return '50d';
        if ([51, 53, 55].includes(code)) return '09d';
        if ([61, 63, 65].includes(code)) return '10d';
        if ([71, 73, 75].includes(code)) return '13d';
        if ([80, 81, 82].includes(code)) return '09d';
        if ([85, 86].includes(code)) return '13d';
        if ([95, 96].includes(code)) return '11d';
        return '02d';
    }

    // Update marker popup with weather data
    updateMarkerPopup(cityName, weatherData) {
        const markerData = this.markers.find(m => m.cityName === cityName);
        if (markerData) {
            const temp = Math.round(weatherData.main.temp);
            const tempMax = Math.round(weatherData.daily.temp_max);
            const tempMin = Math.round(weatherData.daily.temp_min);
            const humidity = Math.round(weatherData.main.humidity);
            const windSpeed = Math.round(weatherData.wind.speed * 3.6);
            const precipitation = weatherData.main.precipitation.toFixed(1);
            const description = weatherData.weather[0].description;
            const icon = this.getWeatherIcon(weatherData.weather[0].icon);

            markerData.marker.setPopupContent(`
                <div style="text-align: left; min-width: 200px; padding: 10px;">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <h3 style="margin: 0 0 5px 0; color: #3b82f6; font-size: 1.2rem;">${cityName}</h3>
                        <div style="font-size: 2.5rem; margin: 10px 0;">${icon}</div>
                        <div style="font-size: 2rem; font-weight: bold; margin: 10px 0;">
                            ${temp}°C
                        </div>
                        <div style="text-transform: capitalize; color: #666; font-size: 0.9rem;">
                            ${description}
                        </div>
                    </div>
                    <div style="border-top: 1px solid #e0e0e0; padding-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85rem;">
                        <div><strong>Max:</strong> ${tempMax}°C</div>
                        <div><strong>Min:</strong> ${tempMin}°C</div>
                        <div><strong>Humedad:</strong> ${humidity}%</div>
                        <div><strong>Viento:</strong> ${windSpeed} km/h</div>
                        <div style="grid-column: 1 / -1;"><strong>Precipitación:</strong> ${precipitation} mm</div>
                    </div>
                </div>
            `);

            // Open popup
            markerData.marker.openPopup();
        }
    }

    // Update weather cards
    updateWeatherCards(cityName, weatherData) {
        const cardsGrid = document.getElementById('cardsGrid');
        const existingCard = Array.from(cardsGrid.children).find(card => 
            card.dataset.city === cityName
        );

        const cardHTML = this.createWeatherCardHTML(cityName, weatherData);
        
        if (existingCard) {
            existingCard.outerHTML = cardHTML;
        } else {
            cardsGrid.insertAdjacentHTML('beforeend', cardHTML);
        }
    }

    // Create weather card HTML
    createWeatherCardHTML(cityName, weatherData) {
        const temp = Math.round(weatherData.main.temp);
        const tempMax = Math.round(weatherData.daily.temp_max);
        const tempMin = Math.round(weatherData.daily.temp_min);
        const feelsLike = Math.round(weatherData.main.feels_like);
        const humidity = Math.round(weatherData.main.humidity);
        const pressure = weatherData.main.pressure;
        const windSpeed = Math.round(weatherData.wind.speed * 3.6);
        const precipitation = weatherData.main.precipitation.toFixed(1);
        const description = weatherData.weather[0].description;
        const icon = this.getWeatherIcon(weatherData.weather[0].icon);

        return `
            <div class="weather-card" data-city="${cityName}">
                <div class="weather-card-header">
                    <h3>${cityName}</h3>
                    <div class="temp-main">${temp}°C</div>
                </div>
                <div class="weather-card-body">
                    <div class="weather-icon">${icon}</div>
                    <div class="weather-description">
                        <p>${description}</p>
                        <span class="feels-like">Sensación: ${feelsLike}°C</span>
                        <div class="temp-range">
                            <span class="temp-max">↗ ${tempMax}°C</span>
                            <span class="temp-min">↘ ${tempMin}°C</span>
                        </div>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <span class="weather-detail-label">Humedad</span>
                        <span class="weather-detail-value">${humidity}%</span>
                    </div>
                    <div class="weather-detail">
                        <span class="weather-detail-label">Presión</span>
                        <span class="weather-detail-value">${pressure} hPa</span>
                    </div>
                    <div class="weather-detail">
                        <span class="weather-detail-label">Viento</span>
                        <span class="weather-detail-value">${windSpeed} km/h</span>
                    </div>
                    <div class="weather-detail">
                        <span class="weather-detail-label">Precipitación</span>
                        <span class="weather-detail-value">${precipitation} mm</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Get weather icon emoji based on OpenWeather icon code
    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };
        return iconMap[iconCode] || '🌤️';
    }

    // Show loading overlay
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    // Show notification with visual feedback
    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Remove existing notification
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Icon mapping
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Custom marker styles
const style = document.createElement('style');
style.textContent = `
    .custom-marker-wrapper {
        background: transparent;
        border: none;
    }
    
    .custom-marker {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #3b82f6, #06b6d4);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        border: 2px solid white;
        animation: markerFloat 3s ease-in-out infinite;
    }
    
    .custom-marker i {
        transform: rotate(45deg);
        color: white;
        font-size: 1.25rem;
    }
    
    @keyframes markerFloat {
        0%, 100% { 
            transform: rotate(-45deg) translateY(0);
        }
        50% { 
            transform: rotate(-45deg) translateY(-5px);
        }
    }
    
    .leaflet-popup-content {
        margin: 0 !important;
        padding: 0 !important;
        width: auto !important;
    }
    
    .leaflet-popup-content-wrapper {
        border-radius: 12px !important;
        padding: 10px !important;
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WeatherApp();
});