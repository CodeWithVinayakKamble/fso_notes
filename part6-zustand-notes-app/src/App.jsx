// ==== Components ==== //
import NoteForm from "./components/NoteForm"
import NoteList from "./components/NoteList"
import VisibilityFilter from "./components/VisibilityFilter"

// ==== React Dependencies ==== //
import { useEffect } from "react"

// ==== stateDependencies ==== //
import { useNoteActions } from "./store"

const App = () => {
  const { initialize } = useNoteActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div>

      <NoteForm />
      <VisibilityFilter />
      <NoteList />

    </div>
  )
}

export default App