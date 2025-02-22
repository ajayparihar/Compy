import { useState } from 'react'
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

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ 
        minHeight: '100vh',
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column', 
        p: 2,
        overflow: 'hidden'
      }}>
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onImportClick={() => setShowImportModal(true)}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
        />

        <main style={{ 
          flex: 1, 
          overflow: 'auto', 
          marginTop: '16px',
          width: '100%',
          height: '100%'
        }}>
          <CommandList commands={filteredCommands} />
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
        >
          <Alert 
            onClose={() => setToastMessage('')} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  )
}

export default App 