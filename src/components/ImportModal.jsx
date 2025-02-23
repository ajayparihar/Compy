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

function ImportModal({ open, onClose, onImport }) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
    
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file')
      setFile(null)
      return
    }

    setError('')
    setFile(selectedFile)
  }

  const handleImport = async () => {
    if (!file) return

    setIsLoading(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target.result
        const lines = text.split('\n')
        const headers = lines[0].split(',')
        
        const items = lines.slice(1)
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

        onImport(items)
      }

      reader.readAsText(file)
    } catch (err) {
      setError('Error processing file. Please check the format.')
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
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelection(e.target.files[0])}
          />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag & Drop CSV file here
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