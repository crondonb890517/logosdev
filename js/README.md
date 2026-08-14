# Estructura del Código JavaScript

Este directorio contiene el código JavaScript reestructurado del proyecto, organizado por responsabilidad.

## Estructura de Directorios

```
js/
├── components/          # Componentes de Alpine.js para cada página
│   ├── app.component.js      # Lógica de la página principal (index.html)
│   └── blog.component.js     # Lógica de la página del blog (blog.html)
├── services/            # Servicios para comunicación con APIs
│   └── pocketbase.service.js  # Servicio para PocketBase
├── utils/               # Utilidades y funciones helper
│   └── helpers.js             # Funciones utilitarias (tema, animaciones, etc.)
└── README.md            # Este archivo
```

## Descripción de Archivos

### `/services/pocketbase.service.js`
Servicio singleton que maneja toda la comunicación con PocketBase:
- Conexión a la instancia de PocketBase
- Obtención de proyectos
- Envío de formularios de contacto
- Obtención de posts del blog

### `/utils/helpers.js`
Utilidades generales utilizadas en toda la aplicación:
- `ThemeManager`: Manejo del tema claro/oscuro
- `AnimationUtils`: Animaciones como countUp
- `ScrollReveal`: Revelado de elementos al hacer scroll

### `/components/app.component.js`
Componente principal para `index.html`:
- Gestión del estado de la página de inicio
- Carga de proyectos
- Manejo del formulario de contacto
- Skills y experiencia laboral

### `/components/blog.component.js`
Componente para la página del blog (`blog.html`):
- Listado de posts con filtrado y búsqueda
- Visualización de posts individuales
- Navegación entre posts

## Uso en HTML

Los scripts deben cargarse en este orden específico:

```html
<!-- 1. Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- 2. Servicios (dependencias externas) -->
<script src="js/services/pocketbase.service.js"></script>

<!-- 3. Utilidades -->
<script src="js/utils/helpers.js"></script>

<!-- 4. Componentes (dependen de servicios y utilidades) -->
<script src="js/components/app.component.js"></script>

<!-- 5. Inicialización -->
<script>
  window.scrollReveal.init();
</script>
```

## Migración desde app.js

El archivo original `app.js` ha sido dividido en módulos más pequeños y especializados:
- La lógica específica de cada página ahora está en su respectivo componente
- Las funciones utilitarias están en `utils/helpers.js`
- La comunicación con PocketBase está en `services/pocketbase.service.js`

Esto mejora:
- ✅ **Mantenibilidad**: Código más fácil de entender y modificar
- ✅ **Reutilización**: Servicios y utilidades compartidos
- ✅ **Testabilidad**: Módulos independientes más fáciles de testear
- ✅ **Separación de responsabilidades**: Cada archivo tiene un propósito claro
