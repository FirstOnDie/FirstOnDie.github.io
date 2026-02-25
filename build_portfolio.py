#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds a Brittany Chiang V4 inspired split-layout portfolio
with ALL content from the current Premium Long-Scroll layout.
Pure Python to guarantee UTF-8 encoding preservation.
"""

html = r'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carlos Expósito — Senior Full Stack Developer</title>
    <meta name="description" content="Portafolio profesional de Carlos Expósito, desarrollador Full Stack especializado en Java, Python, JavaScript y tecnologías cloud.">
    <meta name="author" content="Carlos Expósito">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Carlos Expósito — Senior Full Stack Developer">
    <meta property="og:description" content="Portafolio profesional de Carlos Expósito. Java · Python · JavaScript · Cloud.">
    <meta property="og:image" content="https://media.licdn.com/dms/image/v2/D4D03AQF4CULpdXIraw/profile-displayphoto-shrink_800_800/B4DZcMvz2GIAAc-/0/1748265549648?e=1755129600&v=beta&t=E7mVxTP3wBL4sV6YWYQNstvw3Exn6NzCYwXgScs_Gh0">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👨‍💻</text></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Person","name":"Carlos Expósito","jobTitle":"Senior Full Stack Developer","url":"https://firstondie.github.io/","sameAs":["https://www.linkedin.com/in/carlos-exposito-ceballo","https://github.com/FirstOnDie"],"email":"carlos.cjec@gmail.com","address":{"@type":"PostalAddress","addressLocality":"Barcelona","addressCountry":"ES"}}
    </script>
</head>
<body>
    <div class="cursor-glow" id="cursorGlow"></div>

    <!-- Mobile Nav -->
    <nav class="mobile-nav">
        <a href="#" class="mobile-logo">CE</a>
        <button class="hamburger" id="hamburger" aria-label="Menú">
            <span></span><span></span><span></span>
        </button>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
        <a href="#about">Sobre Mí</a>
        <a href="#experience">Experiencia</a>
        <a href="#projects">Proyectos</a>
        <a href="#contact">Contacto</a>
    </div>

    <div class="layout">
        <!-- ========== LEFT COLUMN (STICKY) ========== -->
        <header class="sidebar">
            <div class="sidebar-content">
                <div class="sidebar-top">
                    <img src="foto.jpeg" alt="Carlos Expósito" class="avatar">
                    <h1 class="name">Carlos Expósito</h1>
                    <h2 class="title">Senior Full Stack Developer</h2>
                    <p class="tagline">Construyo soluciones digitales escalables con <span class="highlight">Java</span>, <span class="highlight">Python</span> y <span class="highlight">JavaScript</span>.</p>
                </div>
                <nav class="sidebar-nav" aria-label="Secciones">
                    <a href="#about" class="nav-link active" data-section="about">
                        <span class="nav-indicator"></span>
                        <span class="nav-text">Sobre Mí</span>
                    </a>
                    <a href="#experience" class="nav-link" data-section="experience">
                        <span class="nav-indicator"></span>
                        <span class="nav-text">Experiencia</span>
                    </a>
                    <a href="#projects" class="nav-link" data-section="projects">
                        <span class="nav-indicator"></span>
                        <span class="nav-text">Proyectos</span>
                    </a>
                    <a href="#contact" class="nav-link" data-section="contact">
                        <span class="nav-indicator"></span>
                        <span class="nav-text">Contacto</span>
                    </a>
                </nav>
                <div class="sidebar-social">
                    <a href="https://github.com/FirstOnDie" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>
                    <a href="https://www.linkedin.com/in/carlos-exposito-ceballo" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    <a href="mailto:carlos.cjec@gmail.com" aria-label="Email"><i class="fas fa-envelope"></i></a>
                    <a href="https://frodygr.itch.io/" target="_blank" rel="noopener" aria-label="itch.io"><i class="fab fa-itch-io"></i></a>
                </div>
            </div>
        </header>

        <!-- ========== RIGHT COLUMN (SCROLLABLE) ========== -->
        <main class="content" id="content">

            <!-- ABOUT -->
            <section id="about" class="section" aria-label="Sobre mí">
                <div class="section-header-mobile">
                    <h2>Sobre Mí</h2>
                </div>
                <p>Soy un desarrollador Full Stack con más de <strong>8 años de experiencia</strong> creando soluciones tecnológicas innovadoras. Graduado en <strong>Ingeniería Informática</strong> por la UOC, apasionado de la programación desde los 14 años.</p>
                <p>Me especializo en <strong>Java</strong>, <strong>Spring Boot</strong>, <strong>Python</strong> y <strong>JavaScript</strong>, con experiencia en cloud (<strong>AWS</strong>, <strong>GCP</strong>), <strong>Docker</strong>, <strong>Kubernetes</strong> y arquitecturas de microservicios. He trabajado en múltiples sectores — robótica, ciberseguridad, logística y energía — siempre aplicando buenas prácticas y metodologías ágiles.</p>
                <p>Cuando no estoy programando, me gusta desarrollar videojuegos con Unreal Engine, crear bots de Telegram con IA y explorar nuevas tecnologías que puedan mejorar la vida de las personas.</p>

                <div class="skills-cloud">
                    <h3 class="subsection-title"><span class="num">01.</span> Habilidades Principales</h3>
                    <div class="skills-grid-compact">
                        <div class="skill-group">
                            <h4><i class="fas fa-code"></i> Lenguajes</h4>
                            <div class="tags"><span>Java</span><span>Python</span><span>JavaScript</span><span>C</span><span>PHP</span><span>Bash</span></div>
                        </div>
                        <div class="skill-group">
                            <h4><i class="fas fa-tools"></i> Frameworks</h4>
                            <div class="tags"><span>Spring Boot</span><span>Spring Security</span><span>React</span><span>Node.js</span></div>
                        </div>
                        <div class="skill-group">
                            <h4><i class="fas fa-cloud"></i> Cloud & DevOps</h4>
                            <div class="tags"><span>AWS</span><span>GCP</span><span>Docker</span><span>Kubernetes</span><span>Jenkins</span><span>CI/CD</span></div>
                        </div>
                        <div class="skill-group">
                            <h4><i class="fas fa-database"></i> Bases de Datos</h4>
                            <div class="tags"><span>PostgreSQL</span><span>MySQL</span><span>MongoDB</span><span>Oracle</span><span>Elasticsearch</span></div>
                        </div>
                        <div class="skill-group">
                            <h4><i class="fas fa-wrench"></i> Herramientas</h4>
                            <div class="tags"><span>Git</span><span>GitLab</span><span>SonarQube</span><span>JPA</span><span>Kafka</span><span>WebRTC</span></div>
                        </div>
                    </div>
                </div>

                <div class="education-block">
                    <h3 class="subsection-title"><span class="num">02.</span> Formación</h3>
                    <div class="edu-item">
                        <span class="edu-year">2019 — 2024</span>
                        <div>
                            <strong>Ingeniería Informática</strong>
                            <span class="edu-school">Universitat Oberta de Catalunya (UOC)</span>
                        </div>
                    </div>
                    <div class="edu-item">
                        <span class="edu-year">2012 — 2014</span>
                        <div>
                            <strong>CFGS Administración de Sistemas Informáticos en Red</strong>
                            <span class="edu-school">IES Albarregas</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- EXPERIENCE -->
            <section id="experience" class="section" aria-label="Experiencia profesional">
                <div class="section-header-mobile">
                    <h2>Experiencia</h2>
                </div>
                <div class="group-list">

                    <a class="exp-card" href="#" aria-label="Senior Software Developer en UST España">
                        <header class="exp-date">Abr 2025 — Presente</header>
                        <div class="exp-body">
                            <h3>Senior Software Developer · <span class="company">UST España & Latam</span></h3>
                            <p>Desarrollo de aplicaciones empresariales escalables con Java y Spring Boot. Implementación y mantenimiento de microservicios en ecosistema AWS, optimizando despliegues y colaborando en squads ágiles internacionales.</p>
                            <div class="tags"><span>Java</span><span>Spring Boot</span><span>Microservicios</span><span>AWS</span></div>
                        </div>
                    </a>

                    <a class="exp-card" href="#" aria-label="Tech Lead en S2 Grupo">
                        <header class="exp-date">May 2023 — Ene 2025</header>
                        <div class="exp-body">
                            <h3>Tech Lead · <span class="company">S2 Grupo</span></h3>
                            <p>Liderazgo técnico de un equipo de 6 desarrolladores para proyectos del sector de la ciberseguridad. Toma de decisiones en arquitectura hexagonal, gestión de BBDD relacionales y NoSQL (Elasticsearch), e impartición de formación técnica a clientes y niveles L2/L3.</p>
                            <div class="tags"><span>Arquitectura Hexagonal</span><span>Elasticsearch</span><span>Spring Security</span><span>CI/CD Jenkins</span></div>
                        </div>
                    </a>

                    <a class="exp-card" href="#" aria-label="Tech Lead en Selectra">
                        <header class="exp-date">Ene 2023 — May 2023</header>
                        <div class="exp-body">
                            <h3>Tech Lead · <span class="company">Selectra</span></h3>
                            <p>Liderazgo técnico en proyectos del sector energético. Desarrollo de soluciones escalables, gestión de equipos y coordinación con stakeholders técnicos y de negocio.</p>
                            <div class="tags"><span>Java</span><span>Oracle Database</span><span>PostgreSQL</span><span>Git</span></div>
                        </div>
                    </a>

                    <a class="exp-card" href="#" aria-label="Analista Sénior en Dematic">
                        <header class="exp-date">Feb 2020 — Ene 2023</header>
                        <div class="exp-body">
                            <h3>Analista Sénior · <span class="company">Dematic</span></h3>
                            <p>Análisis y desarrollo de sistemas de automatización logística. Implementación de soluciones para almacenes automatizados con equipos internacionales usando Spring Boot y Oracle.</p>
                            <div class="tags"><span>Oracle Database</span><span>Spring Boot</span><span>JPA</span><span>Spring Security</span></div>
                        </div>
                    </a>

                    <a class="exp-card" href="#" aria-label="Software System Engineer en KNAPP">
                        <header class="exp-date">Sep 2017 — Feb 2020</header>
                        <div class="exp-body">
                            <h3>Software System Engineer · <span class="company">KNAPP Logistics Automation</span></h3>
                            <p>Instalación y configuración de software logístico en instalaciones de clientes en más de 30 países. Programación de personalizaciones, cooperación con departamentos en Austria y formación de clientes.</p>
                            <div class="tags"><span>Oracle Database</span><span>Java</span><span>Spring Boot</span><span>Unix Server</span><span>Bash</span></div>
                        </div>
                    </a>

                    <a class="exp-card" href="#" aria-label="Programador en Prakmatic">
                        <header class="exp-date">Jul 2016 — Jul 2017</header>
                        <div class="exp-body">
                            <h3>Programador · <span class="company">Prakmatic</span></h3>
                            <p>DevOps en Telefónica. Desarrollo web con HTML, CSS, PHP, JavaScript y AJAX. Participación activa en reuniones Scrum y desarrollo ágil de aplicaciones.</p>
                            <div class="tags"><span>HTML/CSS</span><span>PHP</span><span>JavaScript</span><span>MySQL</span><span>DevOps</span></div>
                        </div>
                    </a>

                    <a class="exp-card" href="#" aria-label="IT Technician en ANSON grupo MICROMA">
                        <header class="exp-date">Mar 2014 — Oct 2015</header>
                        <div class="exp-body">
                            <h3>IT Technician · <span class="company">ANSON grupo MICROMA</span></h3>
                            <p>Atención al público, soporte técnico, mantenimiento de software para clientes, técnico de hardware y formación de usuarios en nuevos sistemas.</p>
                            <div class="tags"><span>Soporte Técnico</span><span>Hardware</span><span>Software</span><span>Formación</span></div>
                        </div>
                    </a>

                </div>
                <div class="section-cta">
                    <a href="https://www.linkedin.com/in/carlos-exposito-ceballo" target="_blank" class="inline-link">
                        Ver CV Completo <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </section>

            <!-- PROJECTS -->
            <section id="projects" class="section" aria-label="Proyectos">
                <div class="section-header-mobile">
                    <h2>Proyectos</h2>
                </div>
                <div class="group-list">

                    <!-- Live Projects -->
                    <a class="project-card" href="devmetrics/index.html" target="_blank">
                        <div class="project-img">
                            <img src="https://raw.githubusercontent.com/FirstOnDie/FirstOnDie.github.io/b36b0c2a2656daaaeb9bfde6bdec72aae27e997a/devmetrics/assets/HeatmapGithub.png" alt="DevMetrics Dashboard">
                        </div>
                        <div class="project-body">
                            <h3>DevMetrics Dashboard <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Dashboard interactivo visual inspirado en el dark mode de GitHub con mapa de calor SVG y gráficos de contribuciones en vivo sin librerías externas pesadas.</p>
                            <div class="tags"><span>JavaScript</span><span>REST API</span><span>CSS Grid</span><span>Chart.js</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="devassistant/index.html" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #1e1b4b, #312e81)">
                            <i class="fas fa-robot fa-3x" style="color: #818cf8"></i>
                        </div>
                        <div class="project-body">
                            <h3>DevAssistant AI <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Asistente virtual de programación web con inferencia ultrarrápida usando API Groq/Llama3. Interfaz desacoplada con parseo de markdown y resaltado de sintaxis on-the-fly.</p>
                            <div class="tags"><span>LLM / Groq</span><span>Markdown Parsing</span><span>Async JS</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="quiz-app/index.html" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #064e3b, #047857)">
                            <i class="fas fa-graduation-cap fa-3x" style="color: #4ade80"></i>
                        </div>
                        <div class="project-body">
                            <h3>Knowledge Assessment Platform <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Plataforma profesional de evaluación de conocimientos con preguntas dinámicas, análisis de rendimiento y ranking local.</p>
                            <div class="tags"><span>JS Modular</span><span>Open Trivia API</span><span>Local Storage</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="microexpresiones/index.html" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #134e4a, #0d9488)">
                            <i class="fas fa-face-smile fa-3x" style="color: #5eead4"></i>
                        </div>
                        <div class="project-body">
                            <h3>Microexpressions Detector <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Detección de emociones faciales en tiempo real usando inteligencia artificial y TensorFlow.js directamente en el navegador.</p>
                            <div class="tags"><span>AI / ML</span><span>TensorFlow.js</span><span>WebCam API</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="weather-app/index.html" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #1e3a8a, #1d4ed8)">
                            <i class="fas fa-cloud-sun fa-3x" style="color: #93c5fd"></i>
                        </div>
                        <div class="project-body">
                            <h3>Weather App España <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Mapa interactivo del clima en España con búsqueda en tiempo real, marcadores interactivos usando Leaflet.js y OpenWeather.</p>
                            <div class="tags"><span>Leaflet.js</span><span>OpenWeather API</span><span>CSS3</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="movie-app/index.html" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #7f1d1d, #b91c1c)">
                            <i class="fas fa-film fa-3x" style="color: #fca5a5"></i>
                        </div>
                        <div class="project-body">
                            <h3>Movie Discovery <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Plataforma de descubrimiento de películas con búsqueda asíncrona y sistema inteligente de recomendaciones usando TMDb.</p>
                            <div class="tags"><span>TMDb API</span><span>Async Fetch</span><span>JavaScript</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="https://frodygr.itch.io/cursed-cementery" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #1c1917, #44403c)">
                            <i class="fab fa-unreal-engine fa-3x" style="color: #a8a29e"></i>
                        </div>
                        <div class="project-body">
                            <h3>Cursed Cemetery (Juego 3D) <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Juego horror 3D desarrollado con Unreal Engine 5. Publicado en itch.io con físicas, nivel completo y sistema de objetivos.</p>
                            <div class="tags"><span>Unreal Engine</span><span>Blueprints</span><span>3D</span></div>
                        </div>
                    </a>

                    <!-- Technical Projects -->
                    <a class="project-card" href="https://github.com/FirstOnDie/TelegramBotAi" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #172554, #1e40af)">
                            <i class="fab fa-telegram fa-3x" style="color: #60a5fa"></i>
                        </div>
                        <div class="project-body">
                            <h3>TelegramBot AI <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Bot de Telegram con inteligencia artificial desde cero. Integración con APIs de IA y procesamiento de lenguaje natural.</p>
                            <div class="tags"><span>Python</span><span>AI</span><span>Telegram</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="https://github.com/FirstOnDie/ELK_Example" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #1a2e05, #365314)">
                            <i class="fas fa-magnifying-glass-chart fa-3x" style="color: #84cc16"></i>
                        </div>
                        <div class="project-body">
                            <h3>ELK Stack <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Configuración completa de Elasticsearch, Logstash y Kibana para análisis de logs en tiempo real.</p>
                            <div class="tags"><span>Elasticsearch</span><span>Logstash</span><span>Kibana</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="https://github.com/FirstOnDie/OrderNotification" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #1c1917, #292524)">
                            <i class="fas fa-bell fa-3x" style="color: #fb923c"></i>
                        </div>
                        <div class="project-body">
                            <h3>Kafka Order Notifications <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Sistema de notificaciones con Apache Kafka para procesar pedidos de tienda en tiempo real con microservicios.</p>
                            <div class="tags"><span>Kafka</span><span>Microservicios</span><span>Tiempo Real</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="https://github.com/FirstOnDie/BlockchainTransaction" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #312e81, #4338ca)">
                            <i class="fas fa-link fa-3x" style="color: #a78bfa"></i>
                        </div>
                        <div class="project-body">
                            <h3>Blockchain Transactions <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Implementación de transacciones blockchain con validaciones y criptografía en Java 21+.</p>
                            <div class="tags"><span>Blockchain</span><span>Java</span><span>Criptografía</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="https://github.com/FirstOnDie/Websocket-Example" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #164e63, #0891b2)">
                            <i class="fas fa-comments fa-3x" style="color: #67e8f9"></i>
                        </div>
                        <div class="project-body">
                            <h3>Chat en Tiempo Real <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Aplicación de chat en tiempo real usando WebSockets con Spring Boot y JavaScript.</p>
                            <div class="tags"><span>WebSocket</span><span>Spring Boot</span><span>JavaScript</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="https://github.com/FirstOnDie/webrtc-videollamada" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #701a75, #a21caf)">
                            <i class="fas fa-video fa-3x" style="color: #f0abfc"></i>
                        </div>
                        <div class="project-body">
                            <h3>Videollamadas WebRTC <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Aplicación de videollamadas peer-to-peer usando WebRTC con Spring Boot y JavaScript.</p>
                            <div class="tags"><span>WebRTC</span><span>Spring Boot</span><span>JavaScript</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="https://github.com/FirstOnDie/loom-processing" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #422006, #92400e)">
                            <i class="fas fa-microchip fa-3x" style="color: #fbbf24"></i>
                        </div>
                        <div class="project-body">
                            <h3>Loom Virtual Threads <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Proyecto comparativo entre Threads tradicionales y Virtual Threads de Java 21 con Project Loom.</p>
                            <div class="tags"><span>Java 21</span><span>Loom</span><span>Virtual Threads</span></div>
                        </div>
                    </a>

                    <!-- Courses -->
                    <a class="project-card" href="https://github.com/FirstOnDie/LearnJavaWithMe" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #7c2d12, #c2410c)">
                            <i class="fab fa-java fa-3x" style="color: #fdba74"></i>
                        </div>
                        <div class="project-body">
                            <h3>Learn Java With Me <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Curso completo de Java desde básico hasta avanzado, con ejercicios prácticos, patrones de diseño y mejores prácticas.</p>
                            <div class="tags"><span>Java</span><span>Tutorial</span><span>Educación</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="https://github.com/FirstOnDie/AWSCDK-Course" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #1e3a5f, #f59e0b)">
                            <i class="fab fa-aws fa-3x" style="color: #fbbf24"></i>
                        </div>
                        <div class="project-body">
                            <h3>AWS CDK Course <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>De inicio a final, todo lo que necesitas saber de AWS CDK para infraestructura como código.</p>
                            <div class="tags"><span>AWS</span><span>CDK</span><span>Infraestructura</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="start.html">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #1e1e2e, #313244)">
                            <i class="fas fa-key fa-3x" style="color: #94e2d5"></i>
                        </div>
                        <div class="project-body">
                            <h3>Escape Room 'Código Sombrío' <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Juego de puzzles interactivo para desarrollar habilidades de programación y lógica. Disponible en español e inglés.</p>
                            <div class="tags"><span>Juego</span><span>Puzzles</span><span>Interactivo</span></div>
                        </div>
                    </a>

                    <a class="project-card" href="https://www.ibestan.net" target="_blank">
                        <div class="project-img project-icon-bg" style="--bg: linear-gradient(135deg, #0c4a6e, #0284c7)">
                            <i class="fas fa-globe fa-3x" style="color: #7dd3fc"></i>
                        </div>
                        <div class="project-body">
                            <h3>Ibestan — Web Profesional <i class="fas fa-arrow-up-right-from-square link-icon"></i></h3>
                            <p>Desarrollo de página web profesional para Ibérica de Estanqueidad, empresa industrial B2B.</p>
                            <div class="tags"><span>Web Development</span><span>Diseño Web</span><span>Responsive</span></div>
                        </div>
                    </a>

                </div>
            </section>

            <!-- CONTACT -->
            <section id="contact" class="section" aria-label="Contacto">
                <div class="section-header-mobile">
                    <h2>Contacto</h2>
                </div>
                <p>¿Tienes un proyecto en mente o una oportunidad interesante? Estoy siempre abierto a nuevas colaboraciones, proyectos desafiantes y conversaciones sobre tecnología. ¡Hablemos!</p>
                <div class="contact-links">
                    <a href="mailto:carlos.cjec@gmail.com" class="contact-btn primary">
                        <i class="fas fa-envelope"></i> carlos.cjec@gmail.com
                    </a>
                    <a href="https://www.linkedin.com/in/carlos-exposito-ceballo" target="_blank" class="contact-btn">
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </a>
                    <a href="https://github.com/FirstOnDie" target="_blank" class="contact-btn">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                </div>
                <p class="contact-meta"><i class="fas fa-map-marker-alt"></i> Barcelona, España · Trabajo remoto global · Respuesta en &lt;24h</p>
            </section>

            <!-- FOOTER -->
            <footer class="footer">
                <p>Diseñado & desarrollado por Carlos Expósito Ceballo — inspirado en <a href="https://brittanychiang.com" target="_blank" rel="noopener">Brittany Chiang</a>.</p>
                <p>Construido con HTML5, CSS3 y JavaScript vanilla.</p>
            </footer>
        </main>
    </div>

    <script>
    (function(){
        // Cursor glow
        const glow = document.getElementById('cursorGlow');
        if(window.innerWidth > 768){
            document.addEventListener('mousemove', e => {
                glow.style.background = `radial-gradient(600px at ${e.clientX}px ${e.clientY}px, rgba(29, 78, 216, 0.07), transparent 80%)`;
            });
        }

        // Scroll Spy
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    navLinks.forEach(l => l.classList.remove('active'));
                    const id = entry.target.getAttribute('id');
                    const active = document.querySelector(`.nav-link[data-section="${id}"]`);
                    if(active) active.classList.add('active');
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px' });
        sections.forEach(s => observer.observe(s));

        // Mobile menu
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        if(hamburger){
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            });
            mobileMenu.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                });
            });
        }

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                const t = document.querySelector(a.getAttribute('href'));
                if(t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    })();
    </script>
</body>
</html>
'''

css = r'''/* ========== RESET & BASE ========== */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }
body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0a192f;
    color: #8892b0;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
}
::selection { background: rgba(100, 255, 218, 0.15); color: #ccd6f6; }
a { color: #ccd6f6; text-decoration: none; transition: color 0.2s; }
a:hover { color: #64ffda; }
strong { color: #ccd6f6; font-weight: 500; }
img { max-width: 100%; display: block; }

/* ========== CURSOR GLOW ========== */
.cursor-glow {
    position: fixed; inset: 0; z-index: 1; pointer-events: none;
    transition: background 0.3s ease;
}

/* ========== LAYOUT ========== */
.layout {
    display: flex;
    max-width: 1280px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    z-index: 2;
}

/* ========== SIDEBAR ========== */
.sidebar {
    width: 48%;
    max-width: 520px;
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 100px 48px 48px;
}
.sidebar-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}
.sidebar-top { }
.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #233554;
    margin-bottom: 20px;
    transition: border-color 0.3s;
}
.avatar:hover { border-color: #64ffda; }
.name {
    font-size: 2.8rem;
    font-weight: 700;
    color: #ccd6f6;
    line-height: 1.1;
    letter-spacing: -0.02em;
}
.title {
    font-size: 1.1rem;
    font-weight: 500;
    color: #64ffda;
    margin-top: 8px;
    font-family: 'JetBrains Mono', monospace;
}
.tagline {
    margin-top: 16px;
    font-size: 0.95rem;
    line-height: 1.6;
    max-width: 340px;
}
.highlight { color: #64ffda; }

/* ========== SIDEBAR NAV ========== */
.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 48px;
}
.nav-link {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 0;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #495670;
    transition: all 0.3s;
}
.nav-link:hover, .nav-link.active { color: #ccd6f6; }
.nav-indicator {
    width: 32px;
    height: 1px;
    background: #495670;
    transition: all 0.3s;
}
.nav-link:hover .nav-indicator,
.nav-link.active .nav-indicator {
    width: 64px;
    background: #ccd6f6;
}

/* ========== SIDEBAR SOCIAL ========== */
.sidebar-social {
    display: flex;
    gap: 20px;
    margin-top: auto;
    padding-top: 32px;
}
.sidebar-social a {
    font-size: 1.25rem;
    color: #495670;
    transition: color 0.2s, transform 0.2s;
}
.sidebar-social a:hover{ color: #64ffda; transform: translateY(-3px); }

/* ========== MAIN CONTENT ========== */
.content {
    flex: 1;
    padding: 100px 48px 48px 48px;
}

/* ========== SECTIONS ========== */
.section { margin-bottom: 120px; scroll-margin-top: 80px; }
.section p { margin-bottom: 16px; }
.section-header-mobile { display: none; }

/* ========== SUBSECTION ========== */
.subsection-title {
    font-size: 1rem;
    font-weight: 600;
    color: #ccd6f6;
    margin: 40px 0 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}
.num {
    font-family: 'JetBrains Mono', monospace;
    color: #64ffda;
    font-size: 0.85rem;
}

/* ========== SKILLS GRID ========== */
.skills-grid-compact {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
}
.skill-group h4 {
    font-size: 0.8rem;
    font-weight: 600;
    color: #64ffda;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.skill-group h4 i { font-size: 0.75rem; }

/* ========== TAGS ========== */
.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
}
.tags span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(100, 255, 218, 0.1);
    color: #64ffda;
    white-space: nowrap;
}

/* ========== EDUCATION ========== */
.education-block { margin-top: 40px; }
.edu-item {
    display: flex;
    gap: 20px;
    padding: 12px 0;
    align-items: baseline;
}
.edu-year {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: #495670;
    min-width: 110px;
    white-space: nowrap;
}
.edu-item strong { display: block; color: #ccd6f6; }
.edu-school {
    display: block;
    font-size: 0.85rem;
    color: #64ffda;
    margin-top: 2px;
}

/* ========== GROUP LIST (DIM EFFECT) ========== */
.group-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.group-list:hover > * { opacity: 0.5; }
.group-list:hover > *:hover { opacity: 1 !important; }

/* ========== EXPERIENCE CARD ========== */
.exp-card {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 16px;
    padding: 20px 24px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: all 0.3s;
    text-decoration: none;
    color: inherit;
}
.exp-card:hover {
    background: rgba(100, 255, 218, 0.03);
    border-color: rgba(100, 255, 218, 0.1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
    color: inherit;
}
.exp-card:hover h3 { color: #64ffda; }
.exp-date {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    color: #495670;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-top: 6px;
    white-space: nowrap;
}
.exp-body h3 {
    font-size: 0.95rem;
    font-weight: 500;
    color: #ccd6f6;
    line-height: 1.4;
    transition: color 0.2s;
    margin-bottom: 8px;
}
.company { color: #64ffda; }
.exp-body p {
    font-size: 0.85rem;
    margin-bottom: 12px;
    line-height: 1.6;
}

/* ========== PROJECT CARD ========== */
.project-card {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 16px;
    padding: 20px 24px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: all 0.3s;
    text-decoration: none;
    color: inherit;
    align-items: start;
}
.project-card:hover {
    background: rgba(100, 255, 218, 0.03);
    border-color: rgba(100, 255, 218, 0.1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
    color: inherit;
}
.project-card:hover h3 { color: #64ffda; }
.project-card:hover .link-icon {
    transform: translate(3px, -3px);
}
.project-img {
    border-radius: 6px;
    overflow: hidden;
    border: 2px solid #233554;
    aspect-ratio: 16/10;
    transition: border-color 0.3s;
}
.project-card:hover .project-img { border-color: rgba(100, 255, 218, 0.3); }
.project-img img { width: 100%; height: 100%; object-fit: cover; }
.project-icon-bg {
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
}
.project-body h3 {
    font-size: 0.95rem;
    font-weight: 500;
    color: #ccd6f6;
    transition: color 0.2s;
    margin-bottom: 8px;
    line-height: 1.4;
}
.link-icon {
    font-size: 0.7rem;
    display: inline-block;
    margin-left: 4px;
    transition: transform 0.2s;
}
.project-body p {
    font-size: 0.83rem;
    margin-bottom: 12px;
    line-height: 1.6;
}

/* ========== CONTACT ========== */
.contact-links {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 24px 0;
}
.contact-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 6px;
    border: 1px solid #233554;
    font-size: 0.85rem;
    font-weight: 500;
    color: #ccd6f6;
    transition: all 0.2s;
}
.contact-btn:hover {
    background: rgba(100, 255, 218, 0.05);
    border-color: #64ffda;
    color: #64ffda;
}
.contact-btn.primary {
    border-color: #64ffda;
    color: #64ffda;
}
.contact-meta {
    font-size: 0.8rem;
    color: #495670;
    margin-top: 8px;
}
.contact-meta i { color: #64ffda; margin-right: 4px; }

/* ========== SECTION CTA ========== */
.section-cta { margin-top: 24px; }
.inline-link {
    font-weight: 600;
    font-size: 0.9rem;
    color: #ccd6f6;
    border-bottom: 1px solid transparent;
    padding-bottom: 2px;
    transition: all 0.2s;
}
.inline-link:hover {
    color: #64ffda;
    border-color: #64ffda;
}
.inline-link i { transition: transform 0.2s; margin-left: 4px; font-size: 0.7rem; }
.inline-link:hover i { transform: translateX(4px); }

/* ========== FOOTER ========== */
.footer {
    padding: 60px 0 24px;
    font-size: 0.8rem;
    color: #495670;
    line-height: 1.8;
}
.footer a { color: #64ffda; }
.footer a:hover { text-decoration: underline; }

/* ========== MOBILE NAV ========== */
.mobile-nav {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 16px 24px;
    background: rgba(10, 25, 47, 0.9);
    backdrop-filter: blur(12px);
    z-index: 100;
    justify-content: space-between;
    align-items: center;
}
.mobile-logo {
    font-weight: 700;
    font-size: 1.3rem;
    color: #64ffda;
    font-family: 'JetBrains Mono', monospace;
}
.hamburger {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 4px;
}
.hamburger span {
    width: 24px;
    height: 2px;
    background: #ccd6f6;
    transition: all 0.3s;
}
.hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
.mobile-menu {
    display: none;
    position: fixed;
    top: 0;
    right: -100%;
    width: 70%;
    max-width: 320px;
    height: 100vh;
    background: #112240;
    z-index: 99;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    transition: right 0.4s cubic-bezier(0.77, 0, 0.175, 1);
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
}
.mobile-menu.active { right: 0; display: flex; }
.mobile-menu a {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    color: #ccd6f6;
    letter-spacing: 0.05em;
}
.mobile-menu a:hover { color: #64ffda; }

/* ========== RESPONSIVE ========== */
@media (max-width: 1024px) {
    .sidebar { padding: 80px 32px 32px; }
    .content { padding: 80px 32px 32px; }
    .name { font-size: 2.2rem; }
    .exp-card, .project-card { grid-template-columns: 1fr; }
    .exp-date { padding-top: 0; margin-bottom: 4px; }
}
@media (max-width: 768px) {
    .layout { flex-direction: column; }
    .sidebar {
        position: relative;
        width: 100%;
        max-width: 100%;
        height: auto;
        padding: 100px 24px 32px;
    }
    .sidebar-nav { display: none; }
    .content { padding: 24px; }
    .mobile-nav { display: flex; }
    .mobile-menu { display: flex; right: -100%; }
    .section { margin-bottom: 60px; }
    .section-header-mobile {
        display: block;
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(10, 25, 47, 0.85);
        backdrop-filter: blur(8px);
        padding: 12px 0;
        margin: -12px -24px 24px;
        padding-left: 24px;
    }
    .section-header-mobile h2 {
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #ccd6f6;
    }
    .skills-grid-compact { grid-template-columns: 1fr; }
    .exp-card, .project-card { padding: 16px; }
    .project-card { grid-template-columns: 80px 1fr; }
    .edu-item { flex-direction: column; gap: 2px; }
    .contact-links { flex-direction: column; }
    .name { font-size: 2rem; }
}
@media (max-width: 480px) {
    .project-card { grid-template-columns: 1fr; }
    .project-img { max-width: 120px; }
}
'''

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("✅ index.html written (UTF-8)")

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("✅ style.css written (UTF-8)")
