import { user_list } from '../constants.js'
import Avatar from './Avatar.jsx'

const mentionPattern = new RegExp(`(@(?:${user_list.join('|')})\\b)`, 'g')

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

// wrap @mentions in a span so they can be highlighted
function renderText(text) {
  return text.split(mentionPattern).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="mention">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

function ChatMessage({ message, onLike }) {
  const { user, text, timestamp, likes } = message
  const sentAt = new Date(timestamp)

  return (
    <article className="message">
      <Avatar name={user} />
      <div className="message__body">
        <div className="message__meta">
          <span className="message__user">{user}</span>
          <time className="message__time" dateTime={sentAt.toISOString()}>
            {formatTime(sentAt)}
          </time>
        </div>
        <div className="message__row">
          <p className="message__bubble">{renderText(text)}</p>
          <div className="message__likes">
            <button
              type="button"
              className="message__like"
              onClick={onLike}
              aria-label={`Like message from ${user}`}
            >
              👍
            </button>
            <span className="message__count">{likes}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ChatMessage
