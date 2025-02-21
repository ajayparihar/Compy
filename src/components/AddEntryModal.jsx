import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  VStack,
} from '@chakra-ui/react'

function AddEntryModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    command: '',
    description: '',
    category: '',
    tags: '',
    isSensitive: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add New Entry</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel htmlFor="command">Command/Text</FormLabel>
                <Input
                  id="command"
                  name="command"
                  value={formData.command}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  resize="vertical"
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="category">Category</FormLabel>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="tags">Tags (comma separated)</FormLabel>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="git, docker, etc"
                />
              </FormControl>

              <FormControl>
                <Checkbox
                  id="isSensitive"
                  name="isSensitive"
                  isChecked={formData.isSensitive}
                  onChange={handleChange}
                >
                  Mask as sensitive data
                </Checkbox>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default AddEntryModal 