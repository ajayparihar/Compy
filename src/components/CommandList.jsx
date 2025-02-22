import { Card, CardContent, Typography, Grid, Box, Chip, IconButton, CardActions, Divider } from '@mui/material'
import { ContentCopy, Delete, Edit } from '@mui/icons-material'

function CommandList({ commands, onDelete, onEdit }) {
  const handleCopy = (command) => {
    navigator.clipboard.writeText(command)
  }

  return (
    <Grid container spacing={2}>
      {commands.map((cmd) => (
        <Grid item xs={12} sm={6} md={4} key={cmd.id}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[4]
              }
            }}
          >
            <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    fontFamily: 'monospace',
                    wordBreak: 'break-word',
                    flex: 1,
                    mb: 0
                  }}
                >
                  {cmd.command}
                </Typography>
                {cmd.category && (
                  <Chip
                    label={cmd.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1, flexShrink: 0 }}
                  />
                )}
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {cmd.description}
              </Typography>
            </CardContent>

            <Box sx={{ mt: 'auto', width: '100%' }}>
              {cmd.tags && cmd.tags.length > 0 && (
                <>
                  <Divider />
                  <Box sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {cmd.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            bgcolor: (theme) => 
                              theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.05)' 
                                : 'rgba(0, 0, 0, 0.05)'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              )}
              
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleCopy(cmd.command)}
                  title="Copy command"
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
                {onEdit && (
                  <IconButton 
                    size="small" 
                    onClick={() => onEdit(cmd)}
                    title="Edit command"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                )}
                {onDelete && (
                  <IconButton 
                    size="small" 
                    onClick={() => onDelete(cmd.id)}
                    title="Delete command"
                    color="error"
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
  )
}

export default CommandList 