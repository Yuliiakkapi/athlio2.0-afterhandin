# Athlio React SPA Starter

This is a complete, copy-ready React app starter. Copy everything in this folder into a fresh project and you're ready to go.

## What's included

- **React 19 + React Router v7** — Full routing setup
- **Vite build tool** — Fast dev and build
- **Pre-made components** — Navbar, Topbar, AppShell layout
- **Context API** — UserProvider for auth state
- **Hooks** — useAuthGuard, useProfile helpers
- **Utilities** — API client, validation helpers
- **10 page routes** — Ready to fill in with your logic
- **CSS styling** — Basic styles included

## Quick start

### 1. Copy this folder to your new project

```bash
cp -r react-spa-starter my-new-app
cd my-new-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

Your app will open at `http://localhost:5173`

## File structure

```
src/
├── main.jsx              # Entry point, sets up React Router
├── App.jsx               # Routes definition
├── components/           # Reusable UI components
│   ├── Navbar.jsx
│   └── Topbar.jsx
├── layouts/              # Layout wrappers
│   └── AppShell.jsx      # Main layout with navbar/topbar
├── pages.jsx             # All page components (Landing, Home, Profile, etc.)
├── context/
│   └── UserContext.jsx   # Auth & user state
├── hooks/                # Custom React hooks
│   ├── useAuthGuard.js
│   └── useProfile.js
├── lib/
│   └── api.js            # Axios API client
├── utils/
│   └── validate.js       # Validation helpers
└── styles.css            # Global styles
```

## How to use each part

### Pages

All page components are in `src/pages.jsx`. Each export is mapped to a route in `src/App.jsx`. Just edit the pages to add your real content.

Example:

```jsx
// In src/App.jsx, routes are already set up:
<Route path="home" element={<Home />} />
<Route path="profile/me" element={<ProfileMe />} />
```

### Context & Auth

Wrap your app with `UserProvider` to access user state everywhere:

```jsx
import { useUser } from "./context/UserContext";

function MyComponent() {
  const { user, profile, loading } = useUser();
  return <div>{user?.email}</div>;
}
```

### Navigation

Use React Router's `Link` and `useNavigate`:

```jsx
import { Link, useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();

  return (
    <>
      <Link to="/home">Go home</Link>
      <button onClick={() => navigate("/profile/me")}>My Profile</button>
    </>
  );
}
```

### API Calls

Use the pre-configured axios client:

```jsx
import api from "./lib/api";

// GET request
const response = await api.get("/users/me");

// POST request
await api.post("/posts", { title: "New post" });

// DELETE request
await api.delete(`/posts/${id}`);
```

## Routes

These routes are already set up in `src/App.jsx`:

- `/` — Landing page (shown first)
- `/intro` — Intro/onboarding
- `/auth` — Login/signup
- `/setup-profile` — Profile setup during onboarding
- `/auth/callback` — OAuth redirect handler
- `/home` — Main feed
- `/profile/me` — User's own profile
- `/profile/me/edit` — Edit profile
- `/profile/me/following` — People the user follows
- `/profile/:id` — Other user's profile
- `/notifications` — Notifications list
- `/post/:id` — Single post view
- `/add-post` — Create new post
- `/chat` — Messages
- `/scouting` — Scouting/search

## Adding your own components

1. Create files in `src/components/`:

```bash
src/components/Button.jsx
src/components/Card.jsx
```

2. Import and use them anywhere:

```jsx
import Button from "./components/Button";
```

## Environment variables

Create `.env` in the root:

```
VITE_API_URL=http://localhost:3000
VITE_AUTH_TOKEN=your_auth_token
```

Access in your code:

```jsx
const apiUrl = import.meta.env.VITE_API_URL;
```

## Build for production

```bash
npm run build
```

Output goes to `dist/` folder.

## What to do next

1. Update `src/pages.jsx` with your real page content
2. Update `src/context/UserContext.jsx` with real auth logic
3. Copy your existing components from the old project into `src/components/`
4. Add your real API calls using the `api` client
5. Update styles in `src/styles.css`
6. Add more hooks to `src/hooks/` as needed

## Tips

- **Navbar/Topbar visibility** — Automatically hidden on `/auth`, `/intro`, and `/setup-profile` routes. Change this in `src/layouts/AppShell.jsx`
- **Active links** — Navbar links automatically highlight based on current route
- **Type safety** — This starter uses `.jsx` files (no TypeScript). If you want TypeScript, rename files to `.tsx` and add type annotations

## Troubleshooting

**"Module not found" errors?**

- Run `npm install` to install dependencies
- Check your import paths

**Port 5173 already in use?**

- Kill the process: `lsof -ti :5173 | xargs kill -9`
- Or use a different port: `npm run dev -- --port 3000`

**Need TypeScript?**

- Rename `.jsx` files to `.tsx`
- Add `// @ts-check` at the top of files
- Or run: `npm install -D typescript @types/react @types/react-dom`
