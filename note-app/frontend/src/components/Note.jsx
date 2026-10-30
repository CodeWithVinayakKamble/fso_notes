import { useNavigate } from 'react-router-dom'

const Note = ({ note, activeUser, toggleImportance, deleteNoteHandler }) => {

  const navigate = useNavigate()

  if (!note) {
    return <div>Note not found</div>
  }

  const { content, important, id } = note

  const label = important ? 'make not important' : 'make important'

  const handleDelete = () => {
    const confirmation = window.confirm('Delete Note ?')
    if (confirmation) {
      deleteNoteHandler(id)

    }
  }

  return (
    <div className='noteContent'>

      <p>{content}</p>

      {note?.user?.username === activeUser?.username && (
        <>
          <button onClick={() => toggleImportance(id)}>{label}</button>
          <button onClick={handleDelete}>delete</button>
        </>
      )}

    </div>
  )
}
export default Note