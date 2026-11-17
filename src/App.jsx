import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChannelHeader from './components/ChannelHeader.jsx'
import ChatMessage from './components/ChatMessage.jsx'
import ChatInput from './components/ChatInput.jsx'
import usePersistentState from './usePersistentState.js'
import { DEFAULT_CHANNELS, DEFAULT_MESSAGES, DEFAULT_PROFILE, user_list } from './constants.js'
import './App.css'

const randomUser = () => user_list[Math.floor(Math.random() * user_list.length)]

function App() {
  const [profile, setProfile] = usePersistentState('chat.profile', DEFAULT_PROFILE)
  const [channels, setChannels] = usePersistentState('chat.channels', DEFAULT_CHANNELS)
  const [messages, setMessages] = usePersistentState('chat.messages', DEFAULT_MESSAGES)
  const [activeId, setActiveId] = usePersistentState('chat.activeChannel', DEFAULT_CHANNELS[0].id)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const threadEndRef = useRef(null)

  const activeChannel = channels.find((c) => c.id === activeId) ?? channels[0]
  const channelMessages = messages[activeChannel.id] ?? []

  // jump straight to the bottom on channel switch, smooth scroll for new messages
  const lastChannel = useRef(activeChannel.id)
  useEffect(() => {
    const switched = lastChannel.current !== activeChannel.id
    lastChannel.current = activeChannel.id
    threadEndRef.current?.scrollIntoView({ behavior: switched ? 'auto' : 'smooth' })
  }, [activeChannel.id, channelMessages.length])

  const updateChannelMessages = (channelId, update) => {
    setMessages((prev) => ({ ...prev, [channelId]: update(prev[channelId] ?? []) }))
  }

  const sendMessage = (text) => {
    updateChannelMessages(activeChannel.id, (list) => [
      ...list,
      { id: crypto.randomUUID(), user: randomUser(), text, timestamp: Date.now(), likes: 0 },
    ])
  }

  const likeMessage = (id) => {
    updateChannelMessages(activeChannel.id, (list) =>
      list.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m)),
    )
  }

  const selectChannel = (id) => {
    setActiveId(id)
    setSidebarOpen(false)
  }

  const createChannel = ({ name, description }) => {
    const id = `${name}-${Date.now().toString(36)}`
    setChannels((prev) => [...prev, { id, name, description }])
    selectChannel(id)
  }

  return (
    <div className="layout">
      <Sidebar
        open={sidebarOpen}
        profile={profile}
        onProfileChange={setProfile}
        channels={channels}
        messages={messages}
        activeId={activeChannel.id}
        onSelect={selectChannel}
        onCreate={createChannel}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="chat">
        <ChannelHeader
          channel={activeChannel}
          profile={profile}
          messageCount={channelMessages.length}
          onMenu={() => setSidebarOpen(true)}
        />

        <section className="chat__thread" aria-live="polite">
          {channelMessages.length === 0 && (
            <p className="chat__empty">
              This is the start of #{activeChannel.name}. Say hello! 👋
            </p>
          )}
          {channelMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onLike={() => likeMessage(message.id)}
            />
          ))}
          <div ref={threadEndRef} />
        </section>

        <ChatInput key={activeChannel.id} onSend={sendMessage} />
      </div>
    </div>
  )
}

export default App
