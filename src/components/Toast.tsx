import { useEffect, useState } from 'react'
import './Toast.css'

interface ToastProps {
  message: string
}

function Toast({ message }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2900) // Slightly less than the CSS animation duration

    return () => clearTimeout(timer)
  }, [message])

  if (!isVisible) return null

  return (
    <div className="toast" role="alert">
      {message}
    </div>
  )
}

export default Toast 