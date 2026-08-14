/**
 * Servicio de PocketBase
 * Maneja la conexión y operaciones con la base de datos
 */

const POCKETBASE_CONFIG = {
  URL: 'https://logosdev.pockethost.io',
  COLLECTIONS: {
    PROJECTS: 'projects',
    CONTACTOS: 'contactos'
  }
};

class PocketBaseService {
  constructor() {
    this.pb = null;
  }

  /**
   * Inicializa la conexión con PocketBase
   */
  init() {
    try {
      this.pb = new PocketBase(POCKETBASE_CONFIG.URL);
      console.log('PocketBase initialized:', POCKETBASE_CONFIG.URL);
    } catch (error) {
      console.error('Error initializing PocketBase:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los proyectos publicados
   * @returns {Promise<Array>} Lista de proyectos
   */
  async getProjects() {
    if (!this.pb) this.init();
    
    try {
      const records = await this.pb.collection(POCKETBASE_CONFIG.COLLECTIONS.PROJECTS).getFullList({
        sort: '-created',
        filter: 'published = true'
      });

      return records.map(record => ({
        title: record.title,
        cat: record.category || 'Web',
        emoji: record.emoji || '🚀',
        desc: record.description,
        techs: record.tags || [],
        image: record.image ? this.pb.getFileUrl(record, record.image) : null
      }));
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
   * @returns {Promise<Array>} Lista de posts
   */
  async getBlogPosts() {
    if (!this.pb) this.init();
    
    try {
      const records = await this.pb.collection('posts').getFullList({
        sort: '-created',
        filter: 'published = true'
      });

      return records.map(record => ({
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
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
window.pocketBaseService = new PocketBaseService();
