// Utilitaires pour les classes CSS selon le thème
export const getThemeClasses = (baseClasses, theme = 'dark') => {
  // Cette fonction peut être utilisée pour générer des classes dynamiques
  // Pour l'instant, on utilise des classes CSS avec data-theme
  return baseClasses
}

// Classes communes pour les deux thèmes
export const commonClasses = {
  container: 'transition-colors duration-300',
  button: 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  link: 'transition-colors',
  input: 'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
}

