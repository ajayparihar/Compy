import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CommandList from './components/CommandList'
import Toast from './components/Toast'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3000)
  }

  return (
    <ThemeProvider>
      <div className="app">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="main-container">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            showToast={showToast}
          />
          <main className="content">
            <CommandList showToast={showToast} />
          </main>
        </div>
        {toastMessage && <Toast message={toastMessage} />}
      </div>
    </ThemeProvider>
  )
}

export default App 