// Physics Lab — Interactive Simulations
class PhysicsSimulator {
    constructor() {
        this.currentSimulator = 'pendulum';

        // Simulator states
        this.pendulumState = { running: false, animationId: null };
        this.orbitState = { running: false, paused: false, animationId: null };
        this.waveState = { running: false, animationId: null, time: 0 };
        this.projectileState = { running: false, animationId: null, trail: [] };

        // Colors (NASA Lab theme)
        this.colors = {
            bg: '#0b1526',
            grid: 'rgba(0, 212, 255, 0.06)',
            gridLine: 'rgba(0, 212, 255, 0.08)',
            orange: '#ff6b35',
            ice: '#00d4ff',
            lime: '#39ff14',
            white: '#e8edf5',
            dim: 'rgba(255,255,255,0.3)',
            sun: '#ffb700',
            sunStroke: '#ff6b35'
        };

        // Planet data
        this.planets = {
            mercury: { distance: 0.39, velocity: 47.9, period: 88, color: '#8C7853', angle: 0 },
            venus: { distance: 0.72, velocity: 35.0, period: 225, color: '#FFC649', angle: 0 },
            earth: { distance: 1.0, velocity: 29.8, period: 365, color: '#6B93D6', angle: 0 },
            mars: { distance: 1.52, velocity: 24.1, period: 687, color: '#EF4F0D', angle: 0 },
            jupiter: { distance: 5.2, velocity: 13.1, period: 4333, color: '#C88B3A', angle: 0 }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.resizeCanvases();
        this.drawPendulumStatic();
    }

    resizeCanvases() {
        document.querySelectorAll('canvas').forEach(canvas => {
            const wrapper = canvas.parentElement;
            if (wrapper) {
                canvas.width = wrapper.clientWidth;
                canvas.height = wrapper.clientHeight - 40; // leave room for info bar
                if (canvas.height < 300) canvas.height = 300;
            }
        });
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.simulator-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchSimulator(tab.dataset.simulator));
        });

        // Pendulum sliders
        this.bindSlider('mass', 'massValue');
        this.bindSlider('length', 'lengthValue');
        this.bindSlider('damping', 'dampingValue');
        document.getElementById('startPendulum').addEventListener('click', () => this.startPendulum());
        document.getElementById('resetPendulum').addEventListener('click', () => this.resetPendulum());

        // Orbit controls
        this.bindSlider('speed', 'speedValue', 'x');
        document.getElementById('startOrbit').addEventListener('click', () => this.startOrbit());
        document.getElementById('pauseOrbit').addEventListener('click', () => this.pauseOrbit());
        document.getElementById('resetOrbit').addEventListener('click', () => this.resetOrbit());

        // Wave sliders
        this.bindSlider('waveAmplitude', 'waveAmplitudeValue');
        this.bindSlider('waveFrequency', 'waveFrequencyValue');
        this.bindSlider('waveSpeed', 'waveSpeedValue');
        this.bindSlider('waveCount', 'waveCountValue');
        document.getElementById('startWave').addEventListener('click', () => this.startWave());
        document.getElementById('resetWave').addEventListener('click', () => this.resetWave());

        // Projectile sliders
        this.bindSlider('projAngle', 'projAngleValue');
        this.bindSlider('projVelocity', 'projVelocityValue');
        this.bindSlider('projGravity', 'projGravityValue');
        document.getElementById('launchProjectile').addEventListener('click', () => this.launchProjectile());
        document.getElementById('resetProjectile').addEventListener('click', () => this.resetProjectile());
    }

    bindSlider(sliderId, displayId, suffix = '') {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', (e) => {
                document.getElementById(displayId).textContent = e.target.value + suffix;
            });
        }
    }

    switchSimulator(simulator) {
        this.currentSimulator = simulator;
        this.stopAllSimulations();

        document.querySelectorAll('.simulator-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.simulator === simulator);
        });

        document.querySelectorAll('.simulator-content').forEach(content => {
            content.classList.toggle('active', content.id === `${simulator}Simulator`);
        });

        // Resize and draw initial state
        setTimeout(() => {
            this.resizeCanvases();
            if (simulator === 'pendulum') this.drawPendulumStatic();
            else if (simulator === 'orbit') this.drawOrbitStatic();
            else if (simulator === 'wave') this.drawWaveStatic();
            else if (simulator === 'projectile') this.drawProjectileStatic();
        }, 50);
    }

    stopAllSimulations() {
        if (this.pendulumState.animationId) {
            cancelAnimationFrame(this.pendulumState.animationId);
            this.pendulumState.running = false;
        }
        if (this.orbitState.animationId) {
            cancelAnimationFrame(this.orbitState.animationId);
            this.orbitState.running = false;
            this.orbitState.paused = false;
        }
        if (this.waveState.animationId) {
            cancelAnimationFrame(this.waveState.animationId);
            this.waveState.running = false;
        }
        if (this.projectileState.animationId) {
            cancelAnimationFrame(this.projectileState.animationId);
            this.projectileState.running = false;
        }
    }

    drawGrid(ctx, w, h) {
        ctx.strokeStyle = this.colors.gridLine;
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
    }

    // ===== PENDULUM =====
    startPendulum() {
        if (this.pendulumState.running) return;

        const canvas = document.getElementById('pendulumCanvas');
        const ctx = canvas.getContext('2d');
        const length = parseFloat(document.getElementById('length').value);
        const mass = parseFloat(document.getElementById('mass').value);
        const damping = parseFloat(document.getElementById('damping').value);
        const gravity = 9.8;

        let angle = Math.PI / 3;
        let angularVelocity = 0;
        const dt = 0.016;
        const pivotX = canvas.width / 2;
        const pivotY = 80;
        const pixelLength = length * 60;

        this.pendulumState.running = true;

        const animate = () => {
            ctx.fillStyle = this.colors.bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.drawGrid(ctx, canvas.width, canvas.height);

            // Physics
            const angularAcceleration = -(gravity / length) * Math.sin(angle) - damping * angularVelocity;
            angularVelocity += angularAcceleration * dt;
            angle += angularVelocity * dt;

            const x = pivotX + pixelLength * Math.sin(angle);
            const y = pivotY + pixelLength * Math.cos(angle);

            // Rope
            ctx.strokeStyle = this.colors.dim;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(x, y); ctx.stroke();

            // Pivot
            ctx.fillStyle = this.colors.white;
            ctx.beginPath(); ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2); ctx.fill();

            // Bob with glow
            const bobRadius = Math.sqrt(mass) * 8;
            ctx.shadowColor = this.colors.orange;
            ctx.shadowBlur = 15;
            ctx.fillStyle = this.colors.orange;
            ctx.beginPath(); ctx.arc(x, y, bobRadius, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Info
            const period = 2 * Math.PI * Math.sqrt(length / gravity);
            document.getElementById('angle_pendulum').textContent = (angle * 180 / Math.PI).toFixed(1) + '°';
            document.getElementById('period').textContent = period.toFixed(2) + ' s';

            this.pendulumState.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    resetPendulum() {
        this.stopAllSimulations();
        this.drawPendulumStatic();
        document.getElementById('angle_pendulum').textContent = '0°';
        document.getElementById('period').textContent = '0 s';
    }

    drawPendulumStatic() {
        const canvas = document.getElementById('pendulumCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const length = parseFloat(document.getElementById('length').value);
        const mass = parseFloat(document.getElementById('mass').value);

        ctx.fillStyle = this.colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.drawGrid(ctx, canvas.width, canvas.height);

        const pivotX = canvas.width / 2, pivotY = 80;
        const pixelLength = length * 60;
        const angle = Math.PI / 3;
        const x = pivotX + pixelLength * Math.sin(angle);
        const y = pivotY + pixelLength * Math.cos(angle);

        ctx.strokeStyle = this.colors.dim;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(x, y); ctx.stroke();

        ctx.fillStyle = this.colors.white;
        ctx.beginPath(); ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2); ctx.fill();

        const bobRadius = Math.sqrt(mass) * 8;
        ctx.fillStyle = this.colors.orange;
        ctx.beginPath(); ctx.arc(x, y, bobRadius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // ===== ORBIT =====
    setupOrbit() { this.drawOrbitStatic(); }

    startOrbit() {
        if (this.orbitState.running && !this.orbitState.paused) return;

        const canvas = document.getElementById('orbitCanvas');
        const ctx = canvas.getContext('2d');
        const planetSelect = document.getElementById('planetSelect');
        const speedMultiplier = parseFloat(document.getElementById('speed').value);
        const selectedPlanet = this.planets[planetSelect.value];
        const centerX = canvas.width / 2, centerY = canvas.height / 2;

        if (this.orbitState.paused) {
            this.orbitState.paused = false;
            this.orbitState.animationId = requestAnimationFrame(animate);
            return;
        }

        const baseAngularVelocity = speedMultiplier * 0.02;
        this.orbitState.running = true;

        // Persistent stars
        const stars = Array.from({ length: 80 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.2
        }));

        const animate = () => {
            ctx.fillStyle = this.colors.bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Stars
            stars.forEach(s => {
                ctx.fillStyle = `rgba(232,237,245,${0.3 + Math.random() * 0.5})`;
                ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
            });

            // Sun with glow
            ctx.shadowColor = this.colors.sun;
            ctx.shadowBlur = 25;
            ctx.fillStyle = this.colors.sun;
            ctx.beginPath(); ctx.arc(centerX, centerY, 18, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = this.colors.sunStroke;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Planets
            Object.keys(this.planets).forEach(key => {
                const planet = this.planets[key];
                const relativeSpeed = 365 / planet.period;
                planet.angle += baseAngularVelocity * relativeSpeed;
                if (planet.angle > Math.PI * 2) planet.angle -= Math.PI * 2;

                // Orbit path
                ctx.strokeStyle = 'rgba(0, 212, 255, 0.12)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, planet.distance * 80, planet.distance * 80, 0, 0, Math.PI * 2);
                ctx.stroke();

                const x = centerX + planet.distance * 80 * Math.cos(planet.angle);
                const y = centerY + planet.distance * 80 * Math.sin(planet.angle);
                const planetSize = Math.sqrt(planet.distance) * 9;

                ctx.fillStyle = planet.color;
                ctx.beginPath(); ctx.arc(x, y, planetSize, 0, Math.PI * 2); ctx.fill();

                if (key === planetSelect.value) {
                    ctx.strokeStyle = this.colors.orange;
                    ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.arc(x, y, planetSize + 4, 0, Math.PI * 2); ctx.stroke();
                }
            });

            document.getElementById('orbitDistance').textContent = selectedPlanet.distance.toFixed(2) + ' AU';
            document.getElementById('orbitVelocity').textContent = selectedPlanet.velocity.toFixed(1) + ' km/s';
            document.getElementById('orbitPeriod').textContent = selectedPlanet.period + ' days';

            this.orbitState.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    pauseOrbit() { this.orbitState.paused = true; }

    resetOrbit() {
        this.stopAllSimulations();
        Object.values(this.planets).forEach(p => p.angle = 0);
        this.drawOrbitStatic();
        document.getElementById('orbitDistance').textContent = '0 AU';
        document.getElementById('orbitVelocity').textContent = '0 km/s';
        document.getElementById('orbitPeriod').textContent = '0 days';
    }

    drawOrbitStatic() {
        const canvas = document.getElementById('orbitCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const planetSelect = document.getElementById('planetSelect');

        ctx.fillStyle = this.colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2, centerY = canvas.height / 2;

        // Stars
        ctx.fillStyle = 'rgba(232,237,245,0.5)';
        for (let i = 0; i < 80; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Sun
        ctx.fillStyle = this.colors.sun;
        ctx.beginPath(); ctx.arc(centerX, centerY, 18, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = this.colors.sunStroke; ctx.lineWidth = 2; ctx.stroke();

        Object.keys(this.planets).forEach(key => {
            const planet = this.planets[key];
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.12)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, planet.distance * 80, planet.distance * 80, 0, 0, Math.PI * 2);
            ctx.stroke();

            const x = centerX + planet.distance * 80;
            const planetSize = Math.sqrt(planet.distance) * 9;
            ctx.fillStyle = planet.color;
            ctx.beginPath(); ctx.arc(x, centerY, planetSize, 0, Math.PI * 2); ctx.fill();

            if (key === planetSelect.value) {
                ctx.strokeStyle = this.colors.orange;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(x, centerY, planetSize + 4, 0, Math.PI * 2); ctx.stroke();
            }
        });
    }

    // ===== WAVE SIMULATOR =====
    startWave() {
        if (this.waveState.running) return;

        const canvas = document.getElementById('waveCanvas');
        const ctx = canvas.getContext('2d');
        this.waveState.running = true;
        this.waveState.time = 0;

        const waveColors = [this.colors.ice, this.colors.orange, this.colors.lime];

        const animate = () => {
            const amplitude = parseFloat(document.getElementById('waveAmplitude').value);
            const frequency = parseFloat(document.getElementById('waveFrequency').value);
            const speed = parseFloat(document.getElementById('waveSpeed').value);
            const count = parseInt(document.getElementById('waveCount').value);

            ctx.fillStyle = this.colors.bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.drawGrid(ctx, canvas.width, canvas.height);

            const midY = canvas.height / 2;

            // Center line
            ctx.strokeStyle = 'rgba(0,212,255,0.15)';
            ctx.lineWidth = 1;
            ctx.setLineDash([6, 4]);
            ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(canvas.width, midY); ctx.stroke();
            ctx.setLineDash([]);

            // Draw each wave
            for (let w = 0; w < count; w++) {
                const freq = frequency * (1 + w * 0.5);
                const amp = amplitude / (1 + w * 0.3);
                const waveLength = speed / freq;
                const k = (2 * Math.PI) / waveLength;
                const omega = 2 * Math.PI * freq;
                const color = waveColors[w % waveColors.length];

                // Wave fill
                ctx.beginPath();
                ctx.moveTo(0, midY);
                for (let x = 0; x <= canvas.width; x += 2) {
                    const y = midY + amp * Math.sin(k * x - omega * this.waveState.time);
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width, midY);
                ctx.closePath();
                const grad = ctx.createLinearGradient(0, midY - amp, 0, midY + amp);
                grad.addColorStop(0, color.replace(')', ',0.1)').replace('rgb', 'rgba'));
                grad.addColorStop(0.5, 'transparent');
                grad.addColorStop(1, color.replace(')', ',0.1)').replace('rgb', 'rgba'));
                ctx.fillStyle = `${color}11`;
                ctx.fill();

                // Wave line
                ctx.shadowColor = color;
                ctx.shadowBlur = 8;
                ctx.strokeStyle = color;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                for (let x = 0; x <= canvas.width; x += 2) {
                    const y = midY + amp * Math.sin(k * x - omega * this.waveState.time);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Particles along wave
                for (let x = 0; x <= canvas.width; x += 40) {
                    const y = midY + amp * Math.sin(k * x - omega * this.waveState.time);
                    ctx.fillStyle = color;
                    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
                }
            }

            this.waveState.time += 0.016;

            // Info
            const wavelength = speed / frequency;
            const period = 1 / frequency;
            document.getElementById('waveLength').textContent = wavelength.toFixed(0) + ' px';
            document.getElementById('wavePeriod').textContent = period.toFixed(3) + ' s';

            this.waveState.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    resetWave() {
        this.stopAllSimulations();
        this.waveState.time = 0;
        this.drawWaveStatic();
        document.getElementById('waveLength').textContent = '0 px';
        document.getElementById('wavePeriod').textContent = '0 s';
    }

    drawWaveStatic() {
        const canvas = document.getElementById('waveCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = this.colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.drawGrid(ctx, canvas.width, canvas.height);

        const midY = canvas.height / 2;
        ctx.strokeStyle = 'rgba(0,212,255,0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(canvas.width, midY); ctx.stroke();
        ctx.setLineDash([]);

        // Static wave
        const amplitude = parseFloat(document.getElementById('waveAmplitude').value);
        const frequency = parseFloat(document.getElementById('waveFrequency').value);
        const speed = parseFloat(document.getElementById('waveSpeed').value);
        const waveLength = speed / frequency;
        const k = (2 * Math.PI) / waveLength;

        ctx.strokeStyle = this.colors.ice;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 2) {
            const y = midY + amplitude * Math.sin(k * x);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // ===== PROJECTILE MOTION =====
    launchProjectile() {
        if (this.projectileState.running) return;

        const canvas = document.getElementById('projectileCanvas');
        const ctx = canvas.getContext('2d');

        const angleDeg = parseFloat(document.getElementById('projAngle').value);
        const v0 = parseFloat(document.getElementById('projVelocity').value);
        const g = parseFloat(document.getElementById('projGravity').value);
        const angleRad = angleDeg * Math.PI / 180;

        const vx = v0 * Math.cos(angleRad);
        const vy = v0 * Math.sin(angleRad);

        // Total flight time and range
        const totalTime = (2 * vy) / g;
        const maxRange = vx * totalTime;
        const maxHeight = (vy * vy) / (2 * g);

        // Scaling
        const margin = 60;
        const drawW = canvas.width - 2 * margin;
        const drawH = canvas.height - 2 * margin;
        const scaleX = drawW / Math.max(maxRange, 1);
        const scaleY = drawH / Math.max(maxHeight * 1.3, 1);
        const scale = Math.min(scaleX, scaleY);

        const groundY = canvas.height - margin;
        const originX = margin;

        let t = 0;
        const dt = 0.02;
        this.projectileState.trail = [];
        this.projectileState.running = true;

        const animate = () => {
            ctx.fillStyle = this.colors.bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.drawGrid(ctx, canvas.width, canvas.height);

            // Ground line
            ctx.strokeStyle = 'rgba(255,107,53,0.25)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY); ctx.stroke();

            // Predicted arc (dashed)
            ctx.strokeStyle = 'rgba(0,212,255,0.15)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            for (let tp = 0; tp <= totalTime; tp += 0.05) {
                const px = originX + vx * tp * scale;
                const py = groundY - (vy * tp - 0.5 * g * tp * tp) * scale;
                if (tp === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // Current position
            const px = vx * t;
            const py = vy * t - 0.5 * g * t * t;
            const drawX = originX + px * scale;
            const drawY = groundY - py * scale;

            // Trail
            this.projectileState.trail.push({ x: drawX, y: drawY });

            // Draw trail
            if (this.projectileState.trail.length > 1) {
                ctx.strokeStyle = this.colors.orange;
                ctx.lineWidth = 2;
                ctx.shadowColor = this.colors.orange;
                ctx.shadowBlur = 6;
                ctx.beginPath();
                this.projectileState.trail.forEach((p, i) => {
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Trail dots
                this.projectileState.trail.forEach((p, i) => {
                    if (i % 5 === 0) {
                        ctx.fillStyle = this.colors.orange;
                        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
                    }
                });
            }

            // Draw projectile
            ctx.shadowColor = this.colors.orange;
            ctx.shadowBlur = 15;
            ctx.fillStyle = this.colors.orange;
            ctx.beginPath(); ctx.arc(drawX, drawY, 6, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Velocity vector
            const currentVx = vx;
            const currentVy = vy - g * t;
            const vecScale = 0.8;
            ctx.strokeStyle = this.colors.ice;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(drawX + currentVx * vecScale, drawY - currentVy * vecScale);
            ctx.stroke();

            // Arrow head
            const vecAngle = Math.atan2(-currentVy, currentVx);
            const arrowSize = 8;
            ctx.fillStyle = this.colors.ice;
            ctx.beginPath();
            ctx.moveTo(drawX + currentVx * vecScale, drawY - currentVy * vecScale);
            ctx.lineTo(drawX + currentVx * vecScale - arrowSize * Math.cos(vecAngle - 0.4), drawY - currentVy * vecScale + arrowSize * Math.sin(vecAngle - 0.4));
            ctx.lineTo(drawX + currentVx * vecScale - arrowSize * Math.cos(vecAngle + 0.4), drawY - currentVy * vecScale + arrowSize * Math.sin(vecAngle + 0.4));
            ctx.closePath();
            ctx.fill();

            // Update info
            document.getElementById('projMaxHeight').textContent = maxHeight.toFixed(1) + ' m';
            document.getElementById('projRange').textContent = maxRange.toFixed(1) + ' m';
            document.getElementById('projTime').textContent = t.toFixed(2) + ' s';

            t += dt;

            if (py < 0 && t > dt) {
                // Landed
                this.projectileState.running = false;
                document.getElementById('projTime').textContent = totalTime.toFixed(2) + ' s';
                return;
            }

            this.projectileState.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    resetProjectile() {
        this.stopAllSimulations();
        this.projectileState.trail = [];
        this.drawProjectileStatic();
        document.getElementById('projMaxHeight').textContent = '0 m';
        document.getElementById('projRange').textContent = '0 m';
        document.getElementById('projTime').textContent = '0 s';
    }

    drawProjectileStatic() {
        const canvas = document.getElementById('projectileCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const angleDeg = parseFloat(document.getElementById('projAngle').value);

        ctx.fillStyle = this.colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.drawGrid(ctx, canvas.width, canvas.height);

        const groundY = canvas.height - 60;
        const originX = 60;

        // Ground
        ctx.strokeStyle = 'rgba(255,107,53,0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY); ctx.stroke();

        // Launch angle indicator
        const indicatorLen = 80;
        const angleRad = angleDeg * Math.PI / 180;
        ctx.strokeStyle = this.colors.orange;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(originX, groundY);
        ctx.lineTo(originX + indicatorLen * Math.cos(angleRad), groundY - indicatorLen * Math.sin(angleRad));
        ctx.stroke();
        ctx.setLineDash([]);

        // Projectile at origin
        ctx.fillStyle = this.colors.orange;
        ctx.beginPath(); ctx.arc(originX, groundY, 6, 0, Math.PI * 2); ctx.fill();

        // Angle text
        ctx.fillStyle = this.colors.ice;
        ctx.font = '12px IBM Plex Mono, monospace';
        ctx.fillText(angleDeg + '°', originX + 35, groundY - 15);
    }
}

// Event Listeners
document.getElementById('planetSelect').addEventListener('change', () => {
    const sim = window.simulator;
    if (sim && sim.currentSimulator === 'orbit') {
        sim.stopAllSimulations();
        sim.drawOrbitStatic();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    window.simulator = new PhysicsSimulator();
});

window.addEventListener('resize', () => {
    const sim = window.simulator;
    if (sim) {
        sim.resizeCanvases();
        if (sim.currentSimulator === 'orbit' && !sim.orbitState.running) sim.drawOrbitStatic();
        else if (sim.currentSimulator === 'pendulum' && !sim.pendulumState.running) sim.drawPendulumStatic();
        else if (sim.currentSimulator === 'wave' && !sim.waveState.running) sim.drawWaveStatic();
        else if (sim.currentSimulator === 'projectile' && !sim.projectileState.running) sim.drawProjectileStatic();
    }
});
