import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box
} from '@mui/material';

const ExportModal = ({ open, onClose, onExport }) => {
  const [options, setOptions] = useState({
    fullProfile: false,
    data: false
  });

  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleExport = () => {
    if (!options.fullProfile && !options.data) {
      // Show error or notification that at least one option must be selected
      return;
    }
    onExport(options);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Options</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={options.fullProfile}
                onChange={() => handleOptionChange('fullProfile')}
              />
            }
            label={
              <Box>
                <Typography variant="body1">Full Profile</Typography>
                <Typography variant="body2" color="text.secondary">
                  Includes all settings and preferences
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={options.data}
                onChange={() => handleOptionChange('data')}
              />
            }
            label={
              <Box>
                <Typography variant="body1">Data</Typography>
                <Typography variant="body2" color="text.secondary">
                  Includes commands and entries
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleExport}
          variant="contained" 
          color="primary"
          disabled={!options.fullProfile && !options.data}
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal; 