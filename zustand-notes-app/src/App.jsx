// ==== Components ==== //
import NoteForm from "./components/NoteForm"
import NoteList from "./components/NoteList"
import VisibilityFilter from "./components/VisibilityFilter"

// ==== React Dependencies ==== //
import { useEffect } from "react"

// ==== stateDependencies ==== //
import { useNoteActions } from "./store"

const App = () => {
  const { initalize } = useNoteActions()

  useEffect(() => {
    initalize()
  }, [initalize])

  return (
    <div>

      <NoteForm />
      <VisibilityFilter />
      <NoteList />

    </div>
  )
}

export default App