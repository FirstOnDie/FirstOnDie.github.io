// Movie Discovery App - Using OMDb API
class MovieApp {
    constructor() {
        // Load API key from localStorage
        this.apiKey = localStorage.getItem('omdb_api_key');
        this.apiBase = 'https://www.omdbapi.com';
        
        // State
        this.favoriteMovies = [];
        this.currentMode = 'search';
        this.hasApiKey = !!this.apiKey;
        
        // Initialize
        this.init();
    }
    
    // Initialize app
    init() {
        this.bindEvents();
        this.loadFavoritesFromStorage();
        
        // Show setup if no API key
        if (!this.hasApiKey) {
            setTimeout(() => this.showAPIKeySetup(), 500);
        }
    }
    
    // Show API key setup modal
    showAPIKeySetup() {
        const modal = document.createElement('div');
        modal.className = 'api-key-modal';
        modal.innerHTML = `
            <div class="api-key-content">
                <div class="api-key-header">
                    <h3><i class="fas fa-key"></i> API Key Setup</h3>
                </div>
                <div class="api-key-body">
                    <p style="margin-bottom: 1.5rem; color: var(--text-primary); font-size: 1.1rem;">
                        To search movies dynamically, you need a free OMDb API key.
                    </p>
                    <div class="api-key-steps">
                        <div class="step">
                            <strong>1.</strong> Visit <a href="https://www.omdbapi.com/apikey.aspx" target="_blank">www.omdbapi.com/apikey.aspx</a>
                        </div>
                        <div class="step">
                            <strong>2.</strong> Enter your email and select "FREE"
                        </div>
                        <div class="step">
                            <strong>3.</strong> Check your email and copy your API key
                        </div>
                        <div class="step">
                            <strong>4.</strong> Paste your API key below
                        </div>
                    </div>
                    <input type="text" id="apiKeyInput" placeholder="Paste your OMDb API key here" class="api-key-input">
                    <div class="api-key-actions">
                        <button class="btn-save-api" onclick="app.saveAPIKey()">
                            <i class="fas fa-save"></i> Save API Key
                        </button>
                        <button class="btn-demo-api" onclick="app.useDemoMode()">
                            <i class="fas fa-film"></i> Use Demo Mode
                        </button>
                    </div>
                    <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted);">
                        <i class="fas fa-info-circle"></i> The API key is free and allows 1,000 searches per day.
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Save API key
    saveAPIKey() {
        const input = document.getElementById('apiKeyInput');
        const apiKey = input.value.trim();
        
        if (!apiKey) {
            this.showNotification('Please enter an API key', 'warning');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('omdb_api_key', apiKey);
        this.apiKey = apiKey;
        this.hasApiKey = true;
        
        // Remove modal
        document.querySelector('.api-key-modal').remove();
        
        // Show success
        this.showNotification('API key saved successfully', 'success');
        
        // Clear search
        document.getElementById('movieSearch').value = '';
    }
    
    // Use demo mode
    useDemoMode() {
        // Mark as demo
        localStorage.setItem('omdb_api_key', 'demo');
        this.apiKey = 'demo';
        this.hasApiKey = false;
        
        // Remove modal
        document.querySelector('.api-key-modal').remove();
    }
    
    // Bind event listeners
    bindEvents() {
        // Mode switching
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchMode(tab.dataset.mode);
            });
        });
        
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const movieSearch = document.getElementById('movieSearch');
        
        searchBtn.addEventListener('click', () => this.searchMovies());
        movieSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchMovies();
        });
        
        // Favorite functionality
        const addFavoriteBtn = document.getElementById('addFavoriteBtn');
        const favoriteSearch = document.getElementById('favoriteSearch');
        
        addFavoriteBtn.addEventListener('click', () => this.searchFavoriteMovies());
        favoriteSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchFavoriteMovies();
        });
        
        favoriteSearch.addEventListener('input', (e) => {
            if (e.target.value.length > 2) {
                this.debounceSearch(e.target.value);
            } else {
                this.hideFavoriteDropdown();
            }
        });
        
        // Recommendations
        const getRecommendationsBtn = document.getElementById('getRecommendationsBtn');
        const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');
        
        getRecommendationsBtn.addEventListener('click', () => this.getRecommendations());
        clearFavoritesBtn.addEventListener('click', () => this.clearFavorites());
    }
    
    // Switch between modes
    switchMode(mode) {
        this.currentMode = mode;
        
        // Update tabs
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });
        
        // Update content
        document.querySelectorAll('.mode-content').forEach(content => {
            content.classList.toggle('active', content.id === `${mode}Mode`);
        });
        
        // Update button state
        const getRecommendationsBtn = document.getElementById('getRecommendationsBtn');
        getRecommendationsBtn.disabled = this.favoriteMovies.length === 0;
    }
    
    // Search movies
    async searchMovies() {
        const query = document.getElementById('movieSearch').value.trim();
        
        if (!query) {
            this.showNotification('Please enter a movie title', 'warning');
            return;
        }
        
        // Check if we have API key
        if (!this.hasApiKey || !this.apiKey || this.apiKey === 'demo') {
            this.showNotification('Configure an API key for dynamic searches', 'warning');
            this.showAPIKeySetup();
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Search OMDb API
            const response = await fetch(
                `${this.apiBase}/?apikey=${this.apiKey}&s=${encodeURIComponent(query)}&type=movie`
            );
            
            if (!response.ok) {
                throw new Error('Error searching movies');
            }
            
            const data = await response.json();
            
            if (data.Response === 'False') {
                this.showNotification(data.Error || 'No movies found', 'info');
                this.displaySearchResults([]);
                this.showLoading(false);
                return;
            }
            
            // Get detailed info for each movie
            const detailedMovies = await Promise.all(
                data.Search.slice(0, 10).map(movie => this.getMovieDetails(movie.imdbID))
            );
            
            this.displaySearchResults(detailedMovies.filter(m => m && m.Response !== 'False'));
            
        } catch (error) {
            console.error('Error searching movies:', error);
            this.showNotification('Error searching movies. Please verify your API key.', 'error');
            this.displaySearchResults([]);
        } finally {
            this.showLoading(false);
        }
    }
    
    // Get detailed movie info
    async getMovieDetails(imdbID) {
        try {
            const response = await fetch(
                `${this.apiBase}/?apikey=${this.apiKey}&i=${imdbID}&plot=full`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting movie details:', error);
            return null;
        }
    }
    
    // Display search results
    displaySearchResults(movies) {
        const container = document.getElementById('searchResults');
        
        if (movies.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-film"></i>
                    <p>No movies found</p>
                    <span>Try another title</span>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="movies-grid">
                ${movies.map(movie => this.createMovieCard(movie)).join('')}
            </div>
        `;
    }
    
