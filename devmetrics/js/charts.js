// Global chart instances
let langsChartInstance = null;
let commitsChartInstance = null;
let activityChartInstance = null;

// Global Chart.js defaults for Dark Theme
Chart.defaults.color = '#94a3b8'; // slate-400
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.05)';

function renderCharts(data) {
    if (data.languages) renderLanguagesChart(data.languages);

    // Multi-year Weekly Commits
    if (data.commitsByDay && data.years && data.commitsByDay[data.years[0]]) {
        renderCommitsChart(data.commitsByDay[data.years[0]]);
    } else if (data.commitsByDay) {
        renderCommitsChart(data.commitsByDay);
    }

    // Check if we have multi-year data dict and pick the top one
    if (data.activityByYear && data.years && data.years.length > 0) {
        renderActivityChart(data.activityByYear[data.years[0]]);
    } else if (data.activity) {
        renderActivityChart(data.activity);
    }
}

function renderLanguagesChart(languagesData) {
    const ctx = document.getElementById('languagesChart').getContext('2d');

    // Sort and take top 5
    const sortedLangs = Object.entries(languagesData)
        .sort((a, b) => b[1].value - a[1].value)
        .slice(0, 5);

    const labels = sortedLangs.map(item => item[0]);
    const values = sortedLangs.map(item => item[1].value);
    const bgColors = sortedLangs.map(item => item[1].color);

    if (langsChartInstance) {
        langsChartInstance.destroy();
    }

    langsChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: bgColors,
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#f8fafc',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
}

function renderCommitsChart(commitsData) {
    const ctx = document.getElementById('commitsChart').getContext('2d');

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = labels.map(day => commitsData[day] || 0);

    if (commitsChartInstance) {
        commitsChartInstance.destroy();
    }

    commitsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Commits',
                data: values,
                backgroundColor: '#3b82f6', // primary blue
                borderRadius: 4,
                hoverBackgroundColor: '#60a5fa'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    border: { display: false }
                },
                x: {
                    grid: { display: false },
                    border: { display: false }
                }
            }
        }
    });
}

function renderActivityChart(activityData) {
    const ctx = document.getElementById('activityChart').getContext('2d');

    const labels = activityData.map(d => d.month);
    const values = activityData.map(d => d.commits);

    if (activityChartInstance) {
        activityChartInstance.destroy();
    }

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)'); // emerald-500
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    activityChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Contributions',
                data: values,
                borderColor: '#10b981', // emerald-500
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4, // Smooth curves
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#1e293b',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    border: { display: false }
                },
                x: {
                    grid: { display: false },
                    border: { display: false }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}
