import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Tabs,
  Tab,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Star,
  StarBorder,
  Palette
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../hooks/useTheme';

function ThemeSelector() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const muiTheme = useMuiTheme();
  const { currentTheme, setCurrentTheme, favoriteThemes, toggleFavorite, themes } = useTheme();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (themeId) => {
    try {
      setCurrentTheme(themeId);
      // Force immediate re-render of theme-dependent components
      document.documentElement.className = document.documentElement.className
        .split(" ")
        .filter((cls) => !cls.startsWith("d") && !cls.startsWith("l"))
        .join(" ");
      document.documentElement.classList.add(themeId);
    } catch (error) {
      console.error('Error changing theme:', error);
    } finally {
      handleClose();
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderThemeMenuItem = (themeId, themeData) => (
    <MenuItem
      key={themeId}
      onClick={() => handleThemeChange(themeId)}
      selected={currentTheme === themeId}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        gap: 1,
      }}
      aria-label={`Select ${themeData.name} theme`}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: themeData.palette.primary.main,
            border: `2px solid ${themeData.palette.primary.dark}`,
          }}
        />
        <ListItemText primary={themeData.name} />
      </Box>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(themeId);
        }}
        aria-label={`Toggle favorite for ${themeData.name}`}
      >
        {favoriteThemes.includes(themeId) ? (
          <Star fontSize="small" sx={{ color: muiTheme.palette.warning.main }} />
        ) : (
          <StarBorder fontSize="small" />
        )}
      </IconButton>
    </MenuItem>
  );

  const menuContent = currentTab === 0 ? [
    <Typography key="dark-title" variant="subtitle2" sx={{ p: 1, opacity: 0.7 }}>
      Dark Themes
    </Typography>,
    ...Object.entries(themes.dark).map(([themeId, themeData]) =>
      renderThemeMenuItem(themeId, themeData)
    ),
    <Divider key="divider" sx={{ my: 1 }} />,
    <Typography key="light-title" variant="subtitle2" sx={{ p: 1, opacity: 0.7 }}>
      Light Themes
    </Typography>,
    ...Object.entries(themes.light).map(([themeId, themeData]) =>
      renderThemeMenuItem(themeId, themeData)
    ),
  ] : [
    ...Object.entries(themes)
      .flatMap(([category, categoryThemes]) =>
        Object.entries(categoryThemes)
          .filter(([themeId]) => favoriteThemes.includes(themeId))
          .map(([themeId, themeData]) => renderThemeMenuItem(themeId, themeData))
      )
  ];

  return (
    <>
      <Tooltip title="Theme Settings">
        <IconButton onClick={handleClick} color="inherit">
          <Palette />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: '300px',
          }
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
          <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="All Themes" />
            <Tab label="Favorites" />
          </Tabs>
        </Box>
        {menuContent}
      </Menu>
    </>
  );
}

export default ThemeSelector;
