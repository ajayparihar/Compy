import { useState, useEffect } from 'react'
import { ThemeProvider, CssBaseline, Container } from '@mui/material'
import Header from './components/Header'
import CommandList from './components/CommandList'
import AddEntryModal from './components/AddEntryModal'
import ImportModal from './components/ImportModal'
import AddEntryFab from './components/AddEntryFab'
import { useLocalStorage } from './hooks/useLocalStorage'
import { lightTheme, darkTheme } from './theme'
import { Snackbar, Alert } from '@mui/material'

function App() {
  const [commands, setCommands] = useLocalStorage('commands', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false)

  const filteredCommands = commands.filter(cmd => {
    const searchLower = searchQuery.toLowerCase()
    return cmd.command.toLowerCase().includes(searchLower) ||
           cmd.description.toLowerCase().includes(searchLower) ||
           cmd.category?.toLowerCase().includes(searchLower) ||
           cmd.tags?.some(tag => tag.toLowerCase().includes(searchLower))
  })

  const handleAddCommand = (newCommand) => {
    setCommands([...commands, { ...newCommand, id: Date.now() }])
    setShowAddModal(false)
    setToastMessage('Command added successfully')
  }

  const handleImportCommands = (importedCommands) => {
    setCommands([...commands, ...importedCommands])
    setShowImportModal(false)
    setToastMessage('Commands imported successfully')
  }

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Focus search bar when '/' is pressed
      if (e.key === '/' && 
          !e.target.matches('input, textarea') && 
          !e.target.isContentEditable) {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]')
        if (searchInput) {
          searchInput.focus()
        }
      }
      
      // Clear search with Escape
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [searchQuery])

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ 
        minHeight: '100vh',
        width: '100vw',
        '@media (min-width: 1200px)': {
          width: '95vw',
          margin: '0 auto',
          padding: '24px',
        },
        display: 'flex', 
        flexDirection: 'column', 
        p: { xs: 1, sm: 2 },
        overflow: 'hidden'
      }}>
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onImportClick={() => setShowImportModal(true)}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
          commands={commands}
        />

        <main style={{ 
          flex: 1, 
          overflow: 'auto', 
          marginTop: '80px',
          width: '100%',
          height: '100%',
          maxWidth: '2000px'
        }}>
          <CommandList 
            commands={filteredCommands} 
            searchQuery={searchQuery}
          />
        </main>

        <AddEntryFab onClick={() => setShowAddModal(true)} />
        
        {showAddModal && (
          <AddEntryModal
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddCommand}
          />
        )}

        {showImportModal && (
          <ImportModal
            open={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImport={handleImportCommands}
          />
        )}

        <Snackbar
          open={Boolean(toastMessage)}
          autoHideDuration={3000}
          onClose={() => setToastMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setToastMessage('')} 
            severity="success"
            sx={{ 
              width: '100%',
              backdropFilter: 'blur(10px)',
              background: theme => theme.palette.mode === 'dark' 
                ? 'rgba(15, 23, 42, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
              border: '1px solid',
              borderColor: theme => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                : '0 4px 12px rgba(0, 0, 0, 0.06)',
              '& .MuiAlert-icon': {
                color: theme => theme.palette.mode === 'dark'
                  ? theme.palette.primary.light
                  : theme.palette.primary.main
              }
            }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  )
}

export default App 