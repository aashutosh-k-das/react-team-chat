import { useState } from 'react'
import ProfileCard from './ProfileCard.jsx'
import CreateChannelForm from './CreateChannelForm.jsx'

function lastMessagePreview(messages) {
  const last = messages?.[messages.length - 1]
  if (!last) return 'No messages yet'
  return `${last.user}: ${last.text}`
}

function Sidebar({
  open,
  profile,
  onProfileChange,
  channels,
  messages,
  activeId,
  onSelect,
  onCreate,
  onClose,
}) {
  const [creating, setCreating] = useState(false)

  const handleCreate = (channel) => {
    onCreate(channel)
    setCreating(false)
  }

  return (
    <>
      <aside className={`sidebar${open ? ' is-open' : ''}`} aria-label="Conversations">
        <ProfileCard profile={profile} onChange={onProfileChange} />

        <div className="sidebar__heading">
          <h2>Conversations</h2>
          <button
            type="button"
            className="icon-btn icon-btn--round"
            onClick={() => setCreating((c) => !c)}
            aria-label="Create channel"
            aria-expanded={creating}
            title="Create channel"
          >
            {creating ? '×' : '+'}
          </button>
        </div>

        {creating && (
          <CreateChannelForm
            existingNames={channels.map((c) => c.name)}
            onCreate={handleCreate}
            onCancel={() => setCreating(false)}
          />
        )}

        <ul className="channel-list">
          {channels.map((channel) => {
            const count = messages[channel.id]?.length ?? 0
            return (
              <li key={channel.id}>
                <button
                  type="button"
                  className={`channel${channel.id === activeId ? ' is-active' : ''}`}
                  onClick={() => onSelect(channel.id)}
                  aria-current={channel.id === activeId ? 'page' : undefined}
                >
                  <span className="channel__hash" aria-hidden="true">
                    #
                  </span>
                  <span className="channel__text">
                    <span className="channel__name">{channel.name}</span>
                    <span className="channel__preview">
                      {lastMessagePreview(messages[channel.id])}
                    </span>
                  </span>
                  {count > 0 && <span className="channel__count">{count}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </aside>
      {open && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
    </>
  )
}

export default Sidebar
