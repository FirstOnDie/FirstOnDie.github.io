// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('usernameInput');
const loadingOverlay = document.getElementById('loadingOverlay');
const errorMessage = document.getElementById('errorMessage');
const dashboardContent = document.getElementById('dashboardContent');
const demoModeBtn = document.getElementById('demoModeBtn');

// Initialize the App
document.addEventListener('DOMContentLoaded', () => {
    // Default user search
    searchUser('FirstOnDie');

    // Event Listeners
    searchBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) searchUser(username);
    });

    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const username = usernameInput.value.trim();
            if (username) searchUser(username);
        }
    });

    demoModeBtn.addEventListener('click', () => {
        errorMessage.classList.add('hidden');
        loadDemoData();
    });

    savePatBtn.addEventListener('click', () => {
        const token = patInput.value.trim();
        if (token) {
            localStorage.setItem('github_pat', token);
            settingsModal.classList.add('hidden');
            // Refresh data with new token
            const username = usernameInput.value.trim() || 'FirstOnDie';
            searchUser(username);
        }
    });

    clearPatBtn.addEventListener('click', () => {
        localStorage.removeItem('github_pat');
        patInput.value = '';
        settingsModal.classList.add('hidden');
        // Refresh data without token
        const username = usernameInput.value.trim() || 'FirstOnDie';
        searchUser(username);
    });
});

async function searchUser(username) {
    try {
        setLoading(true);
        errorMessage.classList.add('hidden');

        const data = await getUserData(username);
        updateDashboard(data);

        setLoading(false);
    } catch (error) {
        setLoading(false);
        console.error(error);
        dashboardContent.classList.add('hidden');
        errorMessage.classList.remove('hidden');

        const errorText = document.getElementById('errorText');
        if (error.message.includes('Rate Limit')) {
            errorText.textContent = "GitHub API rate limit exceeded. Please try demo mode.";
        } else if (error.message.includes('not found')) {
            errorText.textContent = "GitHub user not found. Please check the spelling.";
        } else {
            errorText.textContent = "An error occurred fetching data from GitHub.";
        }
    }
}

async function loadDemoData() {
    setLoading(true);
    try {
        const data = await getFallbackData();
        updateDashboard(data);
        setLoading(false);
    } catch (error) {
        setLoading(false);
        console.error("Failed to load demo data", error);
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function updateDashboard(data) {
    dashboardContent.classList.remove('hidden');

    // 1. Update Profile Card
    document.getElementById('userAvatar').src = data.profile.avatar_url;
    document.getElementById('userName').textContent = data.profile.name;

    const loginLink = document.getElementById('userLogin');
    loginLink.textContent = `@${data.profile.login}`;
    loginLink.href = data.profile.html_url;

    document.getElementById('userBio').textContent = data.profile.bio || '';

    // 2. Count-up Stats
    animateCounter('countRepos', data.profile.public_repos);
    animateCounter('countStars', data.stats.stars);
    // Use forks or following based on data
    animateCounter('countForks', data.stats.forks || 0);
    animateCounter('countFollowers', data.profile.followers);

    window.currentStatsData = data; // Cache data for dropdown filtering

    // 2.5 Setup Year Selector for Annual Chart
    const yearSelect = document.getElementById('yearSelector');
    if (data.years && data.years.length > 0) {
        yearSelect.innerHTML = '';
        data.years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });

        const latestYear = data.years[0];
        yearSelect.value = latestYear;
        yearSelect.classList.remove('hidden');

        // Refresh event listener to avoid duplicates on re-search
        const newYearSelect = yearSelect.cloneNode(true);
        yearSelect.parentNode.replaceChild(newYearSelect, yearSelect);

        newYearSelect.addEventListener('change', (e) => {
            const selectedY = e.target.value;
            if (window.currentStatsData && window.currentStatsData.activityByYear[selectedY]) {
                renderActivityChart(window.currentStatsData.activityByYear[selectedY]);
                // Change Weekly Activity chart to match the selected year
                if (window.currentStatsData.commitsByDay[selectedY]) {
                    renderCommitsChart(window.currentStatsData.commitsByDay[selectedY]);
                }
            }
        });
    } else {
        yearSelect.classList.add('hidden');
    }

    // 3. Render Charts
    renderCharts(data);

    // 4. Update Top Repos List
    updateTopReposList(data.topRepos);
}

function updateTopReposList(repos) {
    const list = document.getElementById('topReposList');
    list.innerHTML = '';

    if (!repos || repos.length === 0) {
        list.innerHTML = '<li class="repo-item" style="text-align:center; color: var(--text-muted)">No public repositories found.</li>';
        return;
    }

    repos.forEach(repo => {
        const li = document.createElement('li');
        li.className = 'repo-item';

        // Use a generic logic for language color if not mapped in API
        const langHtml = repo.language ?
            `<span class="repo-stat-item"><span class="repo-language-dot" style="background-color: var(--primary)"></span> ${repo.language}</span>` : '';

        li.innerHTML = `
            <div class="repo-header">
                <a href="${repo.url}" target="_blank" class="repo-name">${repo.name}</a>
            </div>
            <div class="repo-stats">
                <span class="repo-stat-item"><i class="fas fa-star"></i> ${repo.stars}</span>
                <span class="repo-stat-item"><i class="fas fa-code-branch"></i> ${repo.forks}</span>
                ${langHtml}
            </div>
        `;
        list.appendChild(li);
    });
}
