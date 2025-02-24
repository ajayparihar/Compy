import { useState, useRef } from 'react'
import './Sidebar.css'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  showToast: (message: string) => void
}

function Sidebar({ isOpen, onClose, showToast }: SidebarProps) {
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'User')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const text = await file.text()
      const data = JSON.parse(text)
      
      localStorage.setItem('commandData', JSON.stringify(data))
      showToast('Data imported successfully')
      window.location.reload()
    } catch (error) {
      showToast('Error importing data')
      console.error('Import error:', error)
    }
  }

  const handleExport = () => {
    try {
      const data = localStorage.getItem('commandData') || '[]'
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = 'compy-data.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      showToast('Data exported successfully')
    } catch (error) {
      showToast('Error exporting data')
      console.error('Export error:', error)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.clear()
      showToast('All data has been reset')
      window.location.reload()
    }
  }

  const handleNameChange = () => {
    const newName = prompt('Enter new name:', userName)
    if (newName?.trim()) {
      setUserName(newName.trim())
      localStorage.setItem('userName', newName.trim())
      showToast('Name updated successfully')
    }
  }

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Settings</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        <div className="sidebar-content">
          <button 
            className="sidebar-button"
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />

          <button 
            className="sidebar-button"
            onClick={handleExport}
          >
            Export Data
          </button>

          <button 
            className="sidebar-button"
            onClick={handleReset}
          >
            Reset
          </button>

          <button 
            className="sidebar-button"
            onClick={handleNameChange}
          >
            Change Name
          </button>
        </div>
      </div>

      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Sidebar 