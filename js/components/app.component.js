/**
 * Componente principal de la aplicación
 * Maneja la lógica de la página de inicio (index.html)
 * OPTIMIZACIÓN: Uso de servicios, caching y computadas eficientes
 */

function createApp() {
  return {
    theme: window.themeManager.getInitialTheme(),
    activeTab: 'Frontend',
    projFilter: 'all',
    sent: false,
    form: { name: '', email: '', subject: '', message: '' },
    navbarCollapse: null,
    projects: [],
    _filteredProjectsCache: null,
    _filteredSkillsCache: null,

    /**
     * Inicialización del componente
     */
    init() {
      // Aplicar tema inicial
      window.themeManager.applyTheme(this.theme);
      
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
     * OPTIMIZACIÓN: No bloquea la UI mientras carga
     */
    async loadProjects() {
      try {
        this.projects = await window.pocketBaseService.getProjects();
        this._invalidateFilters();
      } catch (error) {
        console.warn('Usando datos fallback para proyectos');
        this.projects = this.getFallbackProjects();
        this._invalidateFilters();
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
     * OPTIMIZACIÓN: Usa ThemeManager optimizado
     */
    toggleTheme() {
      this.theme = window.themeManager.toggle(this.theme);
    },

    /**
     * Datos de skills organizados por categoría
     * OPTIMIZACIÓN: Definido como propiedad estática para evitar recreación
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
     * OPTIMIZACIÓN: Cachea resultado para evitar recalculos
     */
    get filteredSkills() {
      const cacheKey = this.activeTab;
      if (this._filteredSkillsCache === cacheKey) {
        return this.skills[cacheKey] || [];
      }
      this._filteredSkillsCache = cacheKey;
      return this.skills[cacheKey] || [];
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
     * OPTIMIZACIÓN: Cachea resultado para evitar recalculos
     */
    get filteredProjects() {
      const cacheKey = `${this.projFilter}-${this.projects.length}`;
      if (this._filteredProjectsCache === cacheKey) {
        return this._filteredProjectsResult;
      }
      
      this._filteredProjectsCache = cacheKey;
      if (this.projFilter === 'all') {
        this._filteredProjectsResult = this.projects;
      } else {
        this._filteredProjectsResult = this.projects.filter(p => p.cat === this.projFilter);
      }
      return this._filteredProjectsResult;
    },
    
    /**
     * Invalida caches de filtros cuando cambian los datos
     */
    _invalidateFilters() {
      this._filteredProjectsCache = null;
      this._filteredProjectsResult = null;
      this._filteredSkillsCache = null;
    },

    /**
     * Animación de conteo para estadísticas
     * OPTIMIZACIÓN: Usa AnimationUtils con requestAnimationFrame
     */
    countUp(target, delay) {
      let result = 0;
      window.animationUtils.countUp(target, (value) => {
        this['_c' + delay] = value;
      }, delay);
      return result;
    },

    /**
     * Envía el formulario de contacto
     * OPTIMIZACIÓN: Validación temprana y uso de servicio
     */
    async submitForm() {
      // Validación básica antes de enviar
      if (!this.form.name || !this.form.email || !this.form.message) {
        alert('Por favor completa los campos requeridos');
        return;
      }
      
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
