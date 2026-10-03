const Note = ({ note, toggleImportance, deleteNoteHandler }) => {

    const { content, important, id } = note

    const label = important ? 'make not important' : 'make important'

    return (
        <li className="note" >
            {content}
            <button onClick={toggleImportance}>{label}</button>
            <button onClick={() => deleteNoteHandler(id)}>Delete</button>
        </li>
    )
};
export default Note;