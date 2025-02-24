import { useState, useEffect } from 'react'
import { ThemeProvider, CssBaseline, Container, Grid, Box, Autocomplete, TextField, IconButton, InputAdornment, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem, Checkbox, Snackbar, Alert, Typography } from '@mui/material'
import ItemList from './components/ItemList'
import AddEntryModal from './components/AddEntryModal'
import ImportModal from './components/ImportModal'
import ExportModal from './components/ExportModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import { getTheme } from './theme'
import LoadingSkeleton from './components/LoadingSkeleton'
import { Search, Clear, Add, FileUpload, RestartAlt, Person, GetApp } from '@mui/icons-material'
import ThemeSelector from './components/ThemeSelector'
import Header from './components/Header'

function App() {
  // Theme
  const { currentTheme, setCurrentTheme, favoriteThemes } = useTheme()
  const theme = getTheme(currentTheme)

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [editingCommand, setEditingCommand] = useState(null)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [userName, setUserName] = useState('User') // Placeholder for user name
  const [anchorEl, setAnchorEl] = useState(null)
  const [showNameModal, setShowNameModal] = useState(false)
  const [newUserName, setNewUserName] = useState(userName)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportSource, setExportSource] = useState('profile') // 'profile' or 'reset'

  // Local storage
  const [items, setItems] = useLocalStorage('items', [])

  // Reset function to restore default state
  const handleReset = () => {
    setShowResetDialog(true);
  }

  const confirmReset = () => {
    setSearchQuery('')
    setItems([])
    setCurrentTheme('sunrise') // Reset to default theme
    showSnackbar('All data has been reset to default')
    setShowResetDialog(false);
  }

  const exportData = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      items.map(e => e.item + ',' + e.description + ',' + e.category + ',' + e.tags.join(';')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'items_backup.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Filter items
  const filteredItems = items.filter(item => filterItems(item, searchQuery))

  // Item handlers
  const handleAddItem = (newItem) => {
    setItems([...items, { ...newItem, id: Date.now() }])
    setShowAddModal(false)
    showSnackbar('Item added successfully!')
  }

  const handleEditItem = (editedItem) => {
    setItems(items.map(item => 
      item.id === editedItem.id ? editedItem : item
    ))
    setEditingCommand(null)
    showSnackbar('Item updated successfully!')
  }

  const handleDeleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId))
    showSnackbar('Item deleted successfully!')
  }

  const handleImportItems = (importedItems) => {
    setItems([...items, ...importedItems])
    setShowImportModal(false)
    showSnackbar(`${importedItems.length} items imported successfully!`)
  }

  // Snackbar handlers
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar({ ...snackbar, open: false })
  }

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleExportClick = (source) => {
    setExportSource(source);
    setShowExportModal(true);
    handleProfileClose(); // Close the profile menu if it was opened from there
  };

  const handleExport = (options) => {
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      profile: {
        theme: currentTheme,
        userName: userName,
        favoriteThemes: favoriteThemes || [],
        settings: {
          // Add any other settings you want to export
        }
      }
    };

    if (options.data) {
      exportData.data = {
        items: items,
        // Add any other data you want to export
      };
    }

    // Create and download the config file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compy_config_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSnackbar('Configuration exported successfully')
    
    if (exportSource === 'reset') {
      confirmReset()
    }
  };

  const handleNameSubmit = () => {
    setUserName(newUserName);
    setShowNameModal(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onImportClick={() => setShowImportModal(true)}
          onAddClick={() => setShowAddModal(true)}
          userName={userName}
        />

        <Container 
          maxWidth="xl"
          sx={{
            pt: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 4, sm: 6, md: 8 },
            px: { xs: 2, sm: 4, md: 6 },
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <ItemList
              sx={{ mt: 0 }}
              items={filteredItems}
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
            setUserName={setUserName}
          />

          <ExportModal
            open={showExportModal}
            onClose={() => setShowExportModal(false)}
            onExport={handleExport}
          />
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
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
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}

const filterItems = (item, query) => {
  const searchLower = query.toLowerCase()
  return item.item.toLowerCase().includes(searchLower) ||
         item.description.toLowerCase().includes(searchLower) ||
         item.category?.toLowerCase().includes(searchLower) ||
         item.tags?.some(tag => tag.toLowerCase().includes(searchLower))
}

export default App