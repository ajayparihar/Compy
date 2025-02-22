import { AppBar, Toolbar, Typography, IconButton, Box, Autocomplete, TextField } from '@mui/material'
import { Brightness4, Brightness7, FileUpload } from '@mui/icons-material'

function Header({ searchQuery, onSearchChange, onImportClick, isDarkMode, onThemeToggle }) {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h6" component="h1" color="primary" sx={{ flexShrink: 0 }}>
          Compy
        </Typography>

        <Box sx={{ flex: 1, maxWidth: 600, mx: 'auto' }}>
          <Autocomplete
            freeSolo
            options={[]}
            inputValue={searchQuery}
            onInputChange={(event, newValue) => onSearchChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search commands..."
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: (theme) => 
                      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  }
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={onImportClick} color="primary" title="Import commands">
            <FileUpload />
          </IconButton>
          <IconButton onClick={onThemeToggle} color="primary" title="Toggle theme">
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header 