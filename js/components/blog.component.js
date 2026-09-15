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
          content: `
            <p class="lead">Los hooks de React revolucionaron la forma en que escribimos componentes funcionales. En este artículo exploraremos los hooks más importantes y cómo utilizarlos efectivamente.</p>
            
            <h2>¿Qué son los Hooks?</h2>
            <p>Los hooks son funciones que te permiten "enganchar" el estado de React y el ciclo de vida desde componentes funcionales. Fueron introducidos en React 16.8 y han cambiado fundamentalmente cómo escribimos componentes React.</p>
            
            <h2>useState: Manejo de Estado</h2>
            <p>El hook useState es el más básico y utilizado. Te permite tener estado local en componentes funcionales:</p>
            <pre><code class="language-javascript">const [count, setCount] = useState(0);

// Usar en el JSX
<button onClick={() => setCount(count + 1)}>
  Contador: {count}
</button></code></pre>
            
            <h2>useEffect: Efectos Secundarios</h2>
            <p>useEffect te permite realizar efectos secundarios en tus componentes, como llamadas a APIs, suscripciones, o manipulaciones del DOM:</p>
            <pre><code class="language-javascript">useEffect(() => {
  // Esto se ejecuta después de cada render
  document.title = \`Contador: \${count}\`;
  
  // Función de limpieza (opcional)
  return () => {
    console.log('Cleanup');
  };
}, [count]); // Solo se ejecuta cuando count cambia</code></pre>
            
            <h2>useContext: Contexto Global</h2>
            <p>Para evitar el prop drilling, useContext te permite acceder al contexto directamente:</p>
            <pre><code class="language-javascript">const theme = useContext(ThemeContext);</code></pre>
            
            <h2>Mejores Prácticas</h2>
            <ul>
              <li>Siempre llama los hooks en el nivel superior de tu componente</li>
              <li>Nunca llames hooks dentro de loops, condiciones o funciones anidadas</li>
              <li>Usa el array de dependencias en useEffect cuidadosamente</li>
              <li>Crea hooks personalizados para reutilizar lógica</li>
            </ul>
            
            <blockquote>"Los hooks hacen que sea más fácil reutilizar lógica entre componentes sin cambiar la estructura de tu código."</blockquote>
            
            <h2>Conclusión</h2>
            <p>Los hooks son una herramienta poderosa que simplifica el código React y hace que la reutilización de lógica sea más sencilla. Dominarlos es esencial para cualquier desarrollador React moderno.</p>
          `,
          category: 'Frontend',
          emoji: '⚛️',
          date: '2024-01-15',
          readTime: '8 min',
          tags: ['React', 'JavaScript', 'Hooks'],
          author: 'César Rondón'
        },
        {
          id: '2',
          title: 'Optimización de APIs REST',
          excerpt: 'Técnicas avanzadas para mejorar el rendimiento de tus APIs REST con caching, paginación y más.',
          content: `
            <p class="lead">El rendimiento de una API puede hacer o deshacer la experiencia del usuario. Exploraremos técnicas probadas para optimizar tus endpoints REST.</p>
            
            <h2>1. Implementar Caching Estratégico</h2>
            <p>El caching es una de las formas más efectivas de mejorar el rendimiento. HTTP ofrece varios mecanismos:</p>
            <pre><code class="language-http">// Headers de cacheo
Cache-Control: public, max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 15 Jan 2024 10:30:00 GMT</code></pre>
            
            <h2>2. Paginación Eficiente</h2>
            <p>Nunca devuelvas grandes conjuntos de datos de una vez. Implementa paginación:</p>
            <pre><code class="language-javascript">// Endpoint: /api/users?page=1&limit=20
const users = await db.users
  .find()
  .skip((page - 1) * limit)
  .limit(limit);

// Respuesta incluye metadatos
{
  data: users,
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8
  }
}</code></pre>
            
            <h2>3. Compresión de Respuestas</h2>
            <p>Habilita gzip o brotli para comprimir las respuestas:</p>
            <pre><code class="language-javascript">// Express.js con compresión
const compression = require('compression');
app.use(compression());</code></pre>
            
            <h2>4. Indexación de Base de Datos</h2>
            <p>Asegúrate de que las consultas estén optimizadas con índices apropiados en los campos más consultados.</p>
            
            <h2>5. Rate Limiting</h2>
            <p>Protege tu API del abuso implementando límites de tasa:</p>
            <pre><code class="language-javascript">const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});

app.use('/api/', limiter);</code></pre>
            
            <h2>Métricas de Rendimiento</h2>
            <ul>
              <li><strong>Time to First Byte (TTFB):</strong> < 200ms</li>
              <li><strong>Response Time:</strong> < 500ms para el percentil 95</li>
              <li><strong>Throughput:</strong> Requests por segundo que tu API puede manejar</li>
            </ul>
            
            <blockquote>"La optimización prematura es la raíz de todos los males, pero el monitoreo continuo es la clave del rendimiento sostenido."</blockquote>
            
            <h2>Conclusión</h2>
            <p>Implementar estas técnicas gradualmente y medir su impacto te ayudará a construir APIs rápidas y escalables que proporcionen una excelente experiencia a los consumidores.</p>
          `,
          category: 'Backend',
          emoji: '🔌',
          date: '2024-01-10',
          readTime: '10 min',
          tags: ['API', 'Node.js', 'Performance'],
          author: 'César Rondón'
        },
        {
          id: '3',
          title: 'Docker para principiantes',
          excerpt: 'Guía completa para empezar a usar Docker en tus proyectos de desarrollo.',
          content: `
            <p class="lead">Docker ha revolucionado la forma en que desarrollamos y desplegamos aplicaciones. Esta guía te llevará desde cero hasta crear tu primer contenedor.</p>
            
            <h2>¿Qué es Docker?</h2>
            <p>Docker es una plataforma que permite empaquetar aplicaciones y sus dependencias en contenedores ligeros y portátiles. Los contenedores son consistentes en cualquier entorno: desarrollo, testing y producción.</p>
            
            <h2>Conceptos Fundamentales</h2>
            <ul>
              <li><strong>Imagen:</strong> Plantilla de solo lectura con las instrucciones para crear un contenedor</li>
              <li><strong>Contenedor:</strong> Instancia ejecutable de una imagen</li>
              <li><strong>Dockerfile:</strong> Archivo de texto con instrucciones para construir una imagen</li>
              <li><strong>Docker Compose:</strong> Herramienta para definir y ejecutar aplicaciones multi-contenedor</li>
            </ul>
            
            <h2>Tu Primer Dockerfile</h2>
            <pre><code class="language-dockerfile"># Imagen base
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "server.js"]</code></pre>
            
            <h2>Comandos Esenciales</h2>
            <pre><code class="language-bash"># Construir una imagen
docker build -t mi-app .

# Ejecutar un contenedor
docker run -p 3000:3000 mi-app

# Listar contenedores
docker ps

# Ver logs
docker logs <container-id>

# Detener contenedor
docker stop <container-id></code></pre>
            
            <h2>Docker Compose</h2>
            <p>Para aplicaciones con múltiples servicios (app + base de datos):</p>
            <pre><code class="language-yaml">version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:</code></pre>
            
            <h2>Mejores Prácticas</h2>
            <ul>
              <li>Usa imágenes oficiales y específicas (ej: node:18-alpine en lugar de node:latest)</li>
              <li>Minimiza el número de capas en tu Dockerfile</li>
              <li>Usa .dockerignore para excluir archivos innecesarios</li>
              <li>No ejecutes procesos como root dentro del contenedor</li>
              <li>Utiliza volúmenes para datos persistentes</li>
            </ul>
            
            <blockquote>"Docker resuelve el problema clásico: 'Funciona en mi máquina'. Con contenedores, funciona en todas partes."</blockquote>
            
            <h2>Siguientes Pasos</h2>
            <p>Una vez domines lo básico, explora Docker Swarm o Kubernetes para orquestación, y aprende sobre seguridad de contenedores y optimización de imágenes.</p>
          `,
          category: 'DevOps',
          emoji: '🐳',
          date: '2024-01-05',
          readTime: '12 min',
          tags: ['Docker', 'Containers', 'DevOps'],
          author: 'César Rondón'
        },
        {
          id: '4',
          title: 'TypeScript: Tips y Tricks',
          excerpt: 'Consejos prácticos para sacar el máximo provecho de TypeScript en tu día a día.',
          content: `
            <p class="lead">TypeScript añade poderosas capacidades de tipado a JavaScript. Descubre trucos avanzados que mejorarán tu productividad y calidad de código.</p>
            
            <h2>1. Type Guards Personalizados</h2>
            <p>Crea funciones que ayuden a TypeScript a inferir tipos correctamente:</p>
            <pre><code class="language-typescript">function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// Uso
if (isFish(myPet)) {
  myPet.swim(); // TypeScript sabe que es Fish
}</code></pre>
            
            <h2>2. Utility Types Esenciales</h2>
            <p>TypeScript proporciona tipos utilitarios muy útiles:</p>
            <pre><code class="language-typescript">// Hacer propiedades opcionales
type PartialUser = Partial<User>;

// Hacer propiedades requeridas
type RequiredUser = Required<User>;

// Hacer propiedades de solo lectura
type ReadonlyUser = Readonly<User>;

// Extraer ciertas propiedades
type UserPreview = Pick<User, 'id' | 'name'>;

// Omitir propiedades
type UserWithoutPassword = Omit<User, 'password'>;</code></pre>
            
            <h2>3. Generics Avanzados</h2>
            <p>Los generics permiten crear componentes reutilizables:</p>
            <pre><code class="language-typescript">function identity<T>(arg: T): T {
  return arg;
}

// Con restricción
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const result = merge({ name: 'John' }, { age: 30 });
// result: { name: string } & { age: number }</code></pre>
            
            <h2>4. Conditional Types</h2>
            <p>Tipos que dependen de una condición:</p>
            <pre><code class="language-typescript">type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false</code></pre>
            
            <h2>5. Template Literal Types</h2>
            <p>Crea tipos basados en strings:</p>
            <pre><code class="language-typescript">type EventName = \`on\${Capitalize<string>}\`;

type Handler = (event: EventName) => void;

// Válidos:
const handler1: Handler = (e: 'onClick') => {};
const handler2: Handler = (e: 'onSubmit') => {};</code></pre>
            
            <h2>6. Inferir Tipos con 'infer'</h2>
            <pre><code class="language-typescript">type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type MyFunc = () => string;
type Result = ReturnType<MyFunc>; // string</code></pre>
            
            <h2>Configuración Recomendada de tsconfig.json</h2>
            <pre><code class="language-json">{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true
  }
}</code></pre>
            
            <blockquote>"TypeScript no es solo sobre tipos, es sobre documentación viva que se mantiene sincronizada con tu código."</blockquote>
            
            <h2>Conclusión</h2>
            <p>Dominar estos conceptos te permitirá escribir código más seguro, mantenible y profesional. La curva de aprendizaje vale la pena.</p>
          `,
          category: 'Frontend',
          emoji: '📘',
          date: '2023-12-28',
          readTime: '9 min',
          tags: ['TypeScript', 'JavaScript', 'Tips'],
          author: 'César Rondón'
        },
        {
          id: '5',
          title: 'Arquitectura de Microservicios',
          excerpt: 'Cuándo y cómo implementar una arquitectura de microservicios en tu proyecto.',
          content: `
            <p class="lead">Los microservicios ofrecen escalabilidad y flexibilidad, pero también complejidad. Aprende cuándo adoptarlos y cómo hacerlo correctamente.</p>
            
            <h2>¿Qué son los Microservicios?</h2>
            <p>Es un estilo arquitectónico que estructura una aplicación como una colección de servicios pequeños, autónomos y enfocados en un dominio específico.</p>
            
            <h2>Ventajas Clave</h2>
            <ul>
              <li><strong>Escalabilidad independiente:</strong> Escala solo los servicios que lo necesitan</li>
              <li><strong>Despliegue independiente:</strong> Actualiza servicios sin afectar toda la aplicación</li>
              <li><strong>Tecnología políglota:</strong> Usa la mejor tecnología para cada servicio</li>
              <li><strong>Resiliencia:</strong> Fallos aislados no colapsan todo el sistema</li>
            </ul>
            
            <h2>Desventajas a Considerar</h2>
            <ul>
              <li>Complejidad operacional aumentada</li>
              <li>Overhead de comunicación entre servicios</li>
              <li>Consistencia eventual en lugar de transacciones ACID</li>
              <li>Testing más complejo</li>
            </ul>
            
            <h2>Patrones Comunes</h2>
            
            <h3>API Gateway</h3>
            <p>Punto de entrada único que enruta solicitudes a los servicios apropiados:</p>
            <pre><code class="language-javascript">// Ejemplo con Express
app.use('/users', userProxy);
app.use('/orders', orderProxy);
app.use('/products', productProxy);</code></pre>
            
            <h3>Service Discovery</h3>
            <p>Los servicios se registran y descubren dinámicamente:</p>
            <pre><code class="language-yaml"># Kubernetes Service
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user
  ports:
    - port: 80
      targetPort: 3000</code></pre>
            
            <h3>Circuit Breaker</h3>
            <p>Previene fallos en cascada:</p>
            <pre><code class="language-javascript">const circuitBreaker = require('opossum');

const breaker = new circuitBreaker(asyncFunction, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
});</code></pre>
            
            <h2>Comunicación entre Servicios</h2>
            <ul>
              <li><strong>Síncrona:</strong> HTTP/REST, gRPC</li>
              <li><strong>Asíncrona:</strong> Message queues (RabbitMQ, Kafka), Event streaming</li>
            </ul>
            
            <h2>Gestión de Datos</h2>
            <p>Cada servicio debe tener su propia base de datos (Database per Service pattern). Evita bases de datos compartidas.</p>
            
            <blockquote>"Los microservicios no son una solución mágica. Son una herramienta poderosa que resuelve problemas específicos de escala y organización."</blockquote>
            
            <h2>¿Cuándo Adoptarlos?</h2>
            <ul>
              <li>✅ Equipos grandes y distribuidos</li>
              <li>✅ Necesidad de escalar componentes específicos</li>
              <li>✅ Requisitos de disponibilidad alta</li>
              <li>❌ Startups pequeñas con equipos reducidos</li>
              <li>❌ Proyectos con deadlines muy ajustados</li>
            </ul>
            
            <h2>Conclusión</h2>
            <p>Comienza con un monolito bien modularizado y divide cuando el crecimiento lo justifique. La arquitectura debe seguir la estructura de tu organización (Ley de Conway).</p>
          `,
          category: 'Backend',
          emoji: '🏗️',
          date: '2023-12-20',
          readTime: '11 min',
          tags: ['Microservicios', 'Arquitectura', 'Backend'],
          author: 'César Rondón'
        },
        {
          id: '6',
          title: 'CSS Grid vs Flexbox',
          excerpt: 'Comparativa práctica entre CSS Grid y Flexbox. Cuándo usar cada uno.',
          content: `
            <p class="lead">Grid y Flexbox son las dos herramientas de layout más poderosas de CSS moderno. Aprende sus diferencias y cuándo usar cada una.</p>
            
            <h2>Flexbox: Layout Unidimensional</h2>
            <p>Flexbox está diseñado para layouts en una sola dimensión (fila O columna):</p>
            <pre><code class="language-css">.container {
  display: flex;
  justify-content: space-between; /* Horizontal */
  align-items: center; /* Vertical */
  gap: 1rem;
}

.item {
  flex: 1; /* Crece para ocupar espacio disponible */
}</code></pre>
            
            <h3>Cuándo usar Flexbox:</h3>
            <ul>
              <li>Navegaciones horizontales</li>
              <li>Centrar contenido vertical y horizontalmente</li>
              <li>Distribuir items en una fila o columna</li>
              <li>Layouts simples de componentes</li>
            </ul>
            
            <h2>CSS Grid: Layout Bidimensional</h2>
            <p>Grid maneja filas Y columnas simultáneamente:</p>
            <pre><code class="language-css">.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 200px auto;
  gap: 20px;
}

.item {
  grid-column: 1 / 3; /* Ocupa 2 columnas */
  grid-row: 2;
}</code></pre>
            
            <h3>Cuándo usar Grid:</h3>
            <ul>
              <li>Layouts de página completos</li>
              <li>Galerías de imágenes</li>
              <li>Diseños complejos con áreas definidas</li>
              <li>Cuando necesitas control preciso en ambas dimensiones</li>
            </ul>
            
            <h2>Ejemplo Comparativo</h2>
            
            <h3>Mismo layout con Flexbox:</h3>
            <pre><code class="language-css">.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.gallery-item {
  flex: 0 0 calc(33.333% - 20px);
}</code></pre>
            
            <h3>Mismo layout con Grid:</h3>
            <pre><code class="language-css">.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Más limpio y semántico */</code></pre>
            
            <h2>Áreas de Grid (Grid Areas)</h2>
            <p>Grid permite nombrar áreas para layouts complejos:</p>
            <pre><code class="language-css">.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr 200px;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }</code></pre>
            
            <h2>Auto-fit vs Auto-fill</h2>
            <pre><code class="language-css">/* Auto-fill: llena con tracks vacíos si es necesario */
.container {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* Auto-fit: colapsa tracks vacíos */
.container {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}</code></pre>
            
            <h2>La Combinación Perfecta</h2>
            <p>En la práctica, usarás ambos:</p>
            <ul>
              <li><strong>Grid</strong> para el layout macro de la página</li>
              <li><strong>Flexbox</strong> para componentes internos (cards, botones, navegación)</li>
            </ul>
            
            <blockquote>"Grid es para el esqueleto, Flexbox es para los músculos. Úsalos juntos para crear layouts robustos."</blockquote>
            
            <h2>Herramientas de Debugging</h2>
            <p>Los navegadores modernos tienen excelentes herramientas visuales para Grid y Flexbox. Actívalas en las DevTools.</p>
            
            <h2>Conclusión</h2>
            <p>No son competidores, son complementarios. Domina ambos y elige según la dimensionalidad del problema que estás resolviendo.</p>
          `,
          category: 'Frontend',
          emoji: '🎨',
          date: '2023-12-15',
          readTime: '10 min',
          tags: ['CSS', 'Grid', 'Flexbox'],
          author: 'César Rondón'
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
