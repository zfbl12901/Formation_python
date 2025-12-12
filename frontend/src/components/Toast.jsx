import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react'

const TOAST_TYPES = {
  success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/50' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/50' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/50' },
  warning: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/50' }
}

function Toast({ id, message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const Icon = TOAST_TYPES[type]?.icon || TOAST_TYPES.info.icon
  const styles = TOAST_TYPES[type] || TOAST_TYPES.info

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      if (onClose) {
        onClose(id)
      }
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={`
        ${styles.bg} ${styles.border} border rounded-lg p-4 mb-3 shadow-lg
        flex items-start gap-3 min-w-[300px] max-w-[500px]
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${styles.color} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`text-sm ${styles.color} font-medium`}>{message}</p>
      </div>
      <button
        onClick={handleClose}
        className={`${styles.color} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast

