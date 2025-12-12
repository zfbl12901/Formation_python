import React, { useState } from 'react'
import { Download, FileText, Loader2 } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'

function ExportPDF({ lesson, htmlContent }) {
  const [isExporting, setIsExporting] = useState(false)
  const { success, error: showError } = useToast()

  const exportToPDF = async () => {
    if (!lesson || !htmlContent) {
      showError('Aucune leçon à exporter')
      return
    }

    setIsExporting(true)

    try {
      // Créer une fenêtre d'impression optimisée
      const printWindow = window.open('', '_blank')
      
      // Préparer le HTML pour l'impression
      const printHTML = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${lesson.title} - Formation Python</title>
          <style>
            @media print {
              @page {
                margin: 2cm;
                size: A4;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                color: #000;
                line-height: 1.6;
                max-width: 100%;
              }
              
              h1 {
                font-size: 2.5em;
                margin-bottom: 0.5em;
                page-break-after: avoid;
              }
              
              h2 {
                font-size: 2em;
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                page-break-after: avoid;
              }
              
              h3 {
                font-size: 1.5em;
                margin-top: 1em;
                margin-bottom: 0.5em;
                page-break-after: avoid;
              }
              
              h4 {
                font-size: 1.25em;
                margin-top: 0.75em;
                margin-bottom: 0.5em;
                page-break-after: avoid;
              }
              
              p {
                margin-bottom: 1em;
              }
              
              pre {
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 1em;
                overflow-x: auto;
                page-break-inside: avoid;
                font-size: 0.9em;
              }
              
              code {
                background: #f5f5f5;
                padding: 0.2em 0.4em;
                border-radius: 3px;
                font-size: 0.9em;
              }
              
              pre code {
                background: transparent;
                padding: 0;
              }
              
              blockquote {
                border-left: 4px solid #3b82f6;
                padding-left: 1em;
                margin: 1em 0;
                font-style: italic;
                color: #666;
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 1em 0;
                page-break-inside: avoid;
              }
              
              th, td {
                border: 1px solid #ddd;
                padding: 0.5em;
                text-align: left;
              }
              
              th {
                background: #f5f5f5;
                font-weight: bold;
              }
              
              img {
                max-width: 100%;
                height: auto;
                page-break-inside: avoid;
              }
              
              ul, ol {
                margin: 1em 0;
                padding-left: 2em;
              }
              
              li {
                margin-bottom: 0.5em;
              }
              
              .code-block-wrapper {
                margin: 1em 0;
                page-break-inside: avoid;
              }
              
              .code-block-header {
                display: none;
              }
              
              .no-print {
                display: none !important;
              }
              
              a {
                color: #3b82f6;
                text-decoration: underline;
              }
              
              a[href^="http"]:after {
                content: " (" attr(href) ")";
                font-size: 0.8em;
                color: #666;
              }
            }
            
            @media screen {
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 2em;
                background: #fff;
                color: #000;
              }
            }
            
            .header {
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 1em;
              margin-bottom: 2em;
            }
            
            .title {
              font-size: 2.5em;
              margin-bottom: 0.5em;
            }
            
            .meta {
              color: #666;
              font-size: 0.9em;
            }
            
            .tags {
              margin-top: 1em;
            }
            
            .tag {
              display: inline-block;
              background: #e3f2fd;
              color: #1976d2;
              padding: 0.25em 0.75em;
              border-radius: 1em;
              font-size: 0.85em;
              margin-right: 0.5em;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">${lesson.title}</h1>
            <div class="meta">
              ${lesson.last_modified ? `Modifié le ${new Date(lesson.last_modified).toLocaleDateString('fr-FR')}` : ''}
            </div>
            ${lesson.tags && lesson.tags.length > 0 ? `
              <div class="tags">
                ${lesson.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <div class="content">
            ${htmlContent.replace(/<button[^>]*>.*?<\/button>/gi, '').replace(/class="code-copy-btn[^"]*"/gi, '').replace(/class="code-block-header[^"]*"/gi, 'class="no-print"')}
          </div>
          <div style="margin-top: 3em; padding-top: 1em; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 0.9em;">
            Formation Python - ${new Date().toLocaleDateString('fr-FR')}
          </div>
        </body>
        </html>
      `

      printWindow.document.write(printHTML)
      printWindow.document.close()

      // Attendre que le contenu soit chargé
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          setIsExporting(false)
          success('PDF prêt à être imprimé')
        }, 500)
      }
    } catch (err) {
      console.error('Erreur lors de l\'export PDF:', err)
      showError('Erreur lors de l\'export PDF')
      setIsExporting(false)
    }
  }

  if (!lesson) return null

  return (
    <button
      onClick={exportToPDF}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-4 py-2 bg-dark-accent hover:bg-dark-accentHover text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-dark-accent focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Exporter en PDF"
      title="Exporter la leçon en PDF"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Export en cours...</span>
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          <span>Exporter en PDF</span>
        </>
      )}
    </button>
  )
}

export default ExportPDF

