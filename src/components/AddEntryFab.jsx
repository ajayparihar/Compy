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
      }}
    >
      <Add />
    </Fab>
  )
}

export default AddEntryFab 