import { useState, useEffect } from 'react'
import { ThemeProvider, CssBaseline, Container, Grid } from '@mui/material'
import Header from './components/Header'
import CommandList from './components/CommandList'
import AddEntryModal from './components/AddEntryModal'
import ImportModal from './components/ImportModal'
import AddEntryFab from './components/AddEntryFab'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import { getTheme } from './theme'
import { Snackbar, Alert } from '@mui/material'
import LoadingSkeleton from './components/LoadingSkeleton'

function App() {
  // Theme
  const { currentTheme } = useTheme()
  const theme = getTheme(currentTheme)

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [editingCommand, setEditingCommand] = useState(null)

  // Local storage
  const [commands, setCommands] = useLocalStorage('commands', [])

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Filter commands
  const filteredCommands = commands.filter(cmd => {
    const searchLower = searchQuery.toLowerCase()
    return cmd.command.toLowerCase().includes(searchLower) ||
           cmd.description.toLowerCase().includes(searchLower) ||
           cmd.category?.toLowerCase().includes(searchLower) ||
           cmd.tags?.some(tag => tag.toLowerCase().includes(searchLower))
  })

  // Command handlers
  const handleAddCommand = (newCommand) => {
    setCommands([...commands, { ...newCommand, id: Date.now() }])
    setShowAddModal(false)
    setToastMessage('Command added successfully!')
  }

  const handleEditCommand = (editedCommand) => {
    setCommands(commands.map(cmd => 
      cmd.id === editedCommand.id ? editedCommand : cmd
    ))
    setEditingCommand(null)
    setToastMessage('Command updated successfully!')
  }

  const handleDeleteCommand = (commandId) => {
    setCommands(commands.filter(cmd => cmd.id !== commandId))
    setToastMessage('Command deleted successfully!')
  }

  const handleImportCommands = (importedCommands) => {
    setCommands([...commands, ...importedCommands])
    setShowImportModal(false)
    setToastMessage(`${importedCommands.length} commands imported successfully!`)
  }

  // Toast handlers
  const handleToastClose = () => {
    setToastMessage('')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ 
        minHeight: '100vh',
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onImportClick={() => setShowImportModal(true)}
          commands={commands}
        />

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <CommandList
            sx={{ mt: 0 }} // Removed marginTop
            commands={filteredCommands}
            onDelete={handleDeleteCommand}
            onEdit={setEditingCommand}
          />
        )}

        <AddEntryFab onClick={() => setShowAddModal(true)} />

        <AddEntryModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCommand}
        />

        <AddEntryModal
          open={Boolean(editingCommand)}
          onClose={() => setEditingCommand(null)}
          onSubmit={handleEditCommand}
          initialValues={editingCommand}
          isEditing
        />

        <ImportModal
          open={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportCommands}
        />

        <Snackbar
          open={Boolean(toastMessage)}
          autoHideDuration={3000}
          onClose={handleToastClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleToastClose} severity="success">
            {toastMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  )
}

export default App