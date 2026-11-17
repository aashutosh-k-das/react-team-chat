import Avatar from './Avatar.jsx'

function MentionList({ users, activeIndex, onSelect, onHover }) {
  return (
    <ul className="popover mention-list" role="listbox" aria-label="Mention a user">
      {users.map((user, i) => (
        <li
          key={user}
          role="option"
          aria-selected={i === activeIndex}
          className={`mention-list__item${i === activeIndex ? ' is-active' : ''}`}
          // mousedown instead of click, otherwise the input loses focus first
          onMouseDown={(e) => {
            e.preventDefault()
            onSelect(user)
          }}
          onMouseEnter={() => onHover(i)}
        >
          <Avatar name={user} size={28} />
          {user}
        </li>
      ))}
    </ul>
  )
}

export default MentionList
