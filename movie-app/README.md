# 🎬 Movie Discovery App

Modern web application for searching movies and receiving personalized recommendations based on your taste.

## ✨ Features

### 🔍 Movie Search
- Search any movie by title
- View detailed information (poster, rating, year, plot, genres)
- Professional and responsive card design

### ⭐ Recommendations System
- Add up to 5 movies you loved
- Receive personalized recommendations based on your favorites
- Smart algorithm that aggregates similar recommendations
- Local storage of your preferences

### 🎨 Design
- Modern and professional interface
- Elegant color scheme with gradients
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions

### 🔍 Dynamic Search
- Real-time search with OMDb API
- Search for any existing movie
- Guided API key setup
- Demo mode available

## 🛠️ Technologies

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS variables
- **JavaScript** - Interactive functionality
- **OMDb API** - Free movie API (1,000 searches/day)
- **Font Awesome** - Professional icons
- **Google Fonts** - Poppins & Montserrat typography

## 🚀 Quick Start

### Quick Setup:
1. Open `index.html` in your browser
2. A modal will appear to set up your API key
3. Get a free API key at [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
4. Paste your API key and you're ready!

### Serve Locally:
```bash
python -m http.server 8000
# Visit http://localhost:8000/movie-app
```

## 📖 Usage

### Search Movies
1. Click on "Search Movies"
2. Type the movie title in the search bar
3. Click "Search" or press Enter
4. Explore results in cards

### Get Recommendations
1. Click on "Get Recommendations"
2. Search and add movies you loved (maximum 5)
3. Click "Get Recommendations"
4. Discover new movies similar to your favorites

## 🔑 OMDb API

This application uses the OMDb API:
- **Docs:** https://www.omdbapi.com/
- **Rate Limits:** 1,000 searches per day (free)
- **Includes:** Real posters, ratings, genres, plot, detailed information
- **Free:** Yes, with simple registration
- **Guided Modal:** Step-by-step setup included

## 📱 Responsive Design

The application perfectly adapts to:
- 📱 Mobile (< 480px)
- 📱 Tablets (480px - 768px)
- 💻 Desktop (> 768px)

## 🎯 Technical Features

### Local Storage
- Automatically saves your favorite movies
- Persists between sessions

### Debounce Search
- Optimized search with delay
- Reduces unnecessary API calls

### State Management
- Reactive app state
- Automatic UI updates

### Notifications
- Visual feedback for all actions
- Multiple types: success, error, warning, info

## 🚀 Deployment on GitHub Pages

1. Upload files to your repository
2. Go to "Settings" → "Pages"
3. Select "main" branch
4. Your app will be available at `https://username.github.io/repository/movie-app`

**✅ Note:** Your API key is stored locally in your browser, it's not shared with anyone. If you prefer not to use an API key, the app works in demo mode with example data.

## 📝 License

This project is developed for personal portfolio.

## 👤 Author

**Carlos Expósito**
- Portfolio: [firstondie.github.io](https://firstondie.github.io)
- Full Stack Developer

---

**Powered by [OMDb API](https://www.omdbapi.com/)**