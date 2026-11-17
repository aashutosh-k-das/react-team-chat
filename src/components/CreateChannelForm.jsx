import { useState } from 'react'

// "My New Channel!" -> "my-new-channel"
const toChannelName = (raw) =>
  raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 30)

function CreateChannelForm({ existingNames, onCreate, onCancel }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [touched, setTouched] = useState(false)

  const normalized = toChannelName(name)
  const error = !normalized
    ? 'Enter a channel name'
    : existingNames.includes(normalized)
      ? `#${normalized} already exists`
      : null

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (error) return
    onCreate({ name: normalized, description: description.trim() })
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onCancel()
  }

  return (
    <form className="create-channel" onSubmit={submit} noValidate>
      <label className="create-channel__label" htmlFor="channel-name">
        Channel name
      </label>
      <div className="create-channel__name">
        <span aria-hidden="true">#</span>
        <input
          id="channel-name"
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="e.g. design-team"
          maxLength={40}
          autoFocus
          aria-invalid={touched && !!error}
        />
      </div>
      {touched && error && <p className="create-channel__error">{error}</p>}
      <input
        className="field"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Description (optional)"
        aria-label="Channel description"
        maxLength={80}
      />
      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          Create
        </button>
      </div>
    </form>
  )
}

export default CreateChannelForm
