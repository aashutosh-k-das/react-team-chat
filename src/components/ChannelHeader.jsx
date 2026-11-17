import Avatar from './Avatar.jsx'
import { user_list } from '../constants.js'

function ChannelHeader({ channel, profile, messageCount, onMenu }) {
  const members = [profile.name, ...user_list]

  return (
    <header className="chat__header">
      <button
        type="button"
        className="icon-btn chat__menu"
        onClick={onMenu}
        aria-label="Open conversations"
      >
        ☰
      </button>
      <div className="chat__heading">
        <h1 className="chat__title"># {channel.name}</h1>
        <p className="chat__subtitle">{channel.description || 'No description'}</p>
      </div>
      <div className="chat__info">
        <div className="avatar-stack" aria-label={`Members: ${members.join(', ')}`}>
          {members.map((name) => (
            <Avatar key={name} name={name} size={30} />
          ))}
        </div>
        <span className="chat__members">
          {members.length} members · {messageCount} messages
        </span>
      </div>
    </header>
  )
}

export default ChannelHeader
