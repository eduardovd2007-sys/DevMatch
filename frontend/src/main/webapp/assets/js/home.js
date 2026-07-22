/* ==========================================================
   home.js
   Lógica de la vista Inicio (Carrusel y Noticias)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initNewsGrid();
    
    // El saludo personalizado depende del perfil en API
    setWelcomeMessage();
});

async function setWelcomeMessage() {
    const welcome = document.getElementById('welcome-message');
    const user = getCurrentUser();
    
    if (user && user.name) {
        welcome.innerHTML = `Hola, <span style="color: var(--accent-green)">${user.name.split(' ')[0]}</span>. Bienvenido a DevMatch`;
    }
}

/* ==========================================================
   Datos Mock (Simulados)
   ========================================================== */
const mockCourses = [
    {
        id: 1,
        tag: 'Fundamentos Web',
        title: 'Curso de HTML desde Cero',
        desc: 'Aprende las bases estructurales de la web. Perfecto para iniciar en el mundo del desarrollo web creando tus primeras páginas.',
        image: '../assets/img/course_html.png',
        link: 'https://www.youtube.com/watch?v=3nYLTiY5skU',
        actionText: 'Ver en YouTube'
    },
    {
        id: 2,
        tag: 'Fullstack Master',
        title: 'Bootcamp Desarrollo Web',
        desc: 'Una lista de reproducción intensiva para dominar la creación de aplicaciones web modernas de principio a fin.',
        image: '../assets/img/course_bg.png',
        link: 'https://www.youtube.com/playlist?list=PLUofhDIg_38q7l8gV4IVCz_pjUeyD99_j',
        actionText: 'Ver Playlist'
    },
    {
        id: 3,
        tag: 'Especialización',
        title: 'Aprende JavaScript Dev',
        desc: 'Plataforma interactiva gratuita para dominar JS paso a paso con retos prácticos y evaluaciones en tiempo real.',
        image: '../assets/img/course_js.png',
        link: 'https://www.aprendejavascript.dev',
        actionText: 'Ir a Plataforma'
    },
    {
        id: 4,
        tag: 'Especialización',
        title: 'Arquitectura Cloud en AWS',
        desc: 'Domina los servicios de Amazon Web Services, despliega aplicaciones escalables y prepárate para la certificación oficial.',
        image: '../assets/img/course_bg.png',
        link: 'https://aws.amazon.com/es/training/',
        actionText: 'Empezar Curso'
    },
    {
        id: 5,
        tag: 'Frontend Master',
        title: 'React & Next.js Moderno',
        desc: 'Construye interfaces de usuario ultra rápidas con el stack más demandado del mercado. Incluye Server Actions y Tailwind.',
        image: '../assets/img/course_react.png',
        link: 'https://react.dev/learn',
        actionText: 'Ver Detalles'
    },
    {
        id: 6,
        tag: 'Backend Development',
        title: 'APIs Robustas con Node.js',
        desc: 'Aprende a diseñar microservicios, asegurar endpoints y conectar bases de datos PostgreSQL con Prisma ORM.',
        image: '../assets/img/course_bg.png',
        link: 'https://nodejs.org/en/learn',
        actionText: 'Ir al Curso'
    }
];

