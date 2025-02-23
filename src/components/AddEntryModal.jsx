import { useState, useEffect } from 'react'
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

function AddEntryModal({ open, onClose, onSubmit, initialValues, isEditing }) {
  const [formData, setFormData] = useState({
    command: '',
    description: '',
    category: '',
    tags: []
  })
  const [newTag, setNewTag] = useState('')
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues)
    } else {
      setFormData({
        command: '',
        description: '',
        category: '',
        tags: []
      })
    }
  }, [initialValues])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }))
      }
      setNewTag('')
    } else if (e.key === 'Backspace' && newTag === '' && formData.tags.length > 0) {
      e.preventDefault()
      const newTags = [...formData.tags]
      newTags.pop()
      setFormData(prev => ({
        ...prev,
        tags: newTags
      }))
    }
  }

  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        category: newCategory.trim()
      }))
      setNewCategory('')
    } else if (e.key === 'Backspace' && newCategory === '' && formData.category) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        category: ''
      }))
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
        {isEditing ? 'Edit Command' : 'Add New Command'}
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
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            name="command"
            label="Command"
            fullWidth
            value={formData.command}
            onChange={handleChange}
            variant="outlined"
            required
            sx={{
              mb: 2,
              transition: 'transform 0.2s ease-in-out',
              '& .MuiInputBase-root': {
                transition: 'all 0.2s ease-in-out',
                '&.Mui-focused': {
                  transform: 'scale(1.02)',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)'
                }
              },
              '& .MuiInputBase-input': {
                color: 'text.primary',
                fontFamily: 'monospace',
                fontSize: '1rem',
              }
            }}
          />
          
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            required
            sx={{
              mb: 2,
              transition: 'transform 0.2s ease-in-out',
              '& .MuiInputBase-root': {
                transition: 'all 0.2s ease-in-out',
                '&.Mui-focused': {
                  transform: 'scale(1.02)',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)'
                }
              }
            }}
          />

          <TextField
            name="category"
            label="Category"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={handleCategoryKeyDown}
            variant="outlined"
            placeholder="Press Enter to add category"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: formData.category && (
                <InputAdornment position="start">
                  <Chip
                    label={formData.category}
                    onDelete={() => setFormData(prev => ({ ...prev, category: '' }))}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Tags"
            fullWidth
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            variant="outlined"
            placeholder="Press Enter to add tags"
            InputProps={{
              startAdornment: formData.tags.length > 0 && (
                <InputAdornment position="start">
                  <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'row' }}>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleDeleteTag(tag)}
                        size="small"
                      />
                    ))}
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditing ? 'Save Changes' : 'Add Command'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEntryModal
