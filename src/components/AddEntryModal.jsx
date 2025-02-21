import { useState } from 'react'

function AddEntryModal({ onClose, onSave }) {
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
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Entry</h2>
          <button className="close-modal" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>
        <form id="addEntryForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="command">Command/Text*</label>
            <input
              type="text"
              id="command"
              name="command"
              value={formData.command}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="git, docker, etc"
            />
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="isSensitive"
              name="isSensitive"
              checked={formData.isSensitive}
              onChange={handleChange}
            />
            <label htmlFor="isSensitive">Mask as sensitive data</label>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary">Save</button>
            <button type="button" className="secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEntryModal 