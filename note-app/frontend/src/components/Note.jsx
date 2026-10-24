const Note = ({ note, toggleImportance, deleteNoteHandler, activeUser }) => {

  const { content, important, id } = note

  const label = important ? 'make not important' : 'make important'

  return (
    <li className="note" >
      {content} by ~ {note?.user?.username}
      {note?.user?.username === activeUser?.username && (
        <>
          <button onClick={toggleImportance}>{label}</button>
          <button onClick={() => deleteNoteHandler(id)}>delete</button>
        </>
      )}
    </li>
  )
}
export default Note