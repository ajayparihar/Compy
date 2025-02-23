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
  InputAdornment
} from '@mui/material'
import {
  Brightness4,
  Brightness7,
  FileUpload,
  Search,
  History,
  Clear
} from '@mui/icons-material'

function Header({
  searchQuery,
  onSearchChange,
  onImportClick,
  isDarkMode,
  onThemeToggle,
}) {
  const theme = useTheme()
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory')
    return saved ? JSON.parse(saved) : []
  })
  const [isSearchFocused, setIsSearchFocused] = useState(false)

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

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: theme.palette.mode === 'dark'
          ? 'rgba(15, 23, 42, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        width: '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1,
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
            flex: 1,
            maxWidth: { xs: '100%', sm: 800, md: 1000, lg: 1200 },
            mx: 'auto',
            position: 'relative',
          }}
        >
          <Autocomplete
            freeSolo
            options={searchHistory}
            inputValue={searchQuery}
            onInputChange={(event, newValue) => onSearchChange(newValue)}
            onChange={(event, newValue) => handleSearchSubmit(newValue)}
            PopperComponent={CustomPopper}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search commands... (Press '/' to focus)"
                size="medium"
                fullWidth
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      {searchQuery ? (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSearchChange('');
                          }}
                          sx={{
                            color: 'text.secondary',
                            ml: 0.5,
                            '&:hover': {
                              color: 'text.primary',
                            },
                          }}
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      ) : (
                        <Search
                          sx={{
                            color: 'text.secondary',
                            ml: 1,
                            mr: 0.5,
                          }}
                        />
                      )}
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
                {option}
              </Box>
            )}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <IconButton
            onClick={onImportClick}
            color="primary"
            title="Import commands"
            sx={{
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <FileUpload />
          </IconButton>
          <IconButton
            onClick={onThemeToggle}
            color="primary"
            title="Toggle theme"
            sx={{
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header