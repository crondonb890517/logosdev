/**
 * Componente para la página del Blog
 * Maneja la lógica de listados y visualización de posts
 */

function createBlogPage() {
  return {
    theme: document.documentElement.getAttribute('data-bs-theme') || 'light',
    posts: [],
    currentPost: null,
    prevPost: null,
    nextPost: null,
    filterCategory: 'all',
    searchQuery: '',
    categories: [],

    /**
     * Inicialización del componente
     */
    init() {
      // Cargar posts desde PocketBase o usar datos fallback
      this.loadPosts();
      
      // Manejar navegación por URL (para posts individuales)
      this.handleRouting();
      
      // Inicializar navbar collapse
      this.$nextTick(() => {
        const navEl = document.getElementById('mainNav');
        if (navEl) {
          this.navbarCollapse = new bootstrap.Collapse(navEl, { toggle: false });
        }
      });
    },

    /**
     * Carga los posts del blog
     */
    async loadPosts() {
      try {
        this.posts = await window.pocketBaseService.getBlogPosts();
      } catch (error) {
        console.warn('Usando datos fallback para blog posts');
        this.posts = this.getFallbackPosts();
      }
      
      // Extraer categorías únicas
      this.categories = [...new Set(this.posts.map(p => p.category))];
    },

    /**
     * Datos fallback para posts
     */
    getFallbackPosts() {
      return [
        {
          id: '1',
          title: 'Introducción a React Hooks',
          excerpt: 'Aprende cómo usar los hooks de React para manejar estado y efectos secundarios en componentes funcionales.',
          category: 'Frontend',
          emoji: '⚛️',
          date: '2024-01-15',
          tags: ['React', 'JavaScript', 'Hooks']
        },
        {
          id: '2',
          title: 'Optimización de APIs REST',
          excerpt: 'Técnicas avanzadas para mejorar el rendimiento de tus APIs REST con caching, paginación y más.',
          category: 'Backend',
          emoji: '🔌',
          date: '2024-01-10',
          tags: ['API', 'Node.js', 'Performance']
        },
        {
          id: '3',
          title: 'Docker para principiantes',
          excerpt: 'Guía completa para empezar a usar Docker en tus proyectos de desarrollo.',
          category: 'DevOps',
          emoji: '🐳',
          date: '2024-01-05',
          tags: ['Docker', 'Containers', 'DevOps']
        },
        {
          id: '4',
          title: 'TypeScript: Tips y Tricks',
          excerpt: 'Consejos prácticos para sacar el máximo provecho de TypeScript en tu día a día.',
          category: 'Frontend',
          emoji: '📘',
          date: '2023-12-28',
          tags: ['TypeScript', 'JavaScript', 'Tips']
        },
        {
          id: '5',
          title: 'Arquitectura de Microservicios',
          excerpt: 'Cuándo y cómo implementar una arquitectura de microservicios en tu proyecto.',
          category: 'Backend',
          emoji: '🏗️',
          date: '2023-12-20',
          tags: ['Microservicios', 'Arquitectura', 'Backend']
        },
        {
          id: '6',
          title: 'CSS Grid vs Flexbox',
          excerpt: 'Comparativa práctica entre CSS Grid y Flexbox. Cuándo usar cada uno.',
          category: 'Frontend',
          emoji: '🎨',
          date: '2023-12-15',
          tags: ['CSS', 'Grid', 'Flexbox']
        }
      ];
    },

    /**
     * Maneja la navegación por URL para posts individuales
     */
    handleRouting() {
      const urlParams = new URLSearchParams(window.location.search);
      const postTitle = urlParams.get('post');
      
      if (postTitle) {
        this.loadPost(postTitle);
      }
    },

    /**
     * Carga un post específico
     */
    loadPost(title) {
      const post = this.posts.find(p => p.title === title);
      if (post) {
        this.currentPost = post;
        
        // Encontrar post anterior y siguiente
        const currentIndex = this.posts.findIndex(p => p.title === title);
        this.prevPost = currentIndex > 0 ? this.posts[currentIndex - 1] : null;
        this.nextPost = currentIndex < this.posts.length - 1 ? this.posts[currentIndex + 1] : null;
        
        // Actualizar URL sin recargar
        window.history.pushState({ post: title }, '', `blog.html?post=${encodeURIComponent(title)}`);
        window.scrollTo(0, 0);
      }
    },

    /**
     * Volver al listado de posts
     */
    goBack() {
      this.currentPost = null;
      this.prevPost = null;
      this.nextPost = null;
      window.history.pushState({}, '', 'blog.html');
    },

    /**
     * Posts filtrados por categoría y búsqueda
     */
    get filteredPosts() {
      let filtered = this.posts;
      
      // Filtrar por categoría
      if (this.filterCategory !== 'all') {
        filtered = filtered.filter(p => p.category === this.filterCategory);
      }
      
      // Filtrar por búsqueda
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags.some(t => t.toLowerCase().includes(query))
        );
      }
      
      return filtered;
    },

    /**
     * Alterna entre tema claro y oscuro
     */
    toggleTheme() {
      this.theme = window.themeManager.toggle(this.theme);
    },

    /**
     * Cierra el menú móvil
     */
    closeMenu() {
      if (this.navbarCollapse && window.innerWidth < 992) {
        this.navbarCollapse.hide();
      }
    }
  };
}

// Hacer disponible globalmente para Alpine.js
window.blogPage = createBlogPage;
