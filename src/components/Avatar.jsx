import { USER_COLORS } from '../constants.js'

const FALLBACK_COLOR = '#e05656'

function initials(name) {
  const parts = name.trim().split(/\s+/)
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2)
  return letters.toUpperCase()
}

function Avatar({ name, size = 40, online = false, className = '' }) {
  return (
    <span
      className={`avatar ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.34),
        background: USER_COLORS[name] ?? FALLBACK_COLOR,
      }}
      title={name}
      aria-hidden="true"
    >
      {initials(name)}
      {online && <span className="avatar__status" />}
    </span>
  )
}

export default Avatar
