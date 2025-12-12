import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-8">
          <div className="max-w-2xl bg-dark-surface border border-red-500/50 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Erreur de rendu</h1>
            <p className="text-white mb-4">
              Une erreur s'est produite lors du chargement de l'application.
            </p>
            <pre className="bg-dark-bg p-4 rounded text-sm text-red-300 overflow-auto mb-4">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="px-4 py-2 bg-dark-accent hover:bg-dark-accentHover text-white rounded transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

