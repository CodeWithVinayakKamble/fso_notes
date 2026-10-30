// ==== dependecies ==== //
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const NoteList = ({ notes }) => {

    return (
        <div>
            <h2 className='title'>Notes</h2>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>content</TableCell>
                            <TableCell>user</TableCell>
                            <TableCell>important</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notes.map(note => (
                            <TableRow key={note.id}>
                                <TableCell>
                                    <Link to={`/notes/${note.id}`} >
                                        {note.content}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {note?.user?.username}
                                </TableCell>
                                <TableCell>
                                    {note.important ? 'yes' : 'no'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
}

export default NoteList