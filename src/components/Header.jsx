import { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Autocomplete,
  TextField,
  useTheme,
  Popper,
  Paper,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox
} from '@mui/material'
import {
  Brightness4,
  Brightness7,
  FileUpload,
  Search,
  History,
  Clear,
  Add,
  Person
} from '@mui/icons-material'
import ThemeSelector from './ThemeSelector'

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
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 0, 0.5)'
            : 'rgba(255, 255, 0, 0.3)',
          color: (theme) => theme.palette.mode === 'dark'
            ? theme.palette.primary.light
            : theme.palette.primary.main,
          borderRadius: '2px',
          display: 'inline',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
        }}
      >
        {part}
      </Box>
    ) : part
  );
};

function Header({
  searchQuery,
  onSearchChange,
  onImportClick,
  isDarkMode,
  onThemeToggle,
  onAddClick
}) {
  const theme = useTheme()
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory')
    return saved ? JSON.parse(saved) : []
  })
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const [exportOptions, setExportOptions] = useState({ name: false, theme: false, favoriteTheme: false, data: false });

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  }, [searchHistory])

  // Enhanced search submission handler
  const handleSearchSubmit = (query) => {
    if (!query) return

    if (!searchHistory.includes(query)) {
      setSearchHistory((prev) => [query, ...prev].slice(0, 10))
    }
    onSearchChange(query)
  }

  // Custom Popper component for search suggestions
  const CustomPopper = function (props) {
    return (
      <Popper
        {...props}
        placement="bottom-start"
        style={{
          width: props.style.width,
          marginTop: '8px',
        }}
      >
        <Paper
          elevation={8}
          sx={{
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(15, 23, 42, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
          }}
        >
          {props.children}
        </Paper>
      </Popper>
    )
  }

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleExportOptionChange = (event) => {
    setExportOptions({ ...exportOptions, [event.target.name]: event.target.checked });
  };

  const handleExportData = () => {
    // Logic to export data based on selected options
    console.log('Exporting data with options:', exportOptions);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        zIndex: 1100,
        // width: '100%',
        backdropFilter: 'blur(10px)',
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(10, 25, 41, 0.7)'
            : 'rgba(255, 255, 255, 0.7)',
        borderBottom: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
        mb: 3
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 4,
          py: 2,
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{
            flexShrink: 0,
            fontWeight: 600,
            letterSpacing: '-0.5px',
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            cursor: 'pointer',
            position: 'relative',
            '&:hover': {
              opacity: 0.8,
              '&::after': {
                transform: 'scaleX(1)',
              },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -2,
              left: 0,
              right: 0,
              margin: '0 auto',
              width: '100%',
              height: '2px',
              backgroundColor: 'primary.main',
              transform: 'scaleX(0)',
              transformOrigin: '50% 50%',
              transition: 'transform 0.3s ease-out',
            },
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          Compy
        </Typography>

        <Box
          sx={{
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Autocomplete
              freeSolo
              fullWidth
              disableClearable
              sx={{
                width: { xs: '90%', sm: '70vw' },
              }}
              options={searchHistory}
              inputValue={searchQuery}
              onInputChange={(event, newValue) => onSearchChange(newValue)}
              onChange={(event, newValue) => handleSearchSubmit(newValue)}
              PopperComponent={CustomPopper}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search items... (Press '/' to focus)"
                  fullWidth
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <> 
                        {/* <Search
                          sx={{
                            color: 'text.secondary',
                            ml: 1,
                            mr: 0.5,
                          }}
                        /> */}
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {searchHistory.length > 0 && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchHistory([]);
                              }}
                              title="Clear search history"
                            >
                              <History />
                            </IconButton>
                          </InputAdornment>
                        )}
                      </>
                    ),
                    clearIcon: null
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.04)',
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.06)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.08)',
                      },
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 1,
                    px: 2,
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <History fontSize="small" sx={{ color: 'text.secondary' }} />
                  {highlightText(option, searchQuery)}
                </Box>
              )}
            />
            <Tooltip title="Add new item">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddClick();
                }}
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)',
                    color: 'primary.dark',
                  },
                }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ThemeSelector />
          <IconButton
            onClick={onImportClick}
            sx={{ 
              ml: 1,
              color: 'primary.main',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                color: 'primary.dark',
              },
            }}
          >
            <FileUpload />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleProfileClick} color="inherit">
            <Person />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}>
            <MenuItem disabled>User Name</MenuItem>
            <MenuItem onClick={onImportClick}>Import</MenuItem>
            <MenuItem onClick={() => setShowResetDialog(true)}>Reset</MenuItem>
            <MenuItem onClick={handleExportData}>Export Data</MenuItem>
            <MenuItem>
              <Checkbox checked={exportOptions.name} onChange={handleExportOptionChange} name="name" /> Name
            </MenuItem>
            <MenuItem>
              <Checkbox checked={exportOptions.theme} onChange={handleExportOptionChange} name="theme" /> Theme Selected
            </MenuItem>
            <MenuItem>
              <Checkbox checked={exportOptions.favoriteTheme} onChange={handleExportOptionChange} name="favoriteTheme" /> Favorite Theme
            </MenuItem>
            <MenuItem>
              <Checkbox checked={exportOptions.data} onChange={handleExportOptionChange} name="data" /> Data
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </Box>
  )
}

export default Header