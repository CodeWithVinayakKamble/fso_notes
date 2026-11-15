# Managing data on the server with the TanStack Query library

---

## initial setup of query stack into **main.jsx**
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient} >
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
```
---

## Synchronizing data to the server using TanStack Query

* "Mutation" (Sounds like biology / X-Men 🧬) ➡️ It just means writing data (POST/PUT/DELETE).
* "Query" (Sounds like a database exam 📜) ➡️ It just means reading data (GET).
* "Invalidation" (Sounds like a rejected passport 🚫) ➡️ It just means "data is expired, fetch fresh copy".
* "QueryClient" (Sounds like a mainframe computer 🖥️) ➡️ It is just the cache storage box in memory.

--

## tanstack vs zustand

* TanStack Query is a server-state library, responsible for managing asynchronous operations between your server and client

  - **TanStack Query is a library that maintains the server state in the frontend**, i.e. acts as a cache for what is stored on the server. TanStack Query simplifies the processing of data on the server, and can in some cases eliminate the need for data on the server to be saved in the frontend state.

* Zustand, etc. are client-state libraries that can be used to store asynchronous data, albeit inefficiently when compared to a tool like TanStack Query