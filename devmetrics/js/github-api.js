// github-api.js - DevMetrics V2 Focuses on Pure Reliability

const API_BASE = 'https://api.github.com/users';

// In-Memory map since we don't have localStorage cache module rewritten yet
// but let's implement a very simple localStorage cache to respect API Limits.
const Cache = {
    get: (key) => {
        const item = localStorage.getItem(key);
        if (!item) return null;
        try {
            const parsed = JSON.parse(item);
            if (Date.now() > parsed.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return parsed.data;
        } catch (e) { return null; }
    },
    set: (key, data, ttlMinutes = 60) => {
        const expiry = Date.now() + (ttlMinutes * 60 * 1000);
        localStorage.setItem(key, JSON.stringify({ data, expiry }));
    }
};

/**
 * Fetch generic endpoint with caching
 */
async function fetchGithub(url, key) {
    const cached = Cache.get(key);
    if (cached) return cached;

    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 404) throw new Error('User not found');
        if (response.status === 403) throw new Error('API rate limit exceeded');
        throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    Cache.set(key, data, 60); // Cache for 60 mins
    return data;
}

/**
 * Main fetcher returning aggregated data for the dashboard
 */
async function getUserData(username) {
    if (!username) throw new Error('Username required');
    username = username.trim();

    // 1. Fetch Profile
    const profile = await fetchGithub(`${API_BASE}/${username}`, `v2_profile_${username}`);

    // 2. Fetch Repositories (Fetch up to 100 for a decent sample)
    const reposRaw = await fetchGithub(`${API_BASE}/${username}/repos?type=owner&sort=updated&per_page=100`, `v2_repos_${username}`);

    // Filter out forks
    const repos = (Array.isArray(reposRaw) ? reposRaw : []).filter(r => !r.fork);

    // 3. Aggregate Stats & Languages
    let totalStars = 0;
    let totalForks = 0;
    const langCounts = {};

    repos.forEach(repo => {
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;

        if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
    });

    // 4. Sort Top Repos by Stars
    const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
        .map(r => ({
            name: r.name,
            stars: r.stargazers_count,
            url: r.html_url
        }));

    return {
        profile: {
            login: profile.login,
            name: profile.name || profile.login,
            avatar_url: profile.avatar_url,
            bio: profile.bio || '',
            followers: profile.followers,
            following: profile.following,
            public_repos: profile.public_repos,
            html_url: profile.html_url
        },
        stats: {
            stars: totalStars,
            forks: totalForks
        },
        languages: langCounts,
        topRepos: topRepos
    };
}
