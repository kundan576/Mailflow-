export const EMAILS = [
  {
    id: '1',
    sender: 'Sarah Chen',
    email: 'sarah@acme.io',
    subject: 'Q3 roadmap review — need your input',
    preview: 'Hey, wanted to get your thoughts...',
    body: `Hey,\n\nWanted to get your thoughts before the all-hands on Thursday. The Q3 roadmap is mostly locked but there are two open items that need a decision: the API rate limiting strategy and the mobile push timeline.\n\nCan you review the doc and leave comments by EOD tomorrow?`,
    time: '9:14 AM',
    priority: 'high',
    unread: true,
    initials: 'SC',
  },
  {
    id: '2',
    sender: 'Dev · Corsair',
    email: 'dev@corsair.dev',
    subject: 'Your MCP integration is live',
    preview: 'Gmail + Calendar endpoints active',
    body: `Great news!\n\nYour Mailflow MCP integration is now live. Both Gmail and Google Calendar endpoints are active and ready to use.\n\nYou can now send emails, create calendar invites, and search your inbox using natural language.`,
    time: '8:02 AM',
    priority: 'med',
    unread: true,
    initials: 'DC',
  },
  {
    id: '3',
    sender: 'Priya Nair',
    email: 'priya@ventures.com',
    subject: 'Series A term sheet received',
    preview: 'Valuation at $18M pre-money...',
    body: `Hi,\n\nWe received the term sheet this morning. Valuation at $18M pre-money with a $3M raise. Pro-rata rights included.\n\nCan we jump on a call this afternoon to go through it?`,
    time: 'Yesterday',
    priority: 'high',
    unread: false,
    initials: 'PN',
  },
  {
    id: '4',
    sender: 'Marcus Webb',
    email: 'marcus@design.co',
    subject: 'Re: Design sync tomorrow',
    preview: "Works for me. I'll bring Figma...",
    body: `Works for me. I'll bring the Figma file and we can go through the new components.\n\nSee you at 2pm.`,
    time: 'Yesterday',
    priority: 'low',
    unread: false,
    initials: 'MW',
  },
  {
    id: '5',
    sender: 'GitHub',
    email: 'noreply@github.com',
    subject: '[corsair-mcp] PR #47 merged',
    preview: 'feat: add webhook support for...',
    body: `Pull request #47 has been merged into main.\n\nfeat: add webhook support for real-time email notifications\n\nView the changes on GitHub.`,
    time: 'Mon',
    priority: 'low',
    unread: false,
    initials: 'GH',
  },
]

export const EVENTS = [
  { id: '1', title: '1:1 Sarah',      day: 2, hour: 9,  color: 'accent' },
  { id: '2', title: 'Corsair demo',   day: 3, hour: 11, color: 'accent' },
  { id: '3', title: 'Design sync',    day: 1, hour: 14, color: 'accent' },
  { id: '4', title: 'Series A review',day: 4, hour: 14, color: 'accent' },
]

export const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
export const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17]

export const AGENT_CAPABILITIES = [
  'Send emails via Gmail API',
  'Create calendar invites',
  'Search your inbox',
  'Draft replies',
  'Reschedule meetings',
]
