import { Card, CardContent, Typography, Grid, Box, Chip, IconButton, CardActions, useTheme, Snackbar, Alert, Dialog, DialogTitle, DialogActions, DialogContent, Button, CardActionArea, Tooltip, Popover } from '@mui/material'
import { ContentCopy, Delete, Edit, MoreHoriz, Close } from '@mui/icons-material'
import { useState } from 'react'

function CommandList({ commands, onDelete, onEdit, searchQuery }) {
  const theme = useTheme()
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 })
  const [rippleActive, setRippleActive] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [tagsAnchorEl, setTagsAnchorEl] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])

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

  const handleTagsMoreClick = (event, tags) => {
    event.stopPropagation();
    setTagsAnchorEl(event.currentTarget);
    setSelectedTags(tags);
  };

  const handleTagsPopoverClose = () => {
    setTagsAnchorEl(null);
  };

  const tagsPopoverOpen = Boolean(tagsAnchorEl);

  return (
    <>
      <Grid container spacing={2}>
        {commands.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={item.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(10, 25, 41, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                position: 'relative',
                '&:hover .action-buttons': {
                  opacity: 1,
                  visibility: 'visible',
                },
              }}
            >
              <CardActionArea
                onClick={(e) => handleCardClick(e, item)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  '& .MuiCardActionArea-focusHighlight': {
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <CardContent sx={{ 
                  flex: '1 0 auto', 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  position: 'relative'
                }}>
                  {item.category && (
                    <Chip
                      label={highlightText(item.category, searchQuery)}
                      size="small"
                      color="primary"
                      sx={{ 
                        position: 'absolute',
                        top: 12,
                        right: 16,
                        fontWeight: 700,
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(129, 140, 248, 0.4)'
                          : 'rgba(99, 102, 241, 0.2)',
                        color: theme.palette.mode === 'dark'
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                        borderColor: 'transparent',
                        height: '28px',
                        fontSize: '0.85rem',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '14px',
                        '&:hover': {
                          background: theme.palette.mode === 'dark'
                            ? 'rgba(129, 140, 248, 0.45)'
                            : 'rgba(99, 102, 241, 0.25)'
                        }
                      }}
                    />
                  )}
                  <Typography 
                    variant="subtitle1" 
                    component="h2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      wordBreak: 'break-word',
                      flex: 1,
                      fontWeight: 800,
                      color: theme.palette.primary.main,
                      fontSize: '1.1rem',
                      letterSpacing: '0.01em',
                      lineHeight: 1.4,
                      pr: item.category ? 8 : 0
                    }}
                  >
                    {highlightText(item.command, searchQuery)}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      opacity: 0.8
                    }}
                  >
                    {highlightText(item.description, searchQuery)}
                  </Typography>
                </CardContent>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    pt: 1,
                    borderTop: '1px solid',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(0, 0, 0, 0.2)'
                        : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  {/* Tags Section */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flex: 1 }}>
                    {item.tags && item.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={index}
                        label={highlightText(tag, searchQuery)}
                        size="small"
                        sx={{ 
                          background: theme.palette.mode === 'dark'
                            ? 'rgba(129, 140, 248, 0.15)'
                            : 'rgba(99, 102, 241, 0.08)',
                          color: theme.palette.mode === 'dark'
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                          borderColor: theme.palette.mode === 'dark'
                            ? 'rgba(129, 140, 248, 0.3)'
                            : 'rgba(99, 102, 241, 0.2)',
                          border: '1px solid',
                          fontWeight: 400,
                          height: '24px',
                          fontSize: '0.8rem',
                          borderRadius: '4px',
                          '&:hover': {
                            background: theme.palette.mode === 'dark'
                              ? 'rgba(129, 140, 248, 0.2)'
                              : 'rgba(99, 102, 241, 0.12)',
                            borderColor: theme.palette.mode === 'dark'
                              ? 'rgba(129, 140, 248, 0.4)'
                              : 'rgba(99, 102, 241, 0.3)'
                          }
                        }}
                      />
                    ))}
                    {item.tags && item.tags.length > 3 && (
                      <Chip
                        icon={<MoreHoriz />}
                        label={`+${item.tags.length - 3}`}
                        size="small"
                        onClick={(e) => handleTagsMoreClick(e, item.tags)}
                        sx={{ 
                          cursor: 'pointer',
                          background: theme.palette.mode === 'dark'
                            ? 'rgba(129, 140, 248, 0.2)'
                            : 'rgba(99, 102, 241, 0.1)',
                          color: theme.palette.mode === 'dark'
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                        }}
                      />
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Box
                    className="action-buttons"
                    sx={{
                      display: 'flex',
                      gap: 1,
                      opacity: 0,
                      visibility: 'hidden',
                      transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
                      ml: 2,
                    }}
                  >
                    <Tooltip title="Copy">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(item.command);
                        }}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(item);
                        }}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}
                        sx={{ color: theme.palette.info.main }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tags Popover */}
      <Popover
        open={tagsPopoverOpen}
        anchorEl={tagsAnchorEl}
        onClose={handleTagsPopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column',
          gap: 1, 
          maxWidth: '300px',
          position: 'relative'
        }}>
          <IconButton
            size="small"
            onClick={handleTagsPopoverClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                color: theme => theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.9)'
                  : 'rgba(0, 0, 0, 0.7)',
              }
            }}
          >
            <Close fontSize="small" />
          </IconButton>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pt: 2 }}>
            {selectedTags.map((tag, index) => (
              <Chip
                key={index}
                label={highlightText(tag, searchQuery)}
                size="small"
                color="primary"
                sx={{ 
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(129, 140, 248, 0.2)'
                    : 'rgba(99, 102, 241, 0.1)',
                  color: theme.palette.mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                }}
              />
            ))}
          </Box>
        </Box>
      </Popover>

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