    // Create movie card HTML
    createMovieCard(movie) {
        const poster = movie.Poster && movie.Poster !== 'N/A' 
            ? `<img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster">`
            : '<div class="movie-poster" style="background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center;"><i class="fas fa-film" style="font-size: 3rem; color: var(--text-muted);"></i></div>';
        
        const rating = movie.imdbRating && movie.imdbRating !== 'N/A'
            ? `<div class="movie-rating"><i class="fas fa-star"></i> ${movie.imdbRating}</div>`
            : '';
        
        const overview = movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'No description available.';
        const genres = movie.Genre && movie.Genre !== 'N/A' ? movie.Genre.split(',').map(g => g.trim()).slice(0, 3) : [];
        
        return `
            <div class="movie-card" data-imdbid="${movie.imdbID || ''}" onclick="app.showMovieDetails('${movie.imdbID || ''}')" style="cursor: pointer;">
                <div class="movie-poster-container">
                    ${poster}
                    ${rating}
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.Title}</h3>
                    <p class="movie-year">${movie.Year}</p>
                    <p class="movie-overview">${overview}</p>
                    ${genres.length > 0 ? `
                        <div class="movie-genres">
                            ${genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Search favorite movies
    async searchFavoriteMovies() {
        const query = document.getElementById('favoriteSearch').value.trim();
        
        if (!query) {
            this.showNotification('Please enter a movie title', 'warning');
            return;
        }
        
        if (!this.hasApiKey || !this.apiKey || this.apiKey === 'demo') {
            this.showNotification('Configure an API key for dynamic searches', 'warning');
            this.showAPIKeySetup();
            return;
        }
        
        this.showLoading(true);
        
        try {
            const response = await fetch(
                `${this.apiBase}/?apikey=${this.apiKey}&s=${encodeURIComponent(query)}&type=movie`
            );
            
            if (!response.ok) {
                throw new Error('Error searching movies');
            }
            
            const data = await response.json();
            
            if (data.Response === 'False') {
                this.showNotification(data.Error || 'No movies found', 'info');
                this.hideFavoriteDropdown();
                this.showLoading(false);
                return;
            }
            
            const detailedMovies = await Promise.all(
                data.Search.slice(0, 5).map(movie => this.getMovieDetails(movie.imdbID))
            );
            
            this.showFavoriteDropdown(detailedMovies.filter(m => m && m.Response !== 'False'));
            
        } catch (error) {
            console.error('Error searching favorite movies:', error);
            this.showNotification('Error searching movies', 'error');
            this.hideFavoriteDropdown();
        } finally {
            this.showLoading(false);
        }
    }
    
    // Debounce search
    debounceSearch(query) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchFavoriteMovies();
        }, 500);
    }
    
    // Show favorite dropdown
    showFavoriteDropdown(movies) {
        const dropdown = document.getElementById('favoriteSearchResults');
        
        if (movies.length === 0) {
            dropdown.innerHTML = `
                <div class="dropdown-item">
                    <p>No se encontraron películas</p>
                </div>
            `;
            dropdown.classList.add('active');
            return;
        }
        
        dropdown.innerHTML = `
            ${movies.map(movie => `
                <div class="dropdown-item" data-id="${movie.imdbID}">
                    ${movie.Poster && movie.Poster !== 'N/A'
                        ? `<img src="${movie.Poster}" alt="${movie.Title}" class="dropdown-poster">`
                        : '<div class="dropdown-poster" style="background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center;"><i class="fas fa-film"></i></div>'
                    }
                    <div class="dropdown-info">
                        <p class="dropdown-title">${movie.Title}</p>
                        <p class="dropdown-year">${movie.Year}</p>
                    </div>
                </div>
            `).join('')}
        `;
        
        dropdown.classList.add('active');
        
        // Add click listeners
        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const movieId = item.dataset.id;
                const movie = movies.find(m => m.imdbID === movieId);
                this.addFavorite(movie);
            });
        });
    }
    
    // Hide favorite dropdown
    hideFavoriteDropdown() {
        document.getElementById('favoriteSearchResults').classList.remove('active');
    }
    
    // Add favorite movie
    addFavorite(movie) {
        // Check if already added
        if (this.favoriteMovies.some(m => m.imdbID === movie.imdbID)) {
            this.showNotification('This movie is already in your list', 'warning');
            return;
        }
        
        // Check limit
        if (this.favoriteMovies.length >= 5) {
            this.showNotification('Maximum 5 movies in your list', 'warning');
            return;
        }
        
        this.favoriteMovies.push(movie);
        this.saveFavoritesToStorage();
        this.displayFavorites();
        
        // Clear search
        document.getElementById('favoriteSearch').value = '';
        this.hideFavoriteDropdown();
        
        this.showNotification(`${movie.Title} added to your list`, 'success');
    }
    
    // Display favorites
    displayFavorites() {
        const container = document.getElementById('favoritesContainer');
        
        if (this.favoriteMovies.length === 0) {
            container.innerHTML = '';
            document.getElementById('getRecommendationsBtn').disabled = true;
            return;
        }
        
        document.getElementById('getRecommendationsBtn').disabled = false;
        
        container.innerHTML = this.favoriteMovies.map(movie => `
            <div class="favorite-movie-card">
                <button class="remove-favorite-btn" data-id="${movie.imdbID}">
                    <i class="fas fa-times"></i>
                </button>
                ${movie.Poster && movie.Poster !== 'N/A' 
                    ? `<img src="${movie.Poster}" alt="${movie.Title}" class="favorite-movie-poster">`
                    : '<div class="favorite-movie-poster" style="background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center;"><i class="fas fa-film" style="font-size: 3rem; color: var(--text-muted);"></i></div>'
                }
                <h4 class="favorite-movie-title">${movie.Title}</h4>
                <p class="favorite-movie-year">${movie.Year}</p>
            </div>
        `).join('');
        
        // Add remove listeners
        container.querySelectorAll('.remove-favorite-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const movieId = btn.dataset.id;
                this.removeFavorite(movieId);
            });
        });
    }
    
    // Remove favorite
    removeFavorite(movieId) {
        const movie = this.favoriteMovies.find(m => m.imdbID === movieId);
        this.favoriteMovies = this.favoriteMovies.filter(m => m.imdbID !== movieId);
        this.saveFavoritesToStorage();
        this.displayFavorites();
        
        if (movie) {
            this.showNotification(`${movie.Title} removed from your list`, 'info');
        }
    }
    
    // Clear favorites
    clearFavorites() {
        if (this.favoriteMovies.length === 0) {
            this.showNotification('Your list is already empty', 'warning');
            return;
        }
        
        this.favoriteMovies = [];
        this.saveFavoritesToStorage();
        this.displayFavorites();
        this.showNotification('List cleared', 'success');
    }
    
    // Get recommendations
    async getRecommendations() {
        if (this.favoriteMovies.length === 0) {
            this.showNotification('You need at least one movie in your list', 'warning');
            return;
        }
        
        if (!this.hasApiKey || !this.apiKey || this.apiKey === 'demo') {
            this.showNotification('Configure an API key to get recommendations', 'warning');
            this.showAPIKeySetup();
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Get recommendations for all favorite movies
            const recommendationsPromises = this.favoriteMovies.map(movie => 
                fetch(`${this.apiBase}/?apikey=${this.apiKey}&s=${encodeURIComponent(movie.Genre.split(',')[0])}&type=movie`)
                    .then(res => res.json())
                    .then(data => data.Search ? data.Search : [])
                    .catch(() => [])
            );
            
            const allRecommendations = await Promise.all(recommendationsPromises);
            const flatRecommendations = allRecommendations.flat();
            
            // Get unique IDs
            const uniqueIds = [...new Set(flatRecommendations.map(m => m.imdbID))];
            
            // Filter out favorites
            const filteredIds = uniqueIds.filter(id => 
                !this.favoriteMovies.some(fav => fav.imdbID === id)
            );
            
            // Get detailed info for recommendations
            const detailedRecs = await Promise.all(
                filteredIds.slice(0, 10).map(id => this.getMovieDetails(id))
            );
            
            const recommendations = detailedRecs.filter(m => m && m.Response !== 'False');
            
            this.displayRecommendations(recommendations);
            
        } catch (error) {
            console.error('Error getting recommendations:', error);
            this.showNotification('Error getting recommendations', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    // Display recommendations
    displayRecommendations(movies) {
        const container = document.getElementById('recommendationsResults');
        
        if (movies.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <p>No recommendations found</p>
                    <span>Try adding more movies to your list</span>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <h3 style="margin-bottom: var(--space-6); color: var(--text-primary); text-align: center;">
                <i class="fas fa-magic"></i> Recommendations for You
            </h3>
            <div class="movies-grid">
                ${movies.map(movie => this.createMovieCard(movie)).join('')}
            </div>
        `;
    }
    
    // Save favorites to localStorage
    saveFavoritesToStorage() {
        localStorage.setItem('movieAppFavorites', JSON.stringify(this.favoriteMovies));
    }
    
    // Load favorites from localStorage
    loadFavoritesFromStorage() {
        const stored = localStorage.getItem('movieAppFavorites');
        
        if (!stored) return;
        
        try {
            this.favoriteMovies = JSON.parse(stored);
            this.displayFavorites();
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
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
    
    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // Show movie details modal
    async showMovieDetails(imdbID) {
        // Check if we have API key for demo movies
        if (!this.hasApiKey || !this.apiKey || this.apiKey === 'demo') {
            this.showNotification('Configure an API key to view details', 'warning');
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Get detailed movie info
            const movie = await this.getMovieDetails(imdbID);
            
            if (!movie || movie.Response === 'False') {
                this.showNotification('Could not load movie details', 'error');
                return;
            }
            
            // Create modal content
            this.createMovieModal(movie);
            
            // Show modal
            document.getElementById('movieModal').classList.add('active');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
        } catch (error) {
            console.error('Error loading movie details:', error);
            this.showNotification('Error loading movie details', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    // Create movie modal content
    createMovieModal(movie) {
        const modalBody = document.getElementById('movieModalBody');
        
        const poster = movie.Poster && movie.Poster !== 'N/A'
            ? `<img src="${movie.Poster}" alt="${movie.Title}" class="movie-detail-poster">`
            : '<div class="movie-detail-poster" style="background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center;"><i class="fas fa-film" style="font-size: 4rem; color: var(--text-muted);"></i></div>';
        
        const rating = movie.imdbRating && movie.imdbRating !== 'N/A'
            ? `<div class="movie-detail-rating"><i class="fas fa-star"></i> ${movie.imdbRating}/10</div>`
            : '';
        
        const genres = movie.Genre && movie.Genre !== 'N/A'
            ? movie.Genre.split(',').map(g => g.trim())
            : [];
        
        const directors = movie.Director && movie.Director !== 'N/A' ? movie.Director : 'N/A';
        const writers = movie.Writer && movie.Writer !== 'N/A' ? movie.Writer.split(',')[0] : 'N/A';
        const actors = movie.Actors && movie.Actors !== 'N/A' ? movie.Actors : 'N/A';
        const awards = movie.Awards && movie.Awards !== 'N/A' ? movie.Awards : 'N/A';
        const boxOffice = movie.BoxOffice && movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'N/A';
        const production = movie.Production && movie.Production !== 'N/A' ? movie.Production : 'N/A';
        const runtime = movie.Runtime && movie.Runtime !== 'N/A' ? movie.Runtime : 'N/A';
        const released = movie.Released && movie.Released !== 'N/A' ? movie.Released : 'N/A';
        const plot = movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'No plot available.';
        
        modalBody.innerHTML = `
            <div class="movie-detail-content">
                ${poster}
                <div class="movie-detail-info">
                    <div class="movie-detail-header">
                        <div>
                            <h2 class="movie-detail-title">${movie.Title}</h2>
                            <p class="movie-detail-year">${movie.Year} ${movie.Rated && movie.Rated !== 'N/A' ? `· ${movie.Rated}` : ''}</p>
                        </div>
                        ${rating}
                    </div>
                    
                    <div class="movie-detail-meta">
                        ${runtime !== 'N/A' ? `<div class="meta-item"><i class="fas fa-clock"></i> ${runtime}</div>` : ''}
                        ${released !== 'N/A' ? `<div class="meta-item"><i class="fas fa-calendar"></i> ${released}</div>` : ''}
                        ${movie.Language && movie.Language !== 'N/A' ? `<div class="meta-item"><i class="fas fa-language"></i> ${movie.Language}</div>` : ''}
                    </div>
                    
                    ${genres.length > 0 ? `
                        <div class="movie-detail-genres">
                            ${genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                        </div>
                    ` : ''}
                    
                    <p class="movie-detail-plot">${plot}</p>
                    
                    ${awards !== 'N/A' ? `
                        <div class="movie-detail-awards">
                            <div class="movie-detail-awards-label"><i class="fas fa-trophy"></i> Awards</div>
                            <div class="movie-detail-awards-value">${awards}</div>
                        </div>
                    ` : ''}
                    
                    <div class="movie-detail-cast">
                        ${directors !== 'N/A' ? `
                            <div class="cast-item">
                                <span class="cast-label">Director</span>
                                <span class="cast-value">${directors}</span>
                            </div>
                        ` : ''}
                        ${writers !== 'N/A' ? `
                            <div class="cast-item">
                                <span class="cast-label">Writer</span>
                                <span class="cast-value">${writers}</span>
                            </div>
                        ` : ''}
                        ${actors !== 'N/A' ? `
                            <div class="cast-item">
                                <span class="cast-label">Actors</span>
                                <span class="cast-value">${actors}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${boxOffice !== 'N/A' ? `
                        <div class="movie-detail-box-office">
                            <div class="box-office-item">
                                <div class="box-office-label">Box Office</div>
                                <div class="box-office-value">${boxOffice}</div>
                            </div>
                            ${production !== 'N/A' ? `
                                <div class="box-office-item">
                                    <div class="box-office-label">Production</div>
                                    <div class="box-office-value">${production}</div>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Close movie modal
    closeMovieModal() {
        document.getElementById('movieModal').classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Add notification and modal styles
const additionalStyles = `
    .notification {
        position: fixed;
        top: 100px;
        right: 2rem;
        background: var(--bg-card);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: 1rem 1.5rem;
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        opacity: 0;
        transform: translateX(400px);
        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 300px;
        max-width: 500px;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .notification-success {
        border-color: var(--success-color);
    }
    
    .notification-error {
        border-color: var(--error-color);
    }
    
    .notification-warning {
        border-color: var(--warning-color);
    }
    
    .notification-info {
        border-color: var(--primary-color);
    }
    
    .notification i {
        font-size: 1.25rem;
    }
    
    .notification-success i {
        color: var(--success-color);
    }
    
    .notification-error i {
        color: var(--error-color);
    }
    
    .notification-warning i {
        color: var(--warning-color);
    }
    
    .notification-info i {
        color: var(--primary-color);
    }
    
    .notification span {
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .api-key-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .api-key-content {
        background: var(--bg-card);
        border-radius: var(--radius-2xl);
        padding: 2rem;
        max-width: 600px;
        width: 90%;
        box-shadow: var(--shadow-2xl);
        border: 2px solid var(--border-color);
        animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .api-key-header {
        margin-bottom: 1.5rem;
    }
    
    .api-key-header h3 {
        color: var(--text-primary);
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .api-key-body p {
        color: var(--text-secondary);
        margin-bottom: 1rem;
        line-height: 1.6;
    }
    
    .api-key-steps {
        background: var(--bg-secondary);
        padding: 1.25rem;
        border-radius: var(--radius-lg);
        margin-bottom: 1.5rem;
    }
    
    .api-key-steps .step {
        margin: 0.5rem 0;
        color: var(--text-primary);
    }
    
    .api-key-steps a {
        color: var(--primary-color);
        text-decoration: none;
    }
    
    .api-key-steps a:hover {
        text-decoration: underline;
    }
    
    .api-key-input {
        width: 100%;
        padding: 0.875rem 1.25rem;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-lg);
        color: var(--text-primary);
        font-size: 1rem;
        margin-bottom: 1.5rem;
        font-family: var(--font-family);
    }
    
    .api-key-input:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    
    .api-key-actions {
        display: flex;
        gap: 1rem;
    }
    
    .btn-save-api, .btn-demo-api {
        flex: 1;
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: var(--radius-lg);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
        font-family: var(--font-family);
    }
    
    .btn-save-api {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
    }
    
    .btn-save-api:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
    }
    
    .btn-demo-api {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 2px solid var(--border-color);
    }
    
    .btn-demo-api:hover {
        border-color: var(--primary-color);
    }
`;
document.head.insertAdjacentHTML('beforeend', `<style>${additionalStyles}</style>`);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MovieApp();
});

// Close dropdown on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-favorite-section')) {
        document.getElementById('favoriteSearchResults').classList.remove('active');
    }
});

// Close movie modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('movieModal');
    if (e.target === modal) {
        app.closeMovieModal();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        app.closeMovieModal();
    }
});