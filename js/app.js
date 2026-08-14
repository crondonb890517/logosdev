
// PocketBase ya está disponible globalmente desde el CDN en index.html
// No es necesario importarlo como módulo ES6

function app(){
  return {
    theme: document.documentElement.getAttribute('data-bs-theme') || 'light',
    activeTab:'Frontend',
    projFilter:'all',
    sent:false,
    form:{name:'',email:'',subject:'',message:''},
    navbarCollapse: null,
    projects: [], // Inicialmente vacío, se cargará desde PocketBase

    init(){
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
      // CONFIGURACIÓN: Cambia esta URL por la de tu instancia de PocketBase
      const PB_URL = 'https://logosdev.pockethost.io'; 
      const COLLECTION_NAME = 'projects'; // Nombre de tu colección en PocketBase
      
      try {
        const pb = new PocketBase(PB_URL);
        
        // Obtener datos de PocketBase
        // Asegúrate de que tu colección tenga los campos: title, description, image, tags, category
        const records = await pb.collection(COLLECTION_NAME).getFullList({
          sort: '-created',
          filter: 'published = true', // Opcional: si tienes un campo booleano 'published'
        });

        // Transformar datos de PocketBase al formato esperado
        this.projects = records.map(record => ({
          title: record.title,
          cat: record.category || 'Web',
          emoji: record.emoji || '🚀',
          desc: record.description,
          techs: record.tags || [],
          image: record.image ? pb.getFileUrl(record, record.image) : null
        }));
        
      } catch (error) {
        console.error('Error al cargar proyectos desde PocketBase:', error);
        // Fallback a datos locales si falla la conexión
        this.projects = [
          {title:'E-commerce Platform',cat:'Web',emoji:'🛍️',desc:'Tienda online completa con pasarela de pagos, panel admin y analíticas en tiempo real.',techs:['Next.js','Stripe','PostgreSQL']},
          {title:'Task Manager App',cat:'Mobile',emoji:'✅',desc:'App móvil de gestión de tareas con sincronización en la nube y notificaciones push.',techs:['React Native','Firebase']},
          {title:'Analytics API',cat:'API',emoji:'📊',desc:'API REST de alto rendimiento para procesamiento de datos analíticos con +1M requests/día.',techs:['Node.js','Redis','Docker']},
          {title:'Social Dashboard',cat:'Web',emoji:'💬',desc:'Dashboard unificado para gestionar múltiples redes sociales con IA para sugerencias.',techs:['Vue','Python','OpenAI']},
          {title:'Fitness Tracker',cat:'Mobile',emoji:'💪',desc:'App de seguimiento de entrenamientos con rutinas personalizadas y métricas.',techs:['Flutter','GraphQL']},
          {title:'Booking System',cat:'API',emoji:'📅',desc:'Sistema de reservas multi-tenant con calendario en tiempo real y webhooks.',techs:['Node.js','MongoDB']},
        ];
      }
    },

    closeMenu(){
      // Cerrar el menú móvil al hacer click en un enlace
      if(this.navbarCollapse && window.innerWidth < 992) {
        this.navbarCollapse.hide();
      }
    },

    toggleTheme(){
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', this.theme);
      try{ localStorage.setItem('u-theme', this.theme); }catch(e){}
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
      setTimeout(()=>{
        const step=Math.max(1,Math.floor(target/40));
        const iv=setInterval(()=>{
          n+=step;
          if(n>=target){n=target;clearInterval(iv)}
          this['_c'+delay]=n;
        },40);
      },delay*200+600);
      return 0;
    },
    async submitForm(){
      const PB_URL = 'https://logosdev.pockethost.io';
      const COLLECTION_NAME = 'contactos';
      
      try {
        const pb = new PocketBase(PB_URL);
        
        // Preparar los datos según los campos de la colección
        const data = {
          nombre_completo: this.form.name,
          correo_electronico: this.form.email,
          asunto: this.form.subject,
          mensage: this.form.message
        };
        
        // Insertar el registro en la colección 'contactos'
        await pb.collection(COLLECTION_NAME).create(data);
        
        this.sent = true;
        this.form = { name: '', email: '', subject: '', message: '' };
        setTimeout(() => this.sent = false, 4000);
        
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
      }
    },
  }
}

// Reveal on scroll
const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.12});
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
});

