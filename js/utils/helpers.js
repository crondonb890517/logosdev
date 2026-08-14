/**
 * Utilidades para manejo del tema (claro/oscuro)
 * OPTIMIZACIÓN: Cache del tema para evitar lecturas repetidas del DOM
 */

const ThemeManager = {
  STORAGE_KEY: 'u-theme',
  _cachedTheme: null,
  
  /**
   * Obtiene el tema actual del localStorage o del sistema
   * OPTIMIZACIÓN: Cachea el resultado para evitar lecturas repetidas
   * @returns {string} 'light' o 'dark'
   */
  getInitialTheme() {
    if (this._cachedTheme) return this._cachedTheme;
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this._cachedTheme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      return this._cachedTheme;
    } catch (e) {
      console.warn('Error accessing localStorage:', e);
      this._cachedTheme = 'light';
      return this._cachedTheme;
    }
  },

  /**
   * Aplica el tema al documento HTML
   * OPTIMIZACIÓN: Evita reflow innecesario si el tema no cambió
   * @param {string} theme - 'light' o 'dark'
   */
  applyTheme(theme) {
    const currentAttr = document.documentElement.getAttribute('data-bs-theme');
    if (currentAttr === theme) return;
    document.documentElement.setAttribute('data-bs-theme', theme);
  },

  /**
   * Guarda el tema en localStorage
   * @param {string} theme - 'light' o 'dark'
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
      this._cachedTheme = theme;
    } catch (e) {
      console.warn('Error saving theme to localStorage:', e);
    }
  },

  /**
   * Alterna entre tema claro y oscuro
   * @param {string} currentTheme - Tema actual
   * @returns {string} Nuevo tema
   */
  toggle(currentTheme) {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
    return newTheme;
  }
};

/**
 * Utilidades para animaciones y efectos visuales
 * OPTIMIZACIÓN: requestAnimationFrame para mejor rendimiento
 */
const AnimationUtils = {
  /**
   * Animación de conteo numérico optimizada con RAF
   * @param {number} target - Valor objetivo
   * @param {Function} onUpdate - Callback para actualizar el valor
   * @param {number} delay - Retraso inicial en ms
   */
  countUp(target, onUpdate, delay = 0) {
    let current = 0;
    
    setTimeout(() => {
      const step = Math.max(1, Math.floor(target / 40));
      const animate = () => {
        current += step;
        if (current >= target) {
          current = target;
          onUpdate(current);
          return;
        }
        onUpdate(current);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay * 200 + 600);
  }
};

/**
 * Utilidades para reveal on scroll
 * OPTIMIZACIÓN: Un solo observer para todos los elementos
 */
const ScrollReveal = {
  _observer: null,
  
  init() {
    if (this._observer) return; // Evitar múltiples observadores
    
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this._observer.unobserve(entry.target); // Dejar de observar una vez visible
        }
      });
    }, { threshold: 0.12 });

    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.reveal').forEach(el => this._observer.observe(el));
    });
  }
};

// Exportar utilidades
window.themeManager = ThemeManager;
window.animationUtils = AnimationUtils;
window.scrollReveal = ScrollReveal;
