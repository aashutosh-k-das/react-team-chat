import { useState } from 'react'
import Avatar from './Avatar.jsx'

function ProfileCard({ profile, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)

  const startEditing = () => {
    setDraft(profile)
    setEditing(true)
  }

  const save = (e) => {
    e.preventDefault()
    const name = draft.name.trim()
    if (!name) return
    onChange({ name, title: draft.title.trim() })
    setEditing(false)
  }

  if (editing) {
    return (
      <form className="profile profile--editing" onSubmit={save}>
        <Avatar name={draft.name || '?'} size={56} online />
        <div className="profile__fields">
          <input
            className="field"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
            placeholder="Your name"
            aria-label="Your name"
            maxLength={30}
            autoFocus
          />
          <input
            className="field"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
            placeholder="Your role"
            aria-label="Your role"
            maxLength={40}
          />
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={!draft.name.trim()}>
              Save
            </button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <div className="profile">
      <Avatar name={profile.name} size={56} online />
      <div className="profile__text">
        <div className="profile__name">{profile.name}</div>
        <div className="profile__title">{profile.title}</div>
      </div>
      <button
        type="button"
        className="icon-btn"
        onClick={startEditing}
        aria-label="Edit profile"
        title="Edit profile"
      >
        ✎
      </button>
    </div>
  )
}

export default ProfileCard
