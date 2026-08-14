/**
 * Servicio de PocketBase
 * Maneja la conexión y operaciones con la base de datos
 * OPTIMIZACIÓN: Singleton, caching y reutilización de instancia
 */

const POCKETBASE_CONFIG = {
  URL: 'https://logosdev.pockethost.io',
  COLLECTIONS: {
    PROJECTS: 'projects',
    CONTACTOS: 'contactos',
    POSTS: 'posts'
  }
};

class PocketBaseService {
  constructor() {
    this.pb = null;
    this._projectsCache = null;
    this._postsCache = null;
    this._cacheExpiry = 5 * 60 * 1000; // 5 minutos
    this._lastFetchTime = { projects: 0, posts: 0 };
  }

  /**
   * Inicializa la conexión con PocketBase
   * OPTIMIZACIÓN: Reutiliza instancia existente
   */
  init() {
    if (this.pb) return this.pb;
    
    try {
      this.pb = new PocketBase(POCKETBASE_CONFIG.URL);
      console.log('PocketBase initialized:', POCKETBASE_CONFIG.URL);
      return this.pb;
    } catch (error) {
      console.error('Error initializing PocketBase:', error);
      throw error;
    }
  }

  /**
   * Verifica si el cache es válido
   * @param {string} key - Clave del cache
   * @returns {boolean} True si el cache es válido
   */
  _isCacheValid(key) {
    const now = Date.now();
    return this._lastFetchTime[key] && (now - this._lastFetchTime[key]) < this._cacheExpiry;
  }

  /**
   * Obtiene todos los proyectos publicados
   * OPTIMIZACIÓN: Cachea resultados por 5 minutos
   * @returns {Promise<Array>} Lista de proyectos
   */
  async getProjects() {
    // Retornar cache si es válido
    if (this._projectsCache && this._isCacheValid('projects')) {
      console.log('Returning cached projects');
      return this._projectsCache;
    }
    
    if (!this.pb) this.init();
    
    try {
      const records = await this.pb.collection(POCKETBASE_CONFIG.COLLECTIONS.PROJECTS).getFullList({
        sort: '-created',
        filter: 'published = true'
      });

      this._projectsCache = records.map(record => ({
        title: record.title,
        cat: record.category || 'Web',
        emoji: record.emoji || '🚀',
        desc: record.description,
        techs: record.tags || [],
        image: record.image ? this.pb.getFileUrl(record, record.image) : null
      }));
      
      this._lastFetchTime.projects = Date.now();
      return this._projectsCache;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  /**
   * Envía un formulario de contacto
   * @param {Object} data - Datos del formulario
   * @returns {Promise<Object>} Respuesta de la creación
   */
  async submitContactForm(data) {
    if (!this.pb) this.init();
    
    try {
      const formattedData = {
        nombre_completo: data.name,
        correo_electronico: data.email,
        asunto: data.subject,
        mensage: data.message
      };

      return await this.pb.collection(POCKETBASE_CONFIG.COLLECTIONS.CONTACTOS).create(formattedData);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }

  /**
   * Obtiene posts del blog
   * OPTIMIZACIÓN: Cachea resultados por 5 minutos
   * @returns {Promise<Array>} Lista de posts
   */
  async getBlogPosts() {
    // Retornar cache si es válido
    if (this._postsCache && this._isCacheValid('posts')) {
      console.log('Returning cached blog posts');
      return this._postsCache;
    }
    
    if (!this.pb) this.init();
    
    try {
      const records = await this.pb.collection(POCKETBASE_CONFIG.COLLECTIONS.POSTS).getFullList({
        sort: '-created',
        filter: 'published = true'
      });

      this._postsCache = records.map(record => ({
        id: record.id,
        title: record.title,
        excerpt: record.excerpt,
        content: record.content,
        category: record.category || 'General',
        emoji: record.emoji || '📝',
        date: record.date || new Date().toLocaleDateString('es-ES'),
        tags: record.tags || [],
        published: record.published
      }));
      
      this._lastFetchTime.posts = Date.now();
      return this._postsCache;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  /**
   * Invalida el cache manualmente
   * @param {string} key - Clave del cache a invalidar ('projects' o 'posts')
   */
  invalidateCache(key) {
    if (key === 'projects') {
      this._projectsCache = null;
      this._lastFetchTime.projects = 0;
    } else if (key === 'posts') {
      this._postsCache = null;
      this._lastFetchTime.posts = 0;
    }
  }
}

// Exportar instancia singleton
window.pocketBaseService = new PocketBaseService();
