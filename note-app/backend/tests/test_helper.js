const Note = require('../models/note')
const User = require('../models/user')


const initialNotes = [
    {
        content: 'HTML is easy',
        important: false,
    },
    {
        content: 'Browser can execute only JavaScript',
        important: true,
    },
]



// 1. Create a dummy note: new Note({ content: 'willremovethissoon' })

// 2. Save it to MongoDB: await note.save()
//     (MongoDB generates a real, valid 24 - character _id for it!)

// 3. Delete it immediately: await note.deleteOne()
//         (Now the note is GONE from the database!)

// 4. Return that ID: return note._id.toString()

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon' })
    await note.save()
    await note.deleteOne()

    return note._id.toString()
}


const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialNotes,
    nonExistingId,
    notesInDb,
    usersInDb
}
