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
    item: '',
    description: '',
    tags: []
  })
  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues)
      setErrors({})
    } else {
      setFormData({
        item: '',
        description: '',
        tags: []
      })
      setErrors({})
    }
  }, [initialValues])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.item.trim()) {
      newErrors.item = 'Item is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(newTag.trim()) && formData.tags.length < 10) {
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(newTag.trim()) && formData.tags.length < 10) {
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
        {isEditing ? 'Edit Item' : 'Add New Item'}
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
            name="item"
            label="Item"
            fullWidth
            value={formData.item}
            onChange={handleChange}
            variant="outlined"
            required
            error={Boolean(errors.item)}
            helperText={errors.item || `${formData.item.length} characters`}
            multiline
            minRows={1}
            maxRows={5}
            placeholder="Enter or paste your item text here"
            InputProps={{
              sx: {
                '& textarea': {
                  transition: 'min-height 0.2s ease-in-out',
                  lineHeight: '1.5',
                  fontFamily: 'monospace',
                },
              },
            }}
            sx={{
              mb: 2,
              '& .MuiInputLabel-root': {
                transform: 'translate(14px, 16px) scale(1)',
                '&.Mui-focused, &.MuiFormLabel-filled': {
                  transform: 'translate(14px, -9px) scale(0.75)',
                },
              },
              '& .MuiInputBase-root': {
                transition: 'all 0.2s ease-in-out',
                '&.Mui-focused': {
                  transform: 'scale(1.02)',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)'
                },
                '&.Mui-error': {
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 0, 0, 0.05)'
                      : 'rgba(255, 0, 0, 0.03)'
                }
              },
              '& .MuiInputBase-input': {
                color: 'text.primary',
                fontFamily: 'monospace',
                fontSize: '1rem',
                padding: '16px 14px',
              }
            }}
          />
          
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            minRows={3}
            maxRows={8}
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            required
            placeholder="Enter a detailed description of your item"
            helperText={`${formData.description.length} characters`}
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
                },
                '& textarea': {
                  transition: 'min-height 0.2s ease-in-out',
                  lineHeight: '1.5',
                }
              }
            }}
          />

          <TextField
            label="Tags"
            fullWidth
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            variant="outlined"
            placeholder={formData.tags.length >= 10 ? "Maximum tags reached" : "Press Enter to add tags"}
            disabled={formData.tags.length >= 10}
            helperText={`${formData.tags.length}/10 tags`}
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                flexWrap: 'wrap',
                gap: 0.5,
                padding: '8px',
                minHeight: formData.tags.length > 0 ? '56px' : '40px',
                alignItems: 'flex-start',
                '& input': {
                  width: formData.tags.length > 0 ? 'auto' : '100%',
                  margin: '4px'
                }
              }
            }}
            InputProps={{
              startAdornment: formData.tags.length > 0 && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 0.5,
                    maxWidth: '100%'
                  }}
                >
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      size="small"
                      sx={{
                        maxWidth: '120px',
                        height: '24px',
                        m: '2px',
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }
                      }}
                    />
                  ))}
                </Box>
              )
            }}
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditing ? 'Save Changes' : 'Add Item'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEntryModal
