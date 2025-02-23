import { useState, useEffect } from 'react'
import { ThemeProvider, CssBaseline, Container, Grid, Box, Autocomplete, TextField, IconButton, InputAdornment, Tooltip } from '@mui/material'
import Header from './components/Header'
import CommandList from './components/CommandList'
import AddEntryModal from './components/AddEntryModal'
import ImportModal from './components/ImportModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import { getTheme } from './theme'
import { Snackbar, Alert } from '@mui/material'
import LoadingSkeleton from './components/LoadingSkeleton'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Search, Clear, Add, FileUpload } from '@mui/icons-material'
import ThemeSelector from './components/ThemeSelector'

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
  const [items, setCommands] = useLocalStorage('commands', [])

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Filter commands
  const filteredItems = items.filter(cmd => {
    const searchLower = searchQuery.toLowerCase()
    return cmd.command.toLowerCase().includes(searchLower) ||
           cmd.description.toLowerCase().includes(searchLower) ||
           cmd.category?.toLowerCase().includes(searchLower) ||
           cmd.tags?.some(tag => tag.toLowerCase().includes(searchLower))
  })

  // Command handlers
  const handleAddItem = (newCommand) => {
    setCommands([...items, { ...newCommand, id: Date.now() }])
    setShowAddModal(false)
    setToastMessage('Item added successfully!')
  }

  const handleEditItem = (editedCommand) => {
    setCommands(items.map(cmd => 
      cmd.id === editedCommand.id ? editedCommand : cmd
    ))
    setEditingCommand(null)
    setToastMessage('Item updated successfully!')
  }

  const handleDeleteItem = (commandId) => {
    setCommands(items.filter(cmd => cmd.id !== commandId))
    setToastMessage('Item deleted successfully!')
  }

  const handleImportItems = (importedCommands) => {
    setCommands([...items, ...importedCommands])
    setShowImportModal(false)
    setToastMessage(`${importedCommands.length} items imported successfully!`)
  }

  // Toast handlers
  const handleToastClose = () => {
    setToastMessage('')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" sx={{
        background: theme.palette.mode === 'dark' 
          ? 'rgba(10, 25, 41, 0.7)'
          : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.1)',
      }}>
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          py: 1,
        }}>
          
        <Typography
          variant="h5"
          component="h1"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{
            flexShrink: 0,
            fontWeight: 600,
            letterSpacing: '-0.5px',
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            cursor: 'pointer',
            position: 'relative',
            '&:hover': {
              opacity: 0.8,
              '&::after': {
                transform: 'scaleX(1)',
              },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -2,
              left: 0,
              right: 0,
              margin: '0 auto',
              width: '100%',
              height: '2px',
              backgroundColor: 'primary.main',
              transform: 'scaleX(0)',
              transformOrigin: '50% 50%',
              transition: 'transform 0.3s ease-out',
            },
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          Compy
        </Typography>

          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Autocomplete
              freeSolo
              fullWidth
              options={[]}
              inputValue={searchQuery}
              onInputChange={(event, newValue) => setSearchQuery(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search commands..."
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        {searchQuery ? (
                          <IconButton
                            size="small"
                            onClick={() => setSearchQuery('')}
                          >
                            <Clear fontSize="small" />
                          </IconButton>
                        ) : (
                          <Search />
                        )}
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.04)',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.06)',
                      },
                    },
                  }}
                />
              )}
            />
            
            <Tooltip title="Add new command">
              <IconButton color="inherit" onClick={() => setShowAddModal(true)}>
                <Add />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
            <ThemeSelector />
            <Tooltip title="Import commands">
              <IconButton color="inherit" onClick={() => setShowImportModal(true)}>
                <FileUpload />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container 
        maxWidth="xl"
        sx={{
          pt: 10,
          px: 2,
        }}
      >
        {/* <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onImportClick={() => setShowImportModal(true)}
          commands={commands}
          onAddClick={() => setShowAddModal(true)}
        /> */}

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <CommandList
            sx={{ mt: 0 }}
            commands={filteredItems}
            onDelete={handleDeleteItem}
            onEdit={setEditingCommand}
          />
        )}

        <AddEntryModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddItem}
        />

        <AddEntryModal
          open={Boolean(editingCommand)}
          onClose={() => setEditingCommand(null)}
          onSubmit={handleEditItem}
          initialValues={editingCommand}
          isEditing
        />

        <ImportModal
          open={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportItems}
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