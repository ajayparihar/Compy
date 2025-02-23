import { Fab } from '@mui/material'
import { Add } from '@mui/icons-material'

function AddEntryFab({ onClick }) {
  return (
    <Fab
      color="primary"
      aria-label="add command"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        '&:hover': {
          transform: 'scale(1.05)',
        },
        transition: 'transform 0.2s'
      }}
    >
      <Add />
    </Fab>
  )
}

export default AddEntryFab 