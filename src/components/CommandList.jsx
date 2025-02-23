import { Card, CardContent, Typography, Grid, Box, Chip, IconButton, CardActions, useTheme, Snackbar, Alert, Dialog, DialogTitle, DialogActions, DialogContent, Button } from '@mui/material'
import { ContentCopy, Delete, Edit } from '@mui/icons-material'
import { useState } from 'react'

function CommandList({ commands, onDelete, onEdit, searchQuery }) {
  const theme = useTheme()
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 })
  const [rippleActive, setRippleActive] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const handleCopy = async (command) => {
    try {
      await navigator.clipboard.writeText(command)
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  const handleCardClick = async (event, item) => {
    // Don't copy if clicking on action buttons
    if (event.target.closest('.card-actions')) {
      return
    }

    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    setRipplePosition({ x, y })
    setRippleActive(item.id)
    
    await handleCopy(item.command)
    
    // Reset ripple after animation
    setTimeout(() => {
      setRippleActive(null)
    }, 600)
  }

  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id)
      setDeleteConfirmOpen(false)
      setItemToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setItemToDelete(null)
  }

  // Add highlightText utility function
  const highlightText = (text, searchQuery) => {
    if (!searchQuery || !text) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <Box
          key={index}
          component="span"
          sx={{
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(129, 140, 248, 0.2)'
              : 'rgba(99, 102, 241, 0.2)',
            color: theme.palette.mode === 'dark'
              ? theme.palette.primary.light
              : theme.palette.primary.main,
            borderRadius: '2px',
            display: 'inline',
          }}
        >
          {part}
        </Box>
      ) : part
    );
  };

  return (
    <>
      <Grid container spacing={2}>
        {commands.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={item.id}>
            <Card 
              onClick={(e) => handleCardClick(e, item)}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
                '& .MuiCardContent-root': {
                  flexGrow: 1,
                  p: { xs: 1, sm: 1.5 }
                },
                '& .MuiCardActions-root': {
                  p: { xs: 0.75, sm: 1 }
                },
                '& .MuiTypography-root': {
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                },
                '& .MuiChip-root': {
                  m: 0.25,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                },
                background: theme.palette.mode === 'dark'
                  ? 'rgba(30, 41, 59, 0.4)'
                  : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                  : '0 4px 12px rgba(0, 0, 0, 0.06)',
                cursor: { xs: 'default', sm: 'pointer' },
                '&:hover': {
                  '@media (hover: hover)': {
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(30, 41, 59, 0.6)'
                      : 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-1px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 6px 16px rgba(0, 0, 0, 0.3)'
                      : '0 6px 16px rgba(0, 0, 0, 0.1)',
                    '& .card-actions .MuiIconButton-root': {
                      opacity: 1
                    }
                  }
                },
                '& .ripple': {
                  position: 'absolute',
                  borderRadius: '50%',
                  transform: 'scale(0)',
                  animation: rippleActive === item.id ? 'ripple 0.6s linear' : 'none',
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                  pointerEvents: 'none',
                },
                '@keyframes ripple': {
                  to: {
                    transform: 'scale(4)',
                    opacity: 0,
                  }
                }
              }}
            >
              {rippleActive === item.id && (
                <Box
                  className="ripple"
                  sx={{
                    width: 100,
                    height: 100,
                    left: ripplePosition.x - 50,
                    top: ripplePosition.y - 50,
                  }}
                />
              )}
              <CardContent sx={{ flex: '1 0 auto', p: 1.25 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  mb: 1,
                  gap: 0.5
                }}>
                  <Typography 
                    variant="subtitle1" 
                    component="h2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      wordBreak: 'break-word',
                      flex: 1,
                      fontWeight: 800,
                      color: '#4B9CDB',
                      fontSize: '1.2rem',
                      letterSpacing: '0.01em'
                    }}
                  >
                    {highlightText(item.command, searchQuery)}
                  </Typography>
                  {item.category && (
                    <Chip
                      label={highlightText(item.category, searchQuery)}
                      size="small"
                      color="primary"
                      sx={{ 
                        ml: 1, 
                        flexShrink: 0,
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(129, 140, 248, 0.2)'
                          : 'rgba(99, 102, 241, 0.1)',
                        color: theme.palette.mode === 'dark'
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                        borderColor: 'transparent',
                        fontWeight: 500,
                        height: '24px',
                        '& .MuiChip-label > span': {
                          backgroundColor: 'transparent !important',
                          px: '0 !important'
                        }
                      }}
                    />
                  )}
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    mb: 1,
                    lineHeight: 1.4,
                    fontSize: '0.7rem',
                    opacity: 0.6,
                    fontStyle: 'normal'
                  }}
                >
                  {highlightText(item.description, searchQuery)}
                </Typography>

              </CardContent>

              <Box sx={{ mt: 'auto' }}>
                <CardActions 
                  className="card-actions"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                    p: { xs: 1, sm: 1.5 },
                    '& .MuiIconButton-root': {
                      opacity: { xs: 1, sm: 0 },
                      transition: 'opacity 0.2s ease-in-out',
                    }
                  }}
                >
                  {/* Tags section */}
                  <Box sx={{ display: 'flex', gap: 0.5, flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    {item.tags && item.tags.length > 0 && (
                      <>
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Chip
                            key={index}
                            label={highlightText(tag, searchQuery)}
                            size="small"
                            sx={{ 
                              bgcolor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.05)',
                              color: 'text.secondary',
                              border: 'none',
                              height: '20px',
                              '& .MuiChip-label': {
                                px: 1,
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        ))}
                        {item.tags.length > 3 && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary',
                              opacity: 0.7,
                              alignSelf: 'center'
                            }}
                          >
                            +{item.tags.length - 3}
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                  
                  {/* Action buttons */}
                  <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.command);
                      }}
                      sx={{
                        color: theme.palette.primary.main
                      }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(item);
                      }}
                      sx={{
                        color: theme.palette.error.main
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                      sx={{
                        color: theme.palette.info.main
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this command?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
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
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  )
}

export default CommandList 