import { Card, CardContent, Typography, Grid, Box, Chip, IconButton, CardActions, Divider, useTheme, Snackbar, Alert } from '@mui/material'
import { ContentCopy, Delete, Edit } from '@mui/icons-material'
import { useState } from 'react'

function CommandList({ commands, onDelete, onEdit, searchQuery }) {
  const theme = useTheme()
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 })
  const [rippleActive, setRippleActive] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  
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
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card 
              onClick={(e) => handleCardClick(e, item)}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
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
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(30, 41, 59, 0.6)'
                    : 'rgba(255, 255, 255, 0.85)',
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(0, 0, 0, 0.15)',
                  '& .copy-button': {
                    opacity: 1,
                    visibility: 'visible',
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
              <CardContent sx={{ flex: '1 0 auto', p: 1.5 }}>
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
                      fontWeight: 600,
                      color: theme.palette.mode === 'dark'
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                      fontSize: '0.85rem'
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
                    fontSize: '0.8rem'
                  }}
                >
                  {highlightText(item.description, searchQuery)}
                </Typography>

                {item.tags && item.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {item.tags.map((tag, index) => (
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
                          },
                          '& .MuiChip-label > span': {
                            backgroundColor: 'transparent !important',
                            px: '0 !important'
                          },
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(0, 0, 0, 0.08)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>

              <Box sx={{ mt: 'auto' }}>
                <Divider sx={{ 
                  opacity: theme.palette.mode === 'dark' ? 0.1 : 0.2 
                }} />
                <CardActions 
                  onClick={(e) => e.stopPropagation()}
                  sx={{ 
                    justifyContent: 'flex-end', 
                    p: 1,
                    gap: 0.5
                  }}
                >
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy(item.command)
                    }}
                    title="Copy item"
                    className="copy-button"
                    sx={{
                      color: theme.palette.primary.main,
                      opacity: 0,
                      visibility: 'hidden',
                      transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark'
                          ? 'rgba(129, 140, 248, 0.1)'
                          : 'rgba(99, 102, 241, 0.1)',
                      }
                    }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                  {onEdit && (
                    <IconButton 
                      size="small" 
                      onClick={() => onEdit(item)}
                      title="Edit item"
                      sx={{
                        color: theme.palette.secondary.main,
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark'
                            ? 'rgba(244, 114, 182, 0.1)'
                            : 'rgba(236, 72, 153, 0.1)',
                        }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton 
                      size="small" 
                      onClick={() => onDelete(item.id)}
                      title="Delete item"
                      sx={{
                        color: theme.palette.error.main,
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark'
                            ? 'rgba(244, 63, 94, 0.1)'
                            : 'rgba(225, 29, 72, 0.1)',
                        }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </CardActions>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
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