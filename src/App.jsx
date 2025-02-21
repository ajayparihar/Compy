import { useState } from 'react'
import { Box, Container, useToast } from '@chakra-ui/react'
import Header from './components/Header'
import CommandList from './components/CommandList'
import AddEntryModal from './components/AddEntryModal'
import ImportModal from './components/ImportModal'
import AddEntryFab from './components/AddEntryFab'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const [commands, setCommands] = useLocalStorage('commands', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const toast = useToast()

  const filteredCommands = commands.filter(cmd => {
    const searchLower = searchQuery.toLowerCase()
    return cmd.command.toLowerCase().includes(searchLower) ||
           cmd.description.toLowerCase().includes(searchLower) ||
           cmd.category?.toLowerCase().includes(searchLower) ||
           cmd.tags?.some(tag => tag.toLowerCase().includes(searchLower))
  })

  const handleAddCommand = (newCommand) => {
    setCommands([...commands, { ...newCommand, id: Date.now() }])
    setShowAddModal(false)
    toast({
      title: 'Success',
      description: 'Command added successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'bottom',
    })
  }

  const handleImportCommands = (importedCommands) => {
    setCommands([...commands, ...importedCommands])
    setShowImportModal(false)
    toast({
      title: 'Success',
      description: 'Commands imported successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'bottom',
    })
  }

  return (
    <Box minH="100vh" bg="chakra-body-bg" color="chakra-body-text">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onImportClick={() => setShowImportModal(true)}
      />

      <Container maxW="container.xl" py={8}>
        <CommandList commands={filteredCommands} />
      </Container>

      <AddEntryFab onClick={() => setShowAddModal(true)} />
      
      <AddEntryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddCommand}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportCommands}
      />
    </Box>
  )
}

export default App 