/**
 * JavaPedia — App (Main Controller)
 * Handles routing, rendering, i18n, sidebar, and search integration.
 */
const App = (() => {
    let currentLang = 'es';
    let currentTheme = 'dark';
    let currentSection = 0;
    let sections = [];

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    function init() {
        // Detect language and theme from URL or localStorage
        const savedLang = localStorage.getItem('javapedia-lang');
        if (savedLang === 'en' || savedLang === 'es') currentLang = savedLang;

        const savedTheme = localStorage.getItem('javapedia-theme');
        if (savedTheme === 'light' || savedTheme === 'dark') currentTheme = savedTheme;

        // Apply theme immediately
        applyTheme();

        // Load content
        loadContent();

        // Sidebar nav
        renderSidebar();

        // Initialize SVG flags
        if (currentLang === 'es') {
            $('#flag-es').style.display = 'block';
            $('#flag-en').style.display = 'none';
        } else {
            $('#flag-es').style.display = 'none';
            $('#flag-en').style.display = 'block';
        }

        // Render first section
        renderSection(0);

        // Event listeners
        bindEvents();

        // Set initial search placeholder
        updateSearchPlaceholder();
    }

    function loadContent() {
        sections = currentLang === 'es' ? CONTENT_ES : CONTENT_EN;
        Search.buildIndex(sections);
    }

    function renderSidebar() {
        const nav = $('#sidebar-nav');
        nav.innerHTML = sections.map((s, i) => `
            <div class="nav-item${i === currentSection ? ' active' : ''}" data-idx="${i}">
                <span class="nav-num">${s.num}</span>
                <span class="nav-label">${s.title}</span>
            </div>
        `).join('');

        // Click handlers
        nav.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.idx, 10);
                renderSection(idx);
                closeSidebar();
            });
        });

        // Update i18n elements
        $$('[data-i18n-es]').forEach(el => {
            el.textContent = currentLang === 'es'
                ? el.dataset.i18nEs
                : el.dataset.i18nEn;
        });
    }

    function renderSection(idx) {
        currentSection = idx;
        const section = sections[idx];
        const content = $('#content');

        // Build HTML
        let html = `
            <article class="article">
                <header class="article-header">
                    <div class="article-num">${currentLang === 'es' ? 'Sección' : 'Section'} ${section.num}</div>
                    <h1 class="article-title">${section.title}</h1>
                </header>
                <div class="article-body">${section.body}</div>
                <div class="article-nav">
        `;

        if (idx > 0) {
            const prev = sections[idx - 1];
            html += `
                <div class="article-nav-btn prev" data-idx="${idx - 1}">
                    <span class="nav-dir">← ${currentLang === 'es' ? 'Anterior' : 'Previous'}</span>
                    <span class="nav-title">${prev.title}</span>
                </div>
            `;
        }
        if (idx < sections.length - 1) {
            const next = sections[idx + 1];
            html += `
                <div class="article-nav-btn next" data-idx="${idx + 1}">
                    <span class="nav-dir">${currentLang === 'es' ? 'Siguiente' : 'Next'} →</span>
                    <span class="nav-title">${next.title}</span>
                </div>
            `;
        }

        html += '</div></article>';
        content.innerHTML = html;

        // Scroll to top
        content.scrollTop = 0;

        // Highlight code with Prism
        content.querySelectorAll('pre code').forEach(block => {
            Prism.highlightElement(block);
        });

        // Copy buttons
        content.querySelectorAll('.code-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.closest('.code-block').querySelector('code').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                        btn.classList.remove('copied');
                    }, 2000);
                });
            });
        });

        // Nav buttons
        content.querySelectorAll('.article-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                renderSection(parseInt(btn.dataset.idx, 10));
            });
        });

        // Update sidebar active state
        $$('.nav-item').forEach((item, i) => {
            item.classList.toggle('active', i === idx);
        });

        // Scroll sidebar active item into view
        const activeItem = $('.nav-item.active');
        if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
    }

    function bindEvents() {
        // Theme toggle
        $('#theme-toggle').addEventListener('click', toggleTheme);

        // Language toggle
        $('#lang-toggle').addEventListener('click', toggleLanguage);

        // Sidebar toggle (mobile)
        $('#menu-toggle').addEventListener('click', toggleSidebar);
        $('#sidebar-overlay').addEventListener('click', closeSidebar);

        // Search
        const input = $('#search-input');
        const overlay = $('#search-overlay');
        const results = $('#search-results');
        const clearBtn = $('#search-clear');
        let debounce;

        input.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                const q = input.value.trim();
                clearBtn.style.display = q ? 'block' : 'none';

                if (q.length >= 2) {
                    const hits = Search.search(q);
                    showSearchResults(hits, q);
                } else {
                    overlay.classList.remove('active');
                }
            }, 200);
        });

        input.addEventListener('focus', () => {
            if (input.value.trim().length >= 2) {
                overlay.classList.add('active');
            }
        });

        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            overlay.classList.remove('active');
            input.focus();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });

        // Ctrl+K shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                input.focus();
                input.select();
            }
            if (e.key === 'Escape') {
                overlay.classList.remove('active');
                input.blur();
            }
        });

        // Scroll to top
        const scrollTopBtn = $('#scroll-top');
        const contentEl = $('#content');
        contentEl.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', contentEl.scrollTop > 400);
        });
        scrollTopBtn.addEventListener('click', () => {
            contentEl.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Logo click → go to section 0
        $('#logo-link').addEventListener('click', (e) => {
            e.preventDefault();
            renderSection(0);
        });
    }

    function showSearchResults(hits, query) {
        const overlay = $('#search-overlay');
        const results = $('#search-results');

        if (hits.length === 0) {
            const noMsg = currentLang === 'es'
                ? 'No se encontraron resultados'
                : 'No results found';
            results.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>${noMsg}</p>
                </div>
            `;
        } else {
            results.innerHTML = hits.map(hit => `
                <div class="search-result-item" data-idx="${hit.sectionIdx}">
                    <div class="search-result-section">${hit.sectionNum} — ${hit.sectionTitle}</div>
                    <div class="search-result-excerpt">${Search.highlight(hit.excerpt, query)}</div>
                </div>
            `).join('');

            results.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const idx = parseInt(item.dataset.idx, 10);
                    renderSection(idx);
                    overlay.classList.remove('active');
                    $('#search-input').value = '';
                    $('#search-clear').style.display = 'none';
                });
            });
        }

        overlay.classList.add('active');
    }

    function toggleTheme() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('javapedia-theme', currentTheme);
        applyTheme();
    }

    function applyTheme() {
        const icon = $('#theme-icon');
        if (currentTheme === 'light') {
            document.body.classList.add('light-theme');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            document.body.classList.remove('light-theme');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    function toggleLanguage() {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('javapedia-lang', currentLang);

        if (currentLang === 'es') {
            $('#flag-es').style.display = 'block';
            $('#flag-en').style.display = 'none';
        } else {
            $('#flag-es').style.display = 'none';
            $('#flag-en').style.display = 'block';
        }

        // Reload content
        loadContent();
        renderSidebar();
        renderSection(currentSection);
        updateSearchPlaceholder();

        // Update page title
        document.title = currentLang === 'es'
            ? 'JavaPedia — Enciclopedia Java Completa'
            : 'JavaPedia — Complete Java Encyclopedia';
    }

    function updateSearchPlaceholder() {
        const input = $('#search-input');
        input.placeholder = currentLang === 'es'
            ? input.dataset.placeholderEs
            : input.dataset.placeholderEn;
    }

    function toggleSidebar() {
        $('#sidebar').classList.toggle('open');
        $('#sidebar-overlay').classList.toggle('active');
    }

    function closeSidebar() {
        $('#sidebar').classList.remove('open');
        $('#sidebar-overlay').classList.remove('active');
    }

    document.addEventListener('DOMContentLoaded', init);
    return {};
})();
