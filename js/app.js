/**
 * Aplicación principal - Punto de entrada
 * OPTIMIZACIÓN: Carga diferida y inicialización eficiente
 */

// PocketBase ya está disponible globalmente desde el CDN en index.html

function app(){
  return {
    theme: window.themeManager ? window.themeManager.getInitialTheme() : (document.documentElement.getAttribute('data-bs-theme') || 'light'),
    activeTab:'Frontend',
    projFilter:'all',
    sent:false,
    form:{name:'',email:'',subject:'',message:''},
    navbarCollapse: null,
    projects: [],

    init(){
      // Aplicar tema inicial si está disponible
      if (window.themeManager) {
        window.themeManager.applyTheme(this.theme);
      }
      
      // Inicializar el collapse del navbar después de que Alpine se inicialice
      this.$nextTick(() => {
        const navEl = document.getElementById('mainNav');
        if(navEl) {
          this.navbarCollapse = new bootstrap.Collapse(navEl, {toggle: false});
        }
      });
      
      // Cargar proyectos desde PocketBase
      this.loadProjectsFromPB();
    },
    
    async loadProjectsFromPB() {
      // Usar servicio optimizado si está disponible
      if (window.pocketBaseService) {
        try {
          this.projects = await window.pocketBaseService.getProjects();
          return;
        } catch (error) {
          console.warn('Error cargando desde PocketBase, usando fallback');
        }
      }
      
      // Fallback directo si no hay servicio
      this.projects = [
        {title:'E-commerce Platform',cat:'Web',emoji:'🛍️',desc:'Tienda online completa con pasarela de pagos, panel admin y analíticas en tiempo real.',techs:['Next.js','Stripe','PostgreSQL']},
        {title:'Task Manager App',cat:'Mobile',emoji:'✅',desc:'App móvil de gestión de tareas con sincronización en la nube y notificaciones push.',techs:['React Native','Firebase']},
        {title:'Analytics API',cat:'API',emoji:'📊',desc:'API REST de alto rendimiento para procesamiento de datos analíticos con +1M requests/día.',techs:['Node.js','Redis','Docker']},
        {title:'Social Dashboard',cat:'Web',emoji:'💬',desc:'Dashboard unificado para gestionar múltiples redes sociales con IA para sugerencias.',techs:['Vue','Python','OpenAI']},
        {title:'Fitness Tracker',cat:'Mobile',emoji:'💪',desc:'App de seguimiento de entrenamientos con rutinas personalizadas y métricas.',techs:['Flutter','GraphQL']},
        {title:'Booking System',cat:'API',emoji:'📅',desc:'Sistema de reservas multi-tenant con calendario en tiempo real y webhooks.',techs:['Node.js','MongoDB']},
      ];
    },

    closeMenu(){
      if(this.navbarCollapse && window.innerWidth < 992) {
        this.navbarCollapse.hide();
      }
    },

    toggleTheme(){
      if (window.themeManager) {
        this.theme = window.themeManager.toggle(this.theme);
      } else {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', this.theme);
        try{ localStorage.setItem('u-theme', this.theme); }catch(e){}
      }
    },

    skills:{
      Frontend:[
        {name:'React / Next.js',level:95,icon:'⚛️'},
        {name:'Vue / Nuxt',level:85,icon:'🎨'},
        {name:'TypeScript',level:90,icon:'📘'},
        {name:'Tailwind CSS',level:92,icon:'🎨'},
        {name:'Alpine.js',level:80,icon:'🏔️'},
        {name:'HTML / CSS',level:98,icon:'🌐'},
      ],
      Backend:[
        {name:'Node.js',level:92,icon:'🟢'},
        {name:'Python / Django',level:85,icon:'🐍'},
        {name:'PostgreSQL',level:88,icon:'🐘'},
        {name:'MongoDB',level:82,icon:'🍃'},
        {name:'GraphQL',level:78,icon:'◈'},
        {name:'REST APIs',level:95,icon:'🔌'},
      ],
      Tools:[
        {name:'Git / GitHub',level:93,icon:'📦'},
        {name:'Docker',level:85,icon:'🐳'},
        {name:'AWS / Vercel',level:80,icon:'☁️'},
        {name:'CI/CD',level:82,icon:'⚙️'},
        {name:'Figma',level:75,icon:'🎯'},
        {name:'Linux',level:80,icon:'🐧'},
      ],
    },
    get filteredSkills(){return this.skills[this.activeTab]||[]},
    jobs:[
      {year:'2023 — Presente',role:'Senior Full-Stack Developer',company:'TechCorp · Madrid',desc:'Lidero el desarrollo de una plataforma SaaS con +100k usuarios. Arquitectura de microservicios, mentoría a juniors y definición de estándares de código.'},
      {year:'2021 — 2023',role:'Full-Stack Developer',company:'StartupXYZ · Remoto',desc:'Construí desde cero el MVP del producto principal. Stack: React, Node.js, PostgreSQL. Escalé la plataforma de 0 a 50k usuarios en 18 meses.'},
      {year:'2019 — 2021',role:'Frontend Developer',company:'Digital Agency · Barcelona',desc:'Desarrollo de sitios web y aplicaciones para clientes internacionales. Especializado en React, animaciones y performance web.'},
      {year:'2018 — 2019',role:'Junior Developer',company:'CodeFactory · Madrid',desc:'Primeros pasos profesionales. Mantenimiento de legacy code, desarrollo de features y aprendizaje intensivo de buenas prácticas.'},
    ],
    projects:[
      {title:'E-commerce Platform',cat:'Web',emoji:'🛍️',desc:'Tienda online completa con pasarela de pagos, panel admin y analíticas en tiempo real.',techs:['Next.js','Stripe','PostgreSQL']},
      {title:'Task Manager App',cat:'Mobile',emoji:'✅',desc:'App móvil de gestión de tareas con sincronización en la nube y notificaciones push.',techs:['React Native','Firebase']},
      {title:'Analytics API',cat:'API',emoji:'📊',desc:'API REST de alto rendimiento para procesamiento de datos analíticos con +1M requests/día.',techs:['Node.js','Redis','Docker']},
      {title:'Social Dashboard',cat:'Web',emoji:'💬',desc:'Dashboard unificado para gestionar múltiples redes sociales con IA para sugerencias.',techs:['Vue','Python','OpenAI']},
      {title:'Fitness Tracker',cat:'Mobile',emoji:'💪',desc:'App de seguimiento de entrenamientos con rutinas personalizadas y métricas.',techs:['Flutter','GraphQL']},
      {title:'Booking System',cat:'API',emoji:'📅',desc:'Sistema de reservas multi-tenant con calendario en tiempo real y webhooks.',techs:['Node.js','MongoDB']},
    ],
    get filteredProjects(){
      if(this.projFilter==='all')return this.projects;
      return this.projects.filter(p=>p.cat===this.projFilter);
    },
    countUp(target,delay){
      let n=0;
      setTimeout(()=>{\n        const step=Math.max(1,Math.floor(target/40));\n        const animate = () => {\n          n+=step;\n          if(n>=target){n=target;return}\n          this['_c'+delay]=n;\n          requestAnimationFrame(animate);\n        };\n        requestAnimationFrame(animate);\n      },delay*200+600);\n      return 0;\n    },
    async submitForm(){
      if (window.pocketBaseService) {
        try {
          await window.pocketBaseService.submitContactForm(this.form);
          this.sent = true;
          this.form = { name: '', email: '', subject: '', message: '' };\n          setTimeout(() => this.sent = false, 4000);\n          return;
        } catch (error) {\n          console.error('Error al enviar el formulario:', error);\n        }\n      }\n      \n      // Fallback si no hay servicio\n      alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');\n    },
  }\n}\n\n// Reveal on scroll optimizado\nconst ScrollReveal = {\n  _observer: null,\n  init() {\n    if (this._observer) return;\n    \n    this._observer = new IntersectionObserver((entries) => {\n      entries.forEach(e => {\n        if(e.isIntersecting) {\n          e.target.classList.add('visible');\n          this._observer.unobserve(e.target);\n        }\n      });\n    }, {threshold: 0.12});\n    \n    document.addEventListener('DOMContentLoaded', () => {\n      document.querySelectorAll('.reveal').forEach(el => this._observer.observe(el));\n    });\n  }\n};\n\nScrollReveal.init();
