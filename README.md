# Mailflow

A Superhuman-style Gmail + Google Calendar client built with **Next.js**, **Tailwind CSS**, and powered by **Corsair MCP + Claude API**.

---

## Project Structure

```
mailflow/
├── app/
│   ├── layout.jsx            ← Root layout (fonts, global css)
│   ├── page.jsx              ← Landing page (/)
│   ├── callback/
│   │   └── page.jsx          ← Corsair OAuth redirect handler
│   ├── inbox/
│   │   └── page.jsx          ← Inbox + email thread view
│   ├── calendar/
│   │   └── page.jsx          ← Week calendar view
│   └── agent/
│       └── page.jsx          ← AI agent chat (Claude API)
├── components/
│   └── layout/
│       ├── Sidebar.jsx       ← Left nav sidebar
│       └── AppShell.jsx      ← Wrapper for app pages
├── lib/
│   ├── config.js             ← Corsair config + constants
│   └── mockData.js           ← Mock emails, events, agent caps
├── styles/
│   └── globals.css           ← Tailwind + global styles
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
├── .env.local                ← Your secrets (not committed)
└── package.json
```

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Corsair App ID
Edit `.env.local`:
```
NEXT_PUBLIC_CORSAIR_APP_ID=your_actual_app_id_here
```

### 3. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Page |
|-------|------|
| `/` | Landing page with Google login |
| `/inbox` | Email inbox + thread view |
| `/calendar` | Week calendar with events |
| `/agent` | AI assistant chat (Claude API) |
| `/callback` | Corsair OAuth redirect handler |

---

## Auth Flow

1. User clicks **Continue with Google** on landing page
2. Redirected to `https://auth.corsair.dev/login?app_id=...`
3. Google asks for Gmail + Calendar permission (one screen)
4. Corsair redirects back to `/callback?user_id=abc123`
5. `user_id` saved to localStorage → user goes to `/inbox`

---

## AI Agent

The agent page calls the **Claude API** directly with a system prompt that instructs it to act as an email/calendar assistant via Corsair MCP.

To wire up real Corsair MCP tools, add them to the `tools` array in `app/agent/page.jsx`:

```js
tools: corsairMcpTools, // from Corsair MCP manifest
```

---

## Connect Real Data

Replace mock data in `lib/mockData.js` with live Corsair API calls:

```js
// Fetch emails
const res = await fetch(`${config.corsair.apiBase}/gmail/messages`, {
  headers: { 'x-user-id': localStorage.getItem('user_id') }
})

// Fetch calendar events
const res = await fetch(`${config.corsair.apiBase}/calendar/events`, {
  headers: { 'x-user-id': localStorage.getItem('user_id') }
})
```

---

## Keyboard Shortcuts (coming next)

| Key | Action |
|-----|--------|
| `J` / `K` | Navigate emails |
| `C` | Compose |
| `R` | Reply |
| `E` | Archive |
| `G I` | Go to inbox |
| `G C` | Go to calendar |
