export const user_list = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin']

export const USER_COLORS = {
  Alan: '#e57373',
  Bob: '#64b5f6',
  Carol: '#81c784',
  Dean: '#ffb74d',
  Elin: '#ba68c8',
}

export const DEFAULT_PROFILE = { name: 'Guest User', title: 'Team Member' }

export const DEFAULT_CHANNELS = [
  { id: 'introductions', name: 'introductions', description: 'This channel is for company-wide chatter' },
  { id: 'general', name: 'general', description: 'Announcements and team-wide updates' },
  { id: 'random', name: 'random', description: 'Off-topic fun and water-cooler talk' },
]

export const DEFAULT_MESSAGES = {
  introductions: [
    {
      id: 'welcome',
      user: 'Team Bot',
      text: 'Welcome to Team Chat. 👋 Send a message to start chatting, type @ to mention someone, or create your own channel from the sidebar.',
      timestamp: Date.now(),
      likes: 0,
    },
  ],
}
