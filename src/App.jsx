import { useState, useEffect } from 'react'
import Header from './components/Header'
import CommandList from './components/CommandList'
import AddEntryModal from './components/AddEntryModal'
import ImportModal from './components/ImportModal'
import Toast from './components/Toast'
import AddEntryFab from './components/AddEntryFab'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'

function App() {
  const [commands, setCommands] = useLocalStorage('commands', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const { theme, setTheme } = useTheme()

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
    setToastMessage('Command added successfully')
  }

  const handleImportCommands = (importedCommands) => {
    setCommands([...commands, ...importedCommands])
    setShowImportModal(false)
    setToastMessage('Commands imported successfully')
  }

  return (
    <>
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onImportClick={() => setShowImportModal(true)}
        theme={theme}
        onThemeChange={setTheme}
      />

      <main>
        <CommandList commands={filteredCommands} />
      </main>

      <AddEntryFab onClick={() => setShowAddModal(true)} />
      
      {showAddModal && (
        <AddEntryModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddCommand}
        />
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImportCommands}
        />
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </>
  )
}

export default App 