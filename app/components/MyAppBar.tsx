import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function MyAppBar() {
  return (
    <Box sx={{ flexGrow: 1, margin: 0, width: '100%', maxWidth: '800px', padding: '0 16px' }}>
      <AppBar position="static" sx={{ width: '100%', margin: 0, left: 0, right: 0, boxSizing: 'border-box' }}>
        <Toolbar>
          <Typography variant="h6">
            Compy
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MyAppBar; 