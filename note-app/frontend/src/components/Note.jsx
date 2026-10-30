import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material'

const Note = ({ note, activeUser, toggleImportance, deleteNoteHandler }) => {

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
    <Box sx={{ maxWidth: 500, margin: '40px auto' }}>

      <Card elevation={3} sx={{ padding: 2 }}>

        <CardContent>

          {/* Top Row: Note Content & Importance Badge */}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: '500' }}>
              {content}
            </Typography>
            <Chip
              label={important ? 'Important' : 'Normal'}
              color={important ? 'warning' : 'default'}
              size="small"
            />
          </Box>
          {/* Author info */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Added by <strong>{note?.user?.name || note?.user?.username || 'anonymous'}</strong>
          </Typography>
          {/* Action Buttons (Only visible to note creator) */}
          {note?.user?.username === activeUser?.username && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => toggleImportance(id)}
              >
                {label}
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={handleDelete}
              >
                delete
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )

}
export default Note