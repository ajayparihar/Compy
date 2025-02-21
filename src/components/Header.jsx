import { useState } from 'react'

function Header({ searchQuery, onSearchChange, onImportClick, theme, onThemeChange }) {
  const [showClearSearch, setShowClearSearch] = useState(false)

  const handleSearchChange = (e) => {
    const value = e.target.value
    onSearchChange(value)
    setShowClearSearch(!!value)
  }

  const handleClearSearch = () => {
    onSearchChange('')
    setShowClearSearch(false)
  }

  return (
    <div className="header-section">
      <header>
        <h1 id="pageTitle">COMPY</h1>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Type to search..."
            aria-label="Search commands"
          />
          {showClearSearch && (
            <div
              className="clear-icon"
              onClick={handleClearSearch}
              aria-label="Clear search"
              role="button"
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </div>
          )}
        </div>
        <div className="header-controls">
          <button className="import-btn" onClick={onImportClick} aria-label="Import CSV">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
              <path d="M480-320 280-520l56-56 104 104v-288h80v288l104-104 56 56-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
            </svg>
            Import
          </button>
          <div className="theme-selector">
            <select
              value={theme}
              onChange={(e) => onThemeChange(e.target.value)}
              aria-label="Select theme"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header 