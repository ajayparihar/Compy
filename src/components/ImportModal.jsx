import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'

function ImportModal({ onClose, onImport }) {
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.remove('drag-over')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.remove('drag-over')
    
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
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Import CSV</h2>
          <button className="close-modal" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>
        <div className="import-area">
          {!preview ? (
            <div
              ref={dropZoneRef}
              className="drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="currentColor">
                <path d="M480-320 280-520l56-56 104 104v-288h80v288l104-104 56 56-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
              </svg>
              <p>Drag & drop your CSV file here<br/>or</p>
              <button
                type="button"
                className="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                hidden
              />
            </div>
          ) : (
            <div className="preview-area">
              <h3>Preview</h3>
              <div className="preview-content">
                <table>
                  <thead>
                    <tr>
                      <th>Command</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((item, index) => (
                      <tr key={index}>
                        <td>{item.command}</td>
                        <td>{item.description}</td>
                        <td>{item.category}</td>
                        <td>{item.tags.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length > 5 && (
                  <p>...and {preview.length - 5} more items</p>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="primary" onClick={handleImport}>
                  Import
                </button>
                <button type="button" className="secondary" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImportModal 