import { useState } from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Box,
  Chip,
  IconButton,
  InputAdornment
} from '@mui/material'
import { Close } from '@mui/icons-material'

function AddEntryModal({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    command: '',
    description: '',
    category: '',
    tags: []
  })
  const [newTag, setNewTag] = useState('')
  const [newCategory, setNewCategory] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }))
      }
      setNewTag('')
    }
  }

  const handleDeleteTag = (tagToDelete) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }))
  }

  const handleAddCategory = (e) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        category: newCategory.trim()
      }))
      setNewCategory('')
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2, md: 3 },
          width: { xs: '95%', sm: '80%', md: '60%' },
          maxWidth: '600px',
          '& .MuiDialogTitle-root': {
            p: { xs: 2, sm: 3 },
            fontSize: { xs: '1.2rem', sm: '1.5rem' }
          },
          '& .MuiDialogContent-root': {
            p: { xs: 2, sm: 3 },
            '& .MuiTextField-root': {
              mb: { xs: 1.5, sm: 2 }
            }
          },
          '& .MuiDialogActions-root': {
            p: { xs: 1.5, sm: 2 }
          }
        }
      }}
    >
      <DialogTitle>
        {initialData ? 'Edit Command' : 'Add New Command'}
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
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Command"
            fullWidth
            required
            value={formData.command}
            onChange={(e) => setFormData(prev => ({ ...prev, command: e.target.value }))}
            sx={{ 
              mb: { xs: 1.5, sm: 2 },
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
          />
          
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            sx={{ 
              mb: { xs: 1.5, sm: 2 },
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
          />

          <TextField
            margin="dense"
            label="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={handleAddCategory}
            fullWidth
            helperText="Press Enter to set category"
            sx={{ mb: { xs: 1.5, sm: 2 } }}
            InputProps={{
              startAdornment: formData.category ? (
                <InputAdornment 
                  position="start"
                  sx={{
                    height: '100%',
                    alignItems: 'center',
                    mt: 0
                  }}
                >
                  <Chip
                    label={formData.category}
                    size="small"
                    onDelete={() => setFormData(prev => ({ ...prev, category: '' }))}
                    color="primary"
                  />
                </InputAdornment>
              ) : null
            }}
          />

          <TextField
            margin="dense"
            label="Add Tags"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            fullWidth
            helperText="Press Enter to add a tag"
            sx={{ mb: { xs: 1.5, sm: 2 } }}
            InputProps={{
              startAdornment: formData.tags.length > 0 ? (
                <InputAdornment 
                  position="start"
                  sx={{
                    height: '100%',
                    alignItems: 'center',
                    mt: 0
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'nowrap',
                    alignItems: 'center', 
                    gap: 0.5, 
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': { height: '4px' },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '4px' },
                    maxWidth: '100%',
                    minHeight: '32px',  
                    py: 0.5,  
                    boxSizing: 'border-box'
                  }}>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        onDelete={() => handleDeleteTag(tag)}
                      />
                    ))}
                  </Box>
                </InputAdornment>
              ) : null
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Save Changes' : 'Add Command'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddEntryModal 