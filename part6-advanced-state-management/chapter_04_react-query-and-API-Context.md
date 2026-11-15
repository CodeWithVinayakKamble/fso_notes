# Chapter 4: React Query & the Context API.

## problem till previous versions of zustand

1. The Core Problem: Mixing "Server State" with "Client State"

- In Chapters 1 to 3 (with Zustand or Redux), we dumped everything into one global client store:

    * User notifications (Client State)
    * Search filter string (Client State)
    * Notes / Anecdotes fetched from the backend (Server State)

---

* Why is that annoying?

    - Because backend data does not belong to your browser. It is remote data owned by the server! When you manage server data in Zustand:

---

## 2. The Solution: The "Great Separation"

- Chapter 4 splits state into two distinct categories:
```
┌─────────────────────────────────────────────────────────────┐
│                        Your React App                       │
├───────────────────────────────┬─────────────────────────────┤
│         SERVER STATE          │        CLIENT / UI STATE    │
│  (Data living in the DB)      │    (Data only in browser)   │
│   e.g. Anecdotes, Notes       │   e.g. Notifications, Theme │
│               ▼               │              ▼              │
│       Managed by:             │         Managed by:         │
│  React Query (TanStack Query) │      React Context API      │
└───────────────────────────────┴─────────────────────────────┘
```

---

3. What is React Query (TanStack Query)?

- **Mental Model**: An intelligent, automatic cache manager for your API.

- Instead of storing fetched data in Zustand, you just say: "React Query, go fetch my anecdotes and cache them."

- What it does for you automatically:
    * Automatically caches responses in memory.
    * Gives you isLoading, isError, and data flags instantly (no manual state variables!).
    * Re-fetches in the background when the user tabs back into the browser window.
    * Automatically refetches and updates the UI when you mutate data (invalidateQueries).

---

4. What is the Context API (+ useReducer)?

-** Mental Model**: React's built-in global walkie-talkie.

- **Once React Query takes away 90% of your data-fetching headache**, what client state is actually left?
    * Just small things: like showing a 5-second Notification banner or tracking an active Filter.

- **For small client UI state, installing Redux or Zustand is often overkill! React has its own built-in tool: Context API (often paired with useReducer)**.

- It lets you pass global UI state anywhere in your component tree without props drilling, with zero external npm libraries.

## Complete mental model of React state Management
```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOCAL STATE (Only ONE component cares)                   │
│    👉 Use: useState                                           
│    • Is this dropdown menu open or closed? (isOpen)         │
│    • What is the user typing in this input right now?       │
│    • Is this tab selected?                                  │
├─────────────────────────────────────────────────────────────┤
│ 2. GLOBAL CLIENT STATE (Multiple distant components care)   │
│    👉 Use: Context API or Zustand                          │
│    • Dark Mode / Light Mode theme                           │
│    • Global notification toast banner                       │
│    • Logged-in user's token / language preference           │
├─────────────────────────────────────────────────────────────┤
│ 3. SERVER STATE (Remote database data)                      │
│    👉 Use: TanStack Query                                   │
│    • List of notes, products, anecdotes                     │
│    • User profile fetched from /api/user                    │
└─────────────────────────────────────────────────────────────┘
```