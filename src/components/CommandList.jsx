import { useState } from 'react'
import {
  VStack,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Button,
  Code,
  HStack,
  Tag,
  useToast,
  Box,
} from '@chakra-ui/react'
import { CopyIcon, CheckIcon } from '@chakra-ui/icons'

function CommandList({ commands }) {
  const [copiedId, setCopiedId] = useState(null)
  const toast = useToast()

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
      toast({
        description: 'Copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      })
    } catch (err) {
      console.error('Failed to copy text:', err)
      toast({
        description: 'Failed to copy text',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      })
    }
  }

  if (commands.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text fontSize="lg" color="gray.500">
          No commands found
        </Text>
      </Box>
    )
  }

  return (
    <VStack spacing={4} align="stretch">
      {commands.map(cmd => (
        <Card key={cmd.id} variant="outline">
          <CardHeader pb={0}>
            <HStack justify="space-between" align="center">
              <Heading size="sm" color="brand.primary">
                {cmd.category || 'Uncategorized'}
              </Heading>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={copiedId === cmd.id ? <CheckIcon /> : <CopyIcon />}
                onClick={() => handleCopy(cmd.command, cmd.id)}
              >
                {copiedId === cmd.id ? 'Copied!' : 'Copy'}
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <Code
              w="full"
              p={3}
              borderRadius="md"
              bg="hover-color"
              display="block"
              whiteSpace="pre-wrap"
              mb={3}
            >
              {cmd.isSensitive ? '••••••••' : cmd.command}
            </Code>
            <Text mb={3}>{cmd.description}</Text>
            {cmd.tags && cmd.tags.length > 0 && (
              <HStack spacing={2} wrap="wrap">
                {cmd.tags.map((tag, index) => (
                  <Tag
                    key={index}
                    size="sm"
                    variant="subtle"
                    colorScheme="blue"
                  >
                    {tag}
                  </Tag>
                ))}
              </HStack>
            )}
          </CardBody>
        </Card>
      ))}
    </VStack>
  )
}

export default CommandList 