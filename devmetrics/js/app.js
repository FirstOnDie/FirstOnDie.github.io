// app.js - DOM Controller and Charts

// Global Chart instances
let langChartInstance = null;
let repoChartInstance = null;

// DOM Elements
const searchInput = document.getElementById('usernameInput');
const loadingIndicator = document.getElementById('loading-indicator');
const flashContainer = document.getElementById('flash-container');
const flashMessage = document.getElementById('flashMessage');
const dashboardContent = document.getElementById('dashboardContent');

// Colors for Languages
function getLanguageColor(lang) {
    const colors = {
        JavaScript: '#f1e05a', Java: '#b07219', Python: '#3572A5', HTML: '#e34c26',
        CSS: '#563d7c', TypeScript: '#3178c6', C: '#555555', 'C++': '#f34b7d',
        'C#': '#178600', Ruby: '#701516', PHP: '#4F5D95', Go: '#00ADD8', Rust: '#dea584'
    };
    return colors[lang] || '#8b949e';
}

// Chart.js Default Config (Dark Mode)
Chart.defaults.color = '#8b949e';
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

// Main Render Function
async function renderDashboard(username) {
    // UI State: Loading
    flashContainer.classList.add('hidden');
    dashboardContent.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');

    try {
        const data = await getUserData(username);

        // UI State: Success
        loadingIndicator.classList.add('hidden');
        dashboardContent.classList.remove('hidden');

        // 1. Sidebar Profile
        document.getElementById('userAvatar').src = data.profile.avatar_url;
        document.getElementById('userName').textContent = data.profile.name;
        document.getElementById('userLogin').textContent = data.profile.login;
        document.getElementById('userBio').textContent = data.profile.bio || '';
        document.getElementById('userFollowers').textContent = data.profile.followers;
        document.getElementById('userFollowing').textContent = data.profile.following;
        document.getElementById('userPublicRepos').textContent = data.profile.public_repos;
        document.getElementById('userUrl').href = data.profile.html_url;

        // 2. Heatmap Image (Direct SVG injection via reliable external generator)
        // ghchart.rshah.org generates the exact GitHub SVG contribution graph. 
        // We append the hex color for the dark mode accent to blend perfectly.
        const heatmapImg = document.getElementById('heatmapImage');
        heatmapImg.src = `https://ghchart.rshah.org/216e39/${data.profile.login}`;
        heatmapImg.alt = `${data.profile.login}'s Contribution Graph`;
        document.getElementById('heatmapYear').textContent = "Last Year";

        // 3. Render Top Languages Doughnut
        renderLanguagesChart(data.languages);

        // 4. Render Stars per Repo Bar
        renderReposChart(data.topRepos);

        // 5. Overall Stats
        document.getElementById('statStars').textContent = data.stats.stars;
        document.getElementById('statForks').textContent = data.stats.forks;

    } catch (error) {
        // UI State: Error
        loadingIndicator.classList.add('hidden');
        flashMessage.textContent = error.message;
        flashContainer.classList.remove('hidden');
    }
}

// Draw Language Doughnut
function renderLanguagesChart(languagesData) {
    const ctx = document.getElementById('languagesChart').getContext('2d');
    if (langChartInstance) langChartInstance.destroy();

    const labels = Object.keys(languagesData).sort((a, b) => languagesData[b] - languagesData[a]).slice(0, 6);
    const data = labels.map(l => languagesData[l]);
    const bgColors = labels.map(l => getLanguageColor(l));

    if (labels.length === 0) {
        labels.push("None");
        data.push(1);
        bgColors.push("#30363d");
    }

    langChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: bgColors,
                borderWidth: 1,
                borderColor: '#161b22'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: '#c9d1d9' } }
            }
        }
    });
}

// Draw Top Repos Bar
function renderReposChart(topRepos) {
    const ctx = document.getElementById('reposChart').getContext('2d');
    if (repoChartInstance) repoChartInstance.destroy();

    const labels = topRepos.map(r => r.name.length > 15 ? r.name.substring(0, 15) + '...' : r.name);
    const data = topRepos.map(r => r.stars);

    if (labels.length === 0) {
        labels.push("N/A");
        data.push(0);
    }

    repoChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Stars',
                data,
                backgroundColor: '#58a6ff',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: '#30363d' }, ticks: { precision: 0 } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// Event Listeners
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const username = searchInput.value.trim();
        if (username) renderDashboard(username);
    }
});

// Tab Switching Logic
const tabs = document.querySelectorAll('.UnderlineNav-item');
const tabPanes = document.querySelectorAll('.tab-pane');

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active state from all tabs and panes
        tabs.forEach(t => t.classList.remove('selected'));
        tabPanes.forEach(p => p.classList.add('hidden'));

        // Activate the clicked tab and its corresponding pane
        tab.classList.add('selected');
        const targetId = tab.getAttribute('data-target');
        if (targetId) {
            document.getElementById(targetId).classList.remove('hidden');

            // Fix Chart.js 0x0px rendering bug on hidden containers
            if (targetId === 'analytics-content') {
                setTimeout(() => {
                    if (langChartInstance) {
                        langChartInstance.resize();
                        langChartInstance.update();
                    }
                    if (repoChartInstance) {
                        repoChartInstance.resize();
                        repoChartInstance.update();
                    }
                }, 50);
            }
        }
    });
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard('FirstOnDie');
});