const mockNews = [
    {
        id: 1,
        category: 'Inteligencia Artificial',
        title: 'Claude 3.5 sorprende con "razonamiento" avanzado',
        date: 'Hace 4 horas',
        excerpt: 'El modelo de Anthropic ha demostrado habilidades inesperadas para manipular conceptos complejos antes de generar sus respuestas.',
        image: '../assets/img/course_react.png',
        author: 'Xataka',
        authorInitials: 'XA',
        link: 'https://www.xataka.com/robotica-e-ia/claude-3-5-sonnet-demuestra-habilidades-inesperadas'
    },
    {
        id: 2,
        category: 'Industria Tech',
        title: 'Meta advierte: Será necesario reconstruir la infraestructura',
        date: 'Hace 6 horas',
        excerpt: 'La compañía sugiere un cambio profundo en el desarrollo y la infraestructura de servidores tecnológicos para los nuevos agentes IA.',
        image: '../assets/img/course_bg.png',
        author: 'Xataka',
        authorInitials: 'XA',
        link: 'https://www.xataka.com/empresas-y-economia/meta-advierte-necesidad-reconstruir-infraestructura-agentes-ia'
    },
    {
        id: 3,
        category: 'Hardware',
        title: 'Samsung domina el mercado de los dispositivos plegables en España',
        date: 'Ayer',
        excerpt: 'Mientras Apple busca alternativas para salvar la caída en ventas, Samsung consolida su hegemonía en el sector de los smartphones plegables.',
        image: '../assets/img/course_html.png',
        author: 'Xataka',
        authorInitials: 'XA',
        link: 'https://www.xataka.com/moviles/samsung-domina-mercado-plegables-espana'
    },
    {
        id: 4,
        category: 'Sostenibilidad',
        title: 'La creciente crisis de agua y electricidad por el boom de Data Centers',
        date: 'Hace 2 días',
        excerpt: 'Existe una creciente tensión sobre el consumo de recursos de los centros de datos, provocando resistencia en varias comunidades.',
        image: '../assets/img/course_js.png',
        author: 'Genbeta',
        authorInitials: 'GB',
        link: 'https://www.genbeta.com/actualidad/crisis-agua-electricidad-boom-data-centers'
    }
];

/* ==========================================================
   Motor del Carrusel
   ========================================================== */
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const indicatorsWrap = document.getElementById('carousel-indicators');
    
    if (!track || !indicatorsWrap) return;

    // Pintar Diapositivas
    track.innerHTML = mockCourses.map((course, index) => `
        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}" onclick="window.open('${course.link}', '_blank')">
            <img src="${course.image}" alt="${course.title}">
            <div class="carousel-content">
                <span class="carousel-tag">${course.tag}</span>
                <h3 class="carousel-title">${course.title}</h3>
                <p class="carousel-desc">${course.desc}</p>
                <a href="${course.link}" target="_blank" class="carousel-action" onclick="event.stopPropagation()">
                    ${course.actionText}
                </a>
            </div>
        </div>
    `).join('');

    // Pintar Indicadores
    indicatorsWrap.innerHTML = mockCourses.map((_, index) => `
        <div class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
    `).join('');

    // Lógica de Movimiento
    let currentIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;
    let autoPlayInterval;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentIndex = index;
        const offset = -100 * currentIndex;
        track.style.transform = `translateX(${offset}%)`;

        slides.forEach(s => s.classList.remove('active'));
        indicators.forEach(i => i.classList.remove('active'));

        slides[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    document.getElementById('carousel-next').addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    document.getElementById('carousel-prev').addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    indicators.forEach(ind => {
        ind.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            goToSlide(index);
            resetInterval();
        });
    });

    function startInterval() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetInterval() {
        clearInterval(autoPlayInterval);
        startInterval();
    }

    // Iniciar autoplay
    startInterval();
}

/* ==========================================================
   Motor de la Cuadrícula de Noticias
   ========================================================== */
function initNewsGrid() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    grid.innerHTML = mockNews.map(news => `
        <article class="news-card" onclick="window.open('${news.link}', '_blank')" style="cursor: pointer;">
            <div class="news-img-wrap">
                <span class="news-category">${news.category}</span>
                <img src="${news.image}" alt="${news.title}" class="news-img">
            </div>
            <div class="news-body">
                <span class="news-date">${news.date}</span>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <div class="news-footer">
                    <div class="news-author">
                        <div class="news-author-avatar">${news.authorInitials}</div>
                        <span>${news.author}</span>
                    </div>
                    <a href="${news.link}" class="news-readmore" onclick="event.stopPropagation()">Leer más</a>
                </div>
            </div>
        </article>
    `).join('');
}
