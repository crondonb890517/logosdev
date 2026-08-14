/**
 * Componente principal de la aplicación
 * Maneja la lógica de la página de inicio (index.html)
 */

function createApp() {
  return {
    theme: document.documentElement.getAttribute('data-bs-theme') || 'light',
    activeTab: 'Frontend',
    projFilter: 'all',
    sent: false,
    form: { name: '', email: '', subject: '', message: '' },
    navbarCollapse: null,
    projects: [],

    /**
     * Inicialización del componente
     */
    init() {
      // Inicializar el collapse del navbar
      this.$nextTick(() => {
        const navEl = document.getElementById('mainNav');
        if (navEl) {
          this.navbarCollapse = new bootstrap.Collapse(navEl, { toggle: false });
        }
      });
      
      // Cargar proyectos desde PocketBase
      this.loadProjects();
    },
    
    /**
     * Carga los proyectos desde PocketBase o usa datos fallback
     */
    async loadProjects() {
      try {
        this.projects = await window.pocketBaseService.getProjects();
      } catch (error) {
        console.warn('Usando datos fallback para proyectos');
        this.projects = this.getFallbackProjects();
      }
    },

    /**
     * Datos fallback para proyectos
     */
    getFallbackProjects() {
      return [
        { title: 'E-commerce Platform', cat: 'Web', emoji: '🛍️', desc: 'Tienda online completa con pasarela de pagos, panel admin y analíticas en tiempo real.', techs: ['Next.js', 'Stripe', 'PostgreSQL'] },
        { title: 'Task Manager App', cat: 'Mobile', emoji: '✅', desc: 'App móvil de gestión de tareas con sincronización en la nube y notificaciones push.', techs: ['React Native', 'Firebase'] },
        { title: 'Analytics API', cat: 'API', emoji: '📊', desc: 'API REST de alto rendimiento para procesamiento de datos analíticos con +1M requests/día.', techs: ['Node.js', 'Redis', 'Docker'] },
        { title: 'Social Dashboard', cat: 'Web', emoji: '💬', desc: 'Dashboard unificado para gestionar múltiples redes sociales con IA para sugerencias.', techs: ['Vue', 'Python', 'OpenAI'] },
        { title: 'Fitness Tracker', cat: 'Mobile', emoji: '💪', desc: 'App de seguimiento de entrenamientos con rutinas personalizadas y métricas.', techs: ['Flutter', 'GraphQL'] },
        { title: 'Booking System', cat: 'API', emoji: '📅', desc: 'Sistema de reservas multi-tenant con calendario en tiempo real y webhooks.', techs: ['Node.js', 'MongoDB'] },
      ];
    },

    /**
     * Cierra el menú móvil al hacer click en un enlace
     */
    closeMenu() {
      if (this.navbarCollapse && window.innerWidth < 992) {
        this.navbarCollapse.hide();
      }
    },

    /**
     * Alterna entre tema claro y oscuro
     */
    toggleTheme() {
      this.theme = window.themeManager.toggle(this.theme);
    },

    /**
     * Datos de skills organizados por categoría
     */
    skills: {
      Frontend: [
        { name: 'React / Next.js', level: 95, icon: '⚛️' },
        { name: 'Vue / Nuxt', level: 85, icon: '🎨' },
        { name: 'TypeScript', level: 90, icon: '📘' },
        { name: 'Tailwind CSS', level: 92, icon: '🎨' },
        { name: 'Alpine.js', level: 80, icon: '🏔️' },
        { name: 'HTML / CSS', level: 98, icon: '🌐' },
      ],
      Backend: [
        { name: 'Node.js', level: 92, icon: '🟢' },
        { name: 'Python / Django', level: 85, icon: '🐍' },
        { name: 'PostgreSQL', level: 88, icon: '🐘' },
        { name: 'MongoDB', level: 82, icon: '🍃' },
        { name: 'GraphQL', level: 78, icon: '◈' },
        { name: 'REST APIs', level: 95, icon: '🔌' },
      ],
      Tools: [
        { name: 'Git / GitHub', level: 93, icon: '📦' },
        { name: 'Docker', level: 85, icon: '🐳' },
        { name: 'AWS / Vercel', level: 80, icon: '☁️' },
        { name: 'CI/CD', level: 82, icon: '⚙️' },
        { name: 'Figma', level: 75, icon: '🎯' },
        { name: 'Linux', level: 80, icon: '🐧' },
      ],
    },

    /**
     * Skills filtradas por tab activo
     */
    get filteredSkills() {
      return this.skills[this.activeTab] || [];
    },

    /**
     * Datos de experiencia laboral
     */
    jobs: [
      { year: '2023 — Presente', role: 'Senior Full-Stack Developer', company: 'TechCorp · Madrid', desc: 'Lidero el desarrollo de una plataforma SaaS con +100k usuarios. Arquitectura de microservicios, mentoría a juniors y definición de estándares de código.' },
      { year: '2021 — 2023', role: 'Full-Stack Developer', company: 'StartupXYZ · Remoto', desc: 'Construí desde cero el MVP del producto principal. Stack: React, Node.js, PostgreSQL. Escalé la plataforma de 0 a 50k usuarios en 18 meses.' },
      { year: '2019 — 2021', role: 'Frontend Developer', company: 'Digital Agency · Barcelona', desc: 'Desarrollo de sitios web y aplicaciones para clientes internacionales. Especializado en React, animaciones y performance web.' },
      { year: '2018 — 2019', role: 'Junior Developer', company: 'CodeFactory · Madrid', desc: 'Primeros pasos profesionales. Mantenimiento de legacy code, desarrollo de features y aprendizaje intensivo de buenas prácticas.' },
    ],

    /**
     * Proyectos filtrados según categoría seleccionada
     */
    get filteredProjects() {
      if (this.projFilter === 'all') return this.projects;
      return this.projects.filter(p => p.cat === this.projFilter);
    },

    /**
     * Animación de conteo para estadísticas
     */
    countUp(target, delay) {
      let n = 0;
      setTimeout(() => {
        const step = Math.max(1, Math.floor(target / 40));
        const iv = setInterval(() => {
          n += step;
          if (n >= target) {
            n = target;
            clearInterval(iv);
          }
          this['_c' + delay] = n;
        }, 40);
      }, delay * 200 + 600);
      return 0;
    },

    /**
     * Envía el formulario de contacto
     */
    async submitForm() {
      try {
        await window.pocketBaseService.submitContactForm(this.form);
        
        this.sent = true;
        this.form = { name: '', email: '', subject: '', message: '' };
        setTimeout(() => this.sent = false, 4000);
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
      }
    },
  };
}

// Hacer disponible globalmente para Alpine.js
window.app = createApp;
