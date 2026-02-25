/**
 * InfraViz — AWS Service SVG Icons (inline)
 * Simplified AWS-style icons for each cloud service.
 */
const Icons = (() => {
    const COLORS = {
        compute: '#FF9900',
        storage: '#3B48CC',
        database: '#2E73B8',
        network: '#8C4FFF',
        messaging: '#E7157B',
        analytics: '#01A88D',
        security: '#DD344C',
        frontend: '#F5A623',
    };

    const BG = {
        compute: 'rgba(255,153,0,0.12)',
        storage: 'rgba(59,72,204,0.12)',
        database: 'rgba(46,115,184,0.12)',
        network: 'rgba(140,79,255,0.12)',
        messaging: 'rgba(231,21,123,0.12)',
        analytics: 'rgba(1,168,141,0.12)',
        security: 'rgba(221,52,76,0.12)',
        frontend: 'rgba(245,166,35,0.12)',
    };

    // Simplified AWS-style SVG icons
    const svgs = {
        ec2: (c) => `<svg viewBox="0 0 40 40"><rect x="4" y="8" width="32" height="24" rx="3" fill="none" stroke="${c}" stroke-width="2"/><circle cx="20" cy="20" r="6" fill="none" stroke="${c}" stroke-width="2"/><line x1="20" y1="14" x2="20" y2="8" stroke="${c}" stroke-width="1.5"/><line x1="20" y1="26" x2="20" y2="32" stroke="${c}" stroke-width="1.5"/></svg>`,
        lambda: (c) => `<svg viewBox="0 0 40 40"><path d="M8 32 L16 8 L22 8 L28 24 L34 8" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 24 L34 32" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/><line x1="6" y1="32" x2="36" y2="32" stroke="${c}" stroke-width="1.5"/></svg>`,
        ecs: (c) => `<svg viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" rx="4" fill="none" stroke="${c}" stroke-width="2"/><rect x="11" y="12" width="8" height="6" rx="1" fill="${c}" opacity="0.3"/><rect x="21" y="12" width="8" height="6" rx="1" fill="${c}" opacity="0.3"/><rect x="11" y="22" width="8" height="6" rx="1" fill="${c}" opacity="0.3"/><rect x="21" y="22" width="8" height="6" rx="1" fill="${c}" opacity="0.5"/></svg>`,
        fargate: (c) => `<svg viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" rx="14" fill="none" stroke="${c}" stroke-width="2"/><rect x="13" y="14" width="14" height="12" rx="2" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="20" cy="20" r="3" fill="${c}" opacity="0.5"/></svg>`,
        s3: (c) => `<svg viewBox="0 0 40 40"><path d="M20 4 L34 12 L34 28 L20 36 L6 28 L6 12 Z" fill="none" stroke="${c}" stroke-width="2"/><line x1="6" y1="12" x2="34" y2="12" stroke="${c}" stroke-width="1" opacity="0.4"/><line x1="6" y1="28" x2="34" y2="28" stroke="${c}" stroke-width="1" opacity="0.4"/><line x1="20" y1="4" x2="20" y2="36" stroke="${c}" stroke-width="1" opacity="0.4"/></svg>`,
        rds: (c) => `<svg viewBox="0 0 40 40"><ellipse cx="20" cy="12" rx="14" ry="5" fill="none" stroke="${c}" stroke-width="2"/><path d="M6 12 v16 c0 2.8 6.3 5 14 5 s14-2.2 14-5 V12" fill="none" stroke="${c}" stroke-width="2"/><ellipse cx="20" cy="20" rx="14" ry="5" fill="none" stroke="${c}" stroke-width="1" opacity="0.3"/></svg>`,
        dynamodb: (c) => `<svg viewBox="0 0 40 40"><ellipse cx="20" cy="12" rx="12" ry="5" fill="none" stroke="${c}" stroke-width="2"/><path d="M8 12 v16 c0 2.8 5.4 5 12 5 s12-2.2 12-5 V12" fill="none" stroke="${c}" stroke-width="2"/><path d="M14 18 h12 M14 24 h12" stroke="${c}" stroke-width="1.5" opacity="0.5"/></svg>`,
        elasticache: (c) => `<svg viewBox="0 0 40 40"><rect x="6" y="10" width="28" height="20" rx="3" fill="none" stroke="${c}" stroke-width="2"/><circle cx="15" cy="20" r="3" fill="${c}" opacity="0.3"/><circle cx="25" cy="20" r="3" fill="${c}" opacity="0.3"/><line x1="18" y1="20" x2="22" y2="20" stroke="${c}" stroke-width="1.5"/></svg>`,
        alb: (c) => `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="${c}" stroke-width="2"/><path d="M12 16 h16 M12 20 h16 M12 24 h16" stroke="${c}" stroke-width="1.5" opacity="0.5"/><circle cx="20" cy="20" r="4" fill="${c}" opacity="0.3"/></svg>`,
        cloudfront: (c) => `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="${c}" stroke-width="2"/><ellipse cx="20" cy="20" rx="7" ry="14" fill="none" stroke="${c}" stroke-width="1.2" opacity="0.5"/><line x1="6" y1="20" x2="34" y2="20" stroke="${c}" stroke-width="1.2" opacity="0.5"/></svg>`,
        apigateway: (c) => `<svg viewBox="0 0 40 40"><rect x="14" y="6" width="12" height="28" rx="3" fill="none" stroke="${c}" stroke-width="2"/><path d="M6 14 h8 M6 20 h8 M6 26 h8" stroke="${c}" stroke-width="1.5"/><path d="M26 14 h8 M26 20 h8 M26 26 h8" stroke="${c}" stroke-width="1.5"/></svg>`,
        vpc: (c) => `<svg viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="4" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="4 2"/><rect x="10" y="10" width="20" height="20" rx="2" fill="none" stroke="${c}" stroke-width="1.2" opacity="0.4"/></svg>`,
        sqs: (c) => `<svg viewBox="0 0 40 40"><rect x="6" y="10" width="28" height="20" rx="3" fill="none" stroke="${c}" stroke-width="2"/><path d="M12 17 h6 M12 20 h10 M12 23 h8" stroke="${c}" stroke-width="1.5" opacity="0.5"/><path d="M28 15 v10" stroke="${c}" stroke-width="1.5"/><path d="M25 18 l3-3 3 3" stroke="${c}" stroke-width="1.5" fill="none"/></svg>`,
        sns: (c) => `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="6" fill="none" stroke="${c}" stroke-width="2"/><circle cx="10" cy="10" r="3" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="30" cy="10" r="3" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="10" cy="30" r="3" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="30" cy="30" r="3" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="16" y1="16" x2="12" y2="12" stroke="${c}" stroke-width="1"/><line x1="24" y1="16" x2="28" y2="12" stroke="${c}" stroke-width="1"/><line x1="16" y1="24" x2="12" y2="28" stroke="${c}" stroke-width="1"/><line x1="24" y1="24" x2="28" y2="28" stroke="${c}" stroke-width="1"/></svg>`,
        kafka: (c) => `<svg viewBox="0 0 40 40"><circle cx="20" cy="14" r="5" fill="none" stroke="${c}" stroke-width="2"/><circle cx="12" cy="28" r="4" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="28" cy="28" r="4" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="17" y1="18" x2="13" y2="25" stroke="${c}" stroke-width="1.5"/><line x1="23" y1="18" x2="27" y2="25" stroke="${c}" stroke-width="1.5"/></svg>`,
        eventbridge: (c) => `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="8" fill="none" stroke="${c}" stroke-width="2"/><path d="M6 20 h6 M28 20 h6 M20 6 v6 M20 28 v6" stroke="${c}" stroke-width="1.5"/><path d="M10 10 l4 4 M26 10 l-4 4 M10 30 l4-4 M26 30 l-4-4" stroke="${c}" stroke-width="1.2"/></svg>`,
        glue: (c) => `<svg viewBox="0 0 40 40"><circle cx="14" cy="14" r="6" fill="none" stroke="${c}" stroke-width="2"/><circle cx="26" cy="26" r="6" fill="none" stroke="${c}" stroke-width="2"/><path d="M18 18 L22 22" stroke="${c}" stroke-width="2"/></svg>`,
        redshift: (c) => `<svg viewBox="0 0 40 40"><rect x="8" y="8" width="24" height="24" rx="3" fill="none" stroke="${c}" stroke-width="2"/><path d="M8 16 h24 M8 24 h24 M16 8 v24 M24 8 v24" stroke="${c}" stroke-width="1" opacity="0.3"/><rect x="12" y="12" width="6" height="6" fill="${c}" opacity="0.2"/><rect x="22" y="20" width="6" height="6" fill="${c}" opacity="0.2"/></svg>`,
        athena: (c) => `<svg viewBox="0 0 40 40"><circle cx="20" cy="16" r="8" fill="none" stroke="${c}" stroke-width="2"/><path d="M14 22 L10 34 L20 30 L30 34 L26 22" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="20" cy="16" r="3" fill="${c}" opacity="0.3"/></svg>`,
        quicksight: (c) => `<svg viewBox="0 0 40 40"><rect x="6" y="8" width="28" height="22" rx="3" fill="none" stroke="${c}" stroke-width="2"/><path d="M12 24 L16 18 L22 22 L28 14" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/><line x1="6" y1="32" x2="34" y2="32" stroke="${c}" stroke-width="1.5"/></svg>`,
        cognito: (c) => `<svg viewBox="0 0 40 40"><circle cx="20" cy="14" r="6" fill="none" stroke="${c}" stroke-width="2"/><path d="M10 32 c0-7 4.5-12 10-12 s10 5 10 12" fill="none" stroke="${c}" stroke-width="2"/></svg>`,
        waf: (c) => `<svg viewBox="0 0 40 40"><path d="M20 4 L34 10 L34 22 c0 7-6 14-14 14 C12 36 6 29 6 22 L6 10 Z" fill="none" stroke="${c}" stroke-width="2"/><path d="M16 20 l3 3 6-6" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        route53: (c) => `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="${c}" stroke-width="2"/><text x="20" y="24" text-anchor="middle" fill="${c}" font-size="10" font-weight="bold" font-family="Inter">53</text></svg>`,
        user: (c) => `<svg viewBox="0 0 40 40"><circle cx="20" cy="14" r="7" fill="none" stroke="${c}" stroke-width="2"/><path d="M8 34 c0-8 5.5-14 12-14 s12 6 12 14" fill="none" stroke="${c}" stroke-width="2"/></svg>`,
    };

    /**
     * Get SVG string for a service
     */
    function getSVG(service, category) {
        const color = COLORS[category] || '#8892b0';
        const fn = svgs[service];
        return fn ? fn(color) : svgs.ec2(color);
    }

    /**
     * Create a vis.js-friendly data URL from SVG
     */
    function getDataURL(service, category) {
        const svg = getSVG(service, category);
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    return { COLORS, BG, getSVG, getDataURL };
})();
