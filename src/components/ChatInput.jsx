import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import MentionList from './MentionList.jsx'
import { user_list } from '../constants.js'

// the emoji data is big, so only load it when the picker is first opened
const EmojiPicker = lazy(() => import('./EmojiPicker.jsx'))

// "hello @ca|" -> "ca", or null when the caret isn't inside a mention
function getMentionQuery(text, caret) {
  const match = /(?:^|\s)@(\w*)$/.exec(text.slice(0, caret))
  return match ? match[1] : null
}

function ChatInput({ onSend }) {
  const [text, setText] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const [mentionQuery, setMentionQuery] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const pendingCaret = useRef(null)
  const formRef = useRef(null)

  // close the emoji picker on any click outside the composer
  useEffect(() => {
    if (!showEmojis) return
    const onPointerDown = (e) => {
      if (!formRef.current?.contains(e.target)) setShowEmojis(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [showEmojis])

  const mentionMatches =
    mentionQuery === null
      ? []
      : user_list.filter((u) => u.toLowerCase().startsWith(mentionQuery.toLowerCase()))
  const showMentions = mentionMatches.length > 0

  // put the caret back after inserting an emoji or mention
  useEffect(() => {
    if (pendingCaret.current !== null && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(pendingCaret.current, pendingCaret.current)
      pendingCaret.current = null
    }
  }, [text])

  const updateMentionState = (value, caret) => {
    setMentionQuery(getMentionQuery(value, caret))
    setActiveIndex(0)
  }

  const handleChange = (e) => {
    setText(e.target.value)
    updateMentionState(e.target.value, e.target.selectionStart)
  }

  const insertAtCaret = (insertion, replaceFrom) => {
    const input = inputRef.current
    const caret = input ? input.selectionStart : text.length
    const start = replaceFrom ?? caret
    const next = text.slice(0, start) + insertion + text.slice(caret)
    pendingCaret.current = start + insertion.length
    setText(next)
  }

  const selectMention = (user) => {
    const caret = inputRef.current?.selectionStart ?? text.length
    const atIndex = text.slice(0, caret).lastIndexOf('@')
    insertAtCaret(`@${user} `, atIndex)
    setMentionQuery(null)
  }

  // picker stays open so you can add more than one
  const selectEmoji = (emoji) => insertAtCaret(emoji)

  const submit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
    setMentionQuery(null)
    setShowEmojis(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (showMentions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % mentionMatches.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => (i - 1 + mentionMatches.length) % mentionMatches.length)
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        selectMention(mentionMatches[activeIndex])
      } else if (e.key === 'Escape') {
        setMentionQuery(null)
      }
    } else if (e.key === 'Escape') {
      setShowEmojis(false)
    }
  }

  return (
    <form ref={formRef} className="composer" onSubmit={submit}>
      {showMentions && (
        <MentionList
          users={mentionMatches}
          activeIndex={activeIndex}
          onSelect={selectMention}
          onHover={setActiveIndex}
        />
      )}
      {showEmojis && (
        <Suspense
          fallback={<div className="popover emoji-picker emoji-picker--loading">Loading emojis…</div>}
        >
          <EmojiPicker onSelect={selectEmoji} />
        </Suspense>
      )}

      <div className="composer__box">
        <input
          ref={inputRef}
          className="composer__input"
          type="text"
          placeholder="Type Message"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={(e) => updateMentionState(text, e.target.selectionStart)}
          aria-label="Message"
          autoComplete="off"
          autoFocus
        />
        <button
          type="button"
          className="composer__icon"
          onClick={() => setShowEmojis((s) => !s)}
          aria-label="Insert emoji"
          aria-expanded={showEmojis}
        >
          😊
        </button>
      </div>
      <button type="submit" className="composer__send" disabled={!text.trim()}>
        Send
      </button>
    </form>
  )
}

export default ChatInput
