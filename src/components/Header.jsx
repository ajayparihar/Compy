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
  Checkbox,
  ListItemIcon,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog
} from '@mui/material'
import {
  Brightness4,
  Brightness7,
  FileUpload,
  Search,
  History,
  Clear,
  Add,
  Person,
  Edit,
  FileDownload,
  RestartAlt
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
  onAddClick,
  userName
}) {
  const theme = useTheme()
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory')
    return saved ? JSON.parse(saved) : []
  })
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const [exportOptions, setExportOptions] = useState({ name: false, theme: false, favoriteTheme: false, data: false });
  const [isLoading, setIsLoading] = useState({
    import: false,
    export: false,
    nameChange: false
  });
  const [lastOperation, setLastOperation] = useState({
    type: null,
    status: null,
    message: ''
  });

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

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle if no input/textarea is focused
      if (document.activeElement.tagName === 'INPUT' || 
          document.activeElement.tagName === 'TEXTAREA') return;

      // Profile menu shortcuts
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            handleProfileClick(e);
            break;
          case 'i':
            e.preventDefault();
            if (Boolean(anchorEl)) handleImport();
            break;
          case 'e':
            e.preventDefault();
            if (Boolean(anchorEl)) handleExport();
            break;
          case 'n':
            e.preventDefault();
            if (Boolean(anchorEl)) setShowNameModal(true);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [anchorEl]);

  // Enhanced profile menu handlers
  const handleProfileClick = (event) => {
    if (event?.currentTarget) {
      setAnchorEl(event.currentTarget);
    } else {
      // If triggered by keyboard shortcut, position near the profile button
      const profileButton = document.querySelector('[aria-label*="Profile menu"]');
      if (profileButton) setAnchorEl(profileButton);
    }
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  // Add keyboard navigation within menu
  const handleMenuKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleProfileClose();
    }
  };

  const handleExportOptionChange = (event) => {
    setExportOptions({ ...exportOptions, [event.target.name]: event.target.checked });
  };

  const handleExportData = () => {
    // Logic to export data based on selected options
    console.log('Exporting data with options:', exportOptions);
  };

  // Enhanced handlers with loading states and feedback
  const handleImport = async () => {
    try {
      setIsLoading(prev => ({ ...prev, import: true }));
      await onImportClick();
      setLastOperation({
        type: 'import',
        status: 'success',
        message: 'Data imported successfully'
      });
    } catch (error) {
      setLastOperation({
        type: 'import',
        status: 'error',
        message: 'Failed to import data: ' + error.message
      });
    } finally {
      setIsLoading(prev => ({ ...prev, import: false }));
      handleProfileClose();
    }
  };

  // Enhanced export functionality
  const handleExport = async () => {
    try {
      setIsLoading(prev => ({ ...prev, export: true }));
      
      // Prepare export data
      const exportData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        profile: {
          userName,
          theme: theme.palette.mode,
          settings: {
            // Add any app settings here
          }
        },
        data: {
          searchHistory,
          // Add other data to export
        }
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = `compy-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setLastOperation({
        type: 'export',
        status: 'success',
        message: `Data exported successfully as ${fileName}`
      });
    } catch (error) {
      setLastOperation({
        type: 'export',
        status: 'error',
        message: 'Failed to export data: ' + error.message
      });
    } finally {
      setIsLoading(prev => ({ ...prev, export: false }));
      handleProfileClose();
    }
  };

  const handleNameChange = async (newName) => {
    try {
      setIsLoading(prev => ({ ...prev, nameChange: true }));
      // Add validation
      if (!newName.trim()) {
        throw new Error('Name cannot be empty');
      }
      if (newName.trim() === userName) {
        throw new Error('New name must be different');
      }
      // Update name logic here
      setLastOperation({
        type: 'nameChange',
        status: 'success',
        message: 'Name updated successfully'
      });
    } catch (error) {
      setLastOperation({
        type: 'nameChange',
        status: 'error',
        message: error.message
      });
    } finally {
      setIsLoading(prev => ({ ...prev, nameChange: false }));
    }
  };

  // Add feedback snackbar
  useEffect(() => {
    if (lastOperation.status) {
      const timer = setTimeout(() => {
        setLastOperation({ type: null, status: null, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastOperation]);

  // Handle mobile search close
  const handleMobileSearchClose = () => {
    setMobileSearchOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(20px)',
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(10, 25, 41, 0.85)'
              : 'rgba(255, 255, 255, 0.85)',
          borderBottom: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 4px 30px rgba(0, 0, 0, 0.3)'
              : '0 4px 30px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Toolbar
          variant="dense"
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2, md: 3 },
            py: { xs: 1, sm: 1.25 },
            px: { xs: 2, sm: 3, md: 4 },
            minHeight: { xs: '60px !important', sm: '68px !important' },
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '@media print': {
              display: 'none'
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 }
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              onClick={() => window.location.reload()}
              sx={{
                flexShrink: 0,
                fontWeight: 700,
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                cursor: 'pointer',
                position: 'relative',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #00ffff 0%, #2196f3 100%)'
                    : 'linear-gradient(45deg, #00bcd4 0%, #2196f3 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 0 20px rgba(33, 150, 243, 0.3)'
                    : '0 0 20px rgba(33, 150, 243, 0.2)',
                '&:hover': {
                  transform: 'scale(1.02)',
                  textShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 0 25px rgba(33, 150, 243, 0.4)'
                      : '0 0 25px rgba(33, 150, 243, 0.3)',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Compy
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'relative',
              flex: '1 1 auto',
              maxWidth: '600px',
              minWidth: 0,
              mx: { xs: 2, sm: 3, md: 4 },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            <Autocomplete
              freeSolo
              options={searchHistory}
              value={searchQuery}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleSearchSubmit(newValue);
                }
              }}
              onInputChange={(event, newValue) => {
                onSearchChange(newValue);
                if (!newValue) {
                  handleClearSearch();
                }
              }}
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
                    sx: {
                      height: { xs: '40px', sm: '44px' },
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.03)',
                      borderRadius: '12px',
                      '&:hover': {
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.05)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.07)',
                        '& fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '2px',
                        },
                      },
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search
                          sx={{
                            color: 'text.secondary',
                            ml: 1,
                            opacity: 0.7,
                            fontSize: { xs: '1.1rem', sm: '1.2rem' }
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            onSearchChange('');
                            handleClearSearch();
                          }}
                          sx={{
                            mr: 0.5,
                            opacity: 0.7,
                            '&:hover': { opacity: 1 }
                          }}
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 },
            }}
          >
            <Tooltip title="Search" arrow>
              <IconButton
                onClick={() => setMobileSearchOpen(true)}
                sx={{
                  display: { sm: 'none' },
                  width: { xs: '38px', sm: '42px' },
                  height: { xs: '38px', sm: '42px' },
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <Search sx={{ fontSize: { xs: '1.35rem', sm: '1.5rem' } }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add new item" arrow>
              <IconButton
                onClick={onAddClick}
                sx={{
                  width: { xs: '38px', sm: '42px' },
                  height: { xs: '38px', sm: '42px' },
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <Add sx={{ fontSize: { xs: '1.35rem', sm: '1.5rem' } }} />
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                height: '24px',
                width: '1px',
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                mx: { xs: 0.5, sm: 1 }
              }}
            />

            <ThemeSelector />

            <Tooltip title="Import data" arrow>
              <IconButton
                onClick={onImportClick}
                sx={{
                  width: { xs: '38px', sm: '42px' },
                  height: { xs: '38px', sm: '42px' },
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <FileUpload sx={{ fontSize: { xs: '1.35rem', sm: '1.5rem' } }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={`Profile: ${userName}`} arrow>
              <IconButton
                onClick={handleProfileClick}
                sx={{
                  width: { xs: '38px', sm: '42px' },
                  height: { xs: '38px', sm: '42px' },
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)',
                  '&:hover': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)'
                        : 'linear-gradient(135deg, #00bcd4 0%, #2196f3 100%)',
                    color: '#fff',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 2px 8px rgba(33, 150, 243, 0.3)'
                        : '0 2px 8px rgba(33, 150, 243, 0.2)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {userName ? userName.slice(0, 2) : 'U'}
                </Box>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileClose}
          onClick={handleProfileClose}
          onKeyDown={handleMenuKeyDown}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1.5,
              minWidth: 280,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              background: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(10, 25, 41, 0.85)'
                : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1.5,
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                  transform: 'translateX(4px)',
                },
                '&:active': {
                  transform: 'translateX(4px) scale(0.98)',
                },
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(10, 25, 41, 0.85)'
                  : 'rgba(255, 255, 255, 0.85)',
                transform: 'translateY(-50%) rotate(45deg)',
                borderLeft: '1px solid',
                borderTop: '1px solid',
                borderColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Person fontSize="small" />
              {userName}
            </Typography>
          </Box>
          <Divider 
            sx={{ 
              my: 1,
              opacity: (theme) => theme.palette.mode === 'dark' ? 0.1 : 0.2 
            }} 
          />
          <MenuItem 
            onClick={() => !isLoading.nameChange && setShowNameModal(true)}
            disabled={isLoading.nameChange}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: 'primary.main',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.primary.main + '1A',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto' }}>
              {isLoading.nameChange ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Edit fontSize="small" />
              )}
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">Change Name</Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block' }}
              >
                {isLoading.nameChange ? 'Updating...' : `Current: ${userName}`}
              </Typography>
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.7,
                border: '1px solid',
                borderColor: 'divider',
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                fontSize: '0.7rem',
                letterSpacing: '0.5px'
              }}
            >
              Ctrl+N
            </Typography>
          </MenuItem>
          <MenuItem 
            onClick={handleImport}
            disabled={isLoading.import}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: 'info.main',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.info.main + '1A',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto' }}>
              {isLoading.import ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <FileUpload fontSize="small" />
              )}
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">Import Data</Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block' }}
              >
                {isLoading.import ? 'Importing...' : 'Import commands & settings'}
              </Typography>
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.7,
                border: '1px solid',
                borderColor: 'divider',
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                fontSize: '0.7rem',
                letterSpacing: '0.5px'
              }}
            >
              Ctrl+I
            </Typography>
          </MenuItem>
          <MenuItem 
            onClick={handleExport}
            disabled={isLoading.export}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: 'success.main',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.success.main + '1A',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto' }}>
              {isLoading.export ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <FileDownload fontSize="small" />
              )}
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">Export Data</Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block' }}
              >
                {isLoading.export ? 'Exporting...' : 'Backup your data & settings'}
              </Typography>
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.7,
                border: '1px solid',
                borderColor: 'divider',
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                fontSize: '0.7rem',
                letterSpacing: '0.5px'
              }}
            >
              Ctrl+E
            </Typography>
          </MenuItem>
          <Divider 
            sx={{ 
              my: 1,
              opacity: (theme) => theme.palette.mode === 'dark' ? 0.1 : 0.2 
            }} 
          />
          <MenuItem 
            onClick={() => setShowResetDialog(true)}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: 'error.main',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.error.main + '1A',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto' }}>
              <RestartAlt fontSize="small" />
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">Reset All Data</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  color: 'error.light'
                }}
              >
                Warning: This cannot be undone
              </Typography>
            </Box>
          </MenuItem>
          {/* Add feedback Snackbar */}
          <Snackbar
            open={Boolean(lastOperation.status)}
            autoHideDuration={3000}
            onClose={() => setLastOperation({ type: null, status: null, message: '' })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              severity={lastOperation.status === 'success' ? 'success' : 'error'}
              sx={{ width: '100%' }}
            >
              {lastOperation.message}
            </Alert>
          </Snackbar>
        </Menu>
      </AppBar>

      {/* Mobile Search Dialog */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={mobileSearchOpen}
        onClose={handleMobileSearchClose}
        TransitionProps={{
          onExited: () => {
            // Reset search when dialog closes
            if (!searchQuery) {
              onSearchChange('');
              handleClearSearch();
            }
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark'
                ? 'rgba(10, 25, 41, 0.85)'
                : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Autocomplete
            freeSolo
            options={searchHistory}
            value={searchQuery}
            onChange={(event, newValue) => {
              if (newValue) {
                handleSearchSubmit(newValue);
                handleMobileSearchClose();
              }
            }}
            onInputChange={(event, newValue) => {
              onSearchChange(newValue);
              if (!newValue) {
                handleClearSearch();
              }
            }}
            PopperComponent={CustomPopper}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search items..."
                fullWidth
                autoFocus
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    height: '48px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '12px',
                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.07)',
                      '& fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        sx={{
                          color: 'text.secondary',
                          ml: 1,
                          opacity: 0.7,
                          fontSize: '1.2rem'
                        }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          onSearchChange('');
                          handleClearSearch();
                        }}
                        sx={{
                          mr: 0.5,
                          opacity: 0.7,
                          '&:hover': { opacity: 1 }
                        }}
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>
      </Dialog>
    </>
  )
}

export default Header