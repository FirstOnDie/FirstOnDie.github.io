/**
 * JavaPedia — Search Engine
 * Client-side full-text search with instant results and highlighting.
 */
const Search = (() => {
    let index = [];

    /**
     * Build search index from content sections
     */
    function buildIndex(sections) {
        index = [];
        sections.forEach((section, i) => {
            // Index the section itself
            const plainText = stripHTML(section.body);
            index.push({
                sectionIdx: i,
                sectionId: section.id,
                sectionNum: section.num,
                sectionTitle: section.title,
                title: section.title,
                text: plainText,
                type: 'section',
            });
        });
    }

    /**
     * Search for a query, returns ranked results
     */
    function search(query) {
        if (!query || query.length < 2) return [];

        const terms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
        if (terms.length === 0) return [];

        const results = [];

        index.forEach(entry => {
            const titleLower = entry.title.toLowerCase();
            const textLower = entry.text.toLowerCase();
            let score = 0;

            terms.forEach(term => {
                // Title match (highest weight)
                if (titleLower.includes(term)) score += 10;
                // Text match
                const count = countOccurrences(textLower, term);
                score += Math.min(count, 5); // Cap at 5 per term
            });

            if (score > 0) {
                // Get excerpt around first match
                const excerpt = getExcerpt(entry.text, terms[0], 100);
                results.push({
                    ...entry,
                    score,
                    excerpt,
                });
            }
        });

        // Sort by score descending
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, 15);
    }

    /**
     * Count occurrences of a term in text
     */
    function countOccurrences(text, term) {
        let count = 0, pos = 0;
        while ((pos = text.indexOf(term, pos)) !== -1) {
            count++;
            pos += term.length;
        }
        return count;
    }

    /**
     * Get excerpt around a match
     */
    function getExcerpt(text, term, radius) {
        const lower = text.toLowerCase();
        const idx = lower.indexOf(term.toLowerCase());
        if (idx === -1) return text.substring(0, radius * 2);

        const start = Math.max(0, idx - radius);
        const end = Math.min(text.length, idx + term.length + radius);
        let excerpt = '';
        if (start > 0) excerpt += '...';
        excerpt += text.substring(start, end);
        if (end < text.length) excerpt += '...';
        return excerpt;
    }

    /**
     * Highlight matches in text
     */
    function highlight(text, query) {
        if (!query) return text;
        const terms = query.split(/\s+/).filter(t => t.length >= 2);
        let result = text;
        terms.forEach(term => {
            const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
            result = result.replace(regex, '<mark>$1</mark>');
        });
        return result;
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function stripHTML(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    return { buildIndex, search, highlight };
})();
