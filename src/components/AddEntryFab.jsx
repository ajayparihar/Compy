import { IconButton } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

function AddEntryFab({ onClick }) {
  return (
    <IconButton
      icon={<AddIcon />}
      aria-label="Add new entry"
      onClick={onClick}
      position="fixed"
      bottom={4}
      right={4}
      size="lg"
      isRound
      variant="primary"
      shadow="lg"
      _hover={{
        transform: 'scale(1.05)',
      }}
      transition="all 0.2s"
    />
  )
}

export default AddEntryFab 