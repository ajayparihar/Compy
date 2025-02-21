import { useState, useRef } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  VStack,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Center,
  Icon,
} from '@chakra-ui/react'
import { FiUpload } from 'react-icons/fi'
import * as XLSX from 'xlsx'

function ImportModal({ isOpen, onClose, onImport }) {
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.style.setProperty('background-color', hoverBg)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.style.removeProperty('background-color')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.style.removeProperty('background-color')
    
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const processFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet)
        
        const processedData = jsonData.map(row => ({
          command: row.command || row.Command || '',
          description: row.description || row.Description || '',
          category: row.category || row.Category || '',
          tags: (row.tags || row.Tags || '').split(',').map(tag => tag.trim()).filter(Boolean),
          isSensitive: row.isSensitive || row.IsSensitive || false,
          id: Date.now() + Math.random()
        }))

        setPreview(processedData)
      } catch (error) {
        console.error('Error processing file:', error)
        alert('Error processing file. Please check the format.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleImport = () => {
    if (preview) {
      onImport(preview)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import CSV</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          {!preview ? (
            <Box
              ref={dropZoneRef}
              border="2px"
              borderStyle="dashed"
              borderColor={borderColor}
              borderRadius="lg"
              p={8}
              textAlign="center"
              transition="all 0.2s"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <VStack spacing={4}>
                <Icon as={FiUpload} boxSize={12} color="gray.500" />
                <Text>
                  Drag & drop your CSV file here<br/>or
                </Text>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  hidden
                />
              </VStack>
            </Box>
          ) : (
            <VStack align="stretch" spacing={4}>
              <Text fontWeight="bold" fontSize="lg">
                Preview
              </Text>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Command</Th>
                      <Th>Description</Th>
                      <Th>Category</Th>
                      <Th>Tags</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {preview.slice(0, 5).map((item, index) => (
                      <Tr key={index}>
                        <Td>{item.command}</Td>
                        <Td>{item.description}</Td>
                        <Td>{item.category}</Td>
                        <Td>{item.tags.join(', ')}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
              {preview.length > 5 && (
                <Text color="gray.500" fontSize="sm">
                  ...and {preview.length - 5} more items
                </Text>
              )}
            </VStack>
          )}
        </ModalBody>

        <ModalFooter gap={3}>
          {preview && (
            <Button variant="primary" onClick={handleImport}>
              Import
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ImportModal 