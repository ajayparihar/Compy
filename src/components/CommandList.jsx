import { useState } from 'react'

function CommandList({ commands }) {
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  if (commands.length === 0) {
    return (
      <div className="no-results">
        <p>No commands found</p>
      </div>
    )
  }

  return (
    <div className="command-list" role="region" aria-label="Command list">
      {commands.map(cmd => (
        <div key={cmd.id} className="command-item">
          <div className="command-header">
            <h3>{cmd.category || 'Uncategorized'}</h3>
            <button
              className="copy-button"
              onClick={() => handleCopy(cmd.command, cmd.id)}
              aria-label="Copy command"
            >
              {copiedId === cmd.id ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="command-content">
            <pre className="command-text">
              {cmd.isSensitive ? '••••••••' : cmd.command}
            </pre>
            <p className="command-description">{cmd.description}</p>
            {cmd.tags && cmd.tags.length > 0 && (
              <div className="command-tags">
                {cmd.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommandList 