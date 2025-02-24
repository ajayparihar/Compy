import { useState } from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Typography,
  Box,
  IconButton,
  LinearProgress
} from '@mui/material'
import { Close, CloudUpload } from '@mui/icons-material'
import { useTheme } from '../hooks/useTheme'

function ImportModal({ open, onClose, onImport, setUserName }) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { setCurrentTheme, toggleFavorite } = useTheme()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFileSelection(droppedFile)
  }

  const handleFileSelection = (selectedFile) => {
    if (!selectedFile) return
    
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.json')) {
      setError('Please select a CSV or JSON file')
      setFile(null)
      return
    }

    setError('')
    setFile(selectedFile)
  }

  const processJsonData = async (jsonData) => {
    try {
      const data = JSON.parse(jsonData)
      
      // Process profile information if available
      if (data.profile) {
        if (data.profile.theme) {
          setCurrentTheme(data.profile.theme)
        }
        if (data.profile.userName) {
          setUserName(data.profile.userName)
        }
        if (data.profile.favoriteThemes && Array.isArray(data.profile.favoriteThemes)) {
          // Clear existing favorites from localStorage
          localStorage.setItem('favoriteThemes', '[]')
          
          // Add each theme to favorites using toggleFavorite
          data.profile.favoriteThemes.forEach(themeId => {
            toggleFavorite(themeId)
          })
        }
      }

      // Process commands data
      if (data.data && data.data.commands) {
        return data.data.commands
      }
      
      return []
    } catch (err) {
      throw new Error('Invalid JSON format')
    }
  }

  const processCsvData = (text) => {
    const lines = text.split('\n')
    const headers = lines[0].split(',')
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',')
        return {
          id: Date.now() + Math.random(),
          command: values[0]?.trim() || '',
          description: values[1]?.trim() || '',
          category: values[2]?.trim() || '',
          tags: values[3]?.split(';').map(tag => tag.trim()).filter(Boolean) || []
        }
      })
      .filter(cmd => cmd.command && cmd.description)
  }

  const handleImport = async () => {
    if (!file) return

    setIsLoading(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target.result
        let items = []

        try {
          if (file.name.endsWith('.json')) {
            items = await processJsonData(text)
          } else {
            items = processCsvData(text)
          }
          onImport(items)
        } catch (err) {
          setError(`Error processing file: ${err.message}`)
        }
      }

      reader.readAsText(file)
    } catch (err) {
      setError('Error reading file')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Import Items
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            border: 2,
            borderRadius: 1,
            borderStyle: 'dashed',
            borderColor: isDragging ? 'primary.main' : 'grey.300',
            p: 3,
            textAlign: 'center',
            bgcolor: isDragging ? 'action.hover' : 'background.paper',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            type="file"
            id="file-input"
            accept=".csv,.json"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelection(e.target.files[0])}
          />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag & Drop CSV or JSON file here
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select file
          </Typography>
          {file && (
            <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
              Selected: {file.name}
            </Typography>
          )}
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
        {isLoading && <LinearProgress sx={{ mt: 2 }} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!file || isLoading}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportModal 