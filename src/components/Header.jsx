import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { CloseIcon, ChevronDownIcon, SunIcon, MoonIcon, SettingsIcon } from '@chakra-ui/icons'
import { FiUpload } from 'react-icons/fi'

function Header({ searchQuery, onSearchChange, onImportClick }) {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={100}
      bg="chakra-body-bg"
      borderBottom="1px"
      borderColor="chakra-border-color"
      boxShadow="sm"
      py={4}
    >
      <Container maxW="container.xl">
        <Flex align="center" gap={4}>
          <Heading
            as="h1"
            size="lg"
            color="brand.primary"
            flexShrink={0}
          >
            COMPY
          </Heading>

          <InputGroup maxW="600px" flex={1}>
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Type to search..."
              variant="filled"
            />
            {searchQuery && (
              <InputRightElement>
                <IconButton
                  icon={<CloseIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                />
              </InputRightElement>
            )}
          </InputGroup>

          <Flex gap={4} align="center" ml="auto">
            <Button
              leftIcon={<FiUpload />}
              variant="primary"
              onClick={onImportClick}
            >
              Import
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={<ChevronDownIcon />}
              >
                Theme
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<SunIcon />}
                  onClick={() => {
                    if (colorMode !== 'light') toggleColorMode()
                  }}
                >
                  Light
                </MenuItem>
                <MenuItem
                  icon={<MoonIcon />}
                  onClick={() => {
                    if (colorMode !== 'dark') toggleColorMode()
                  }}
                >
                  Dark
                </MenuItem>
                <MenuItem
                  icon={<SettingsIcon />}
                  onClick={() => {
                    // Toggle to match system
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                    if (prefersDark && colorMode !== 'dark') toggleColorMode()
                    if (!prefersDark && colorMode !== 'light') toggleColorMode()
                  }}
                >
                  System
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}

export default Header 