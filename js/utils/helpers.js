/**
 * Utilidades para manejo del tema (claro/oscuro)
 */

const ThemeManager = {
  STORAGE_KEY: 'u-theme',

  /**
   * Obtiene el tema actual del localStorage o del sistema
   * @returns {string} 'light' o 'dark'
   */
  getInitialTheme() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) return stored;
      
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      console.warn('Error accessing localStorage:', e);
      return 'light';
    }
  },

  /**
   * Aplica el tema al documento HTML
   * @param {string} theme - 'light' o 'dark'
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
  },

  /**
   * Guarda el tema en localStorage
   * @param {string} theme - 'light' o 'dark'
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
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
 */
const AnimationUtils = {
  /**
   * Animación de conteo numérico
   * @param {number} target - Valor objetivo
   * @param {Function} onUpdate - Callback para actualizar el valor
   * @param {number} delay - Retraso inicial en ms
   */
  countUp(target, onUpdate, delay = 0) {
    let current = 0;
    
    setTimeout(() => {
      const step = Math.max(1, Math.floor(target / 40));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        onUpdate(current);
      }, 40);
    }, delay * 200 + 600);
  }
};

/**
 * Utilidades para reveal on scroll
 */
const ScrollReveal = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    });
  }
};

// Exportar utilidades
window.themeManager = ThemeManager;
window.animationUtils = AnimationUtils;
window.scrollReveal = ScrollReveal;
