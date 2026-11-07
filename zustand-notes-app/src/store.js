import { create } from 'zustand'
import noteServices from './services/notes'

const useNoteStore = create((set, get) => ({
    notes: [],
    filter: 'all',
    actions: {
        add: async (content) => {
            const newNote = await noteServices.createNew(content)
            set(state => ({ notes: [...state.notes, newNote] }))
        },
        toggleImportance: async (id) => {
            const note = get().notes.find(n => n.id === id)
            const updatedNote = await noteServices.update(id, { ...note, important: !note.important })
            set(state => ({ notes: state.notes.map(n => n.id === id ? updatedNote : n) }))
        },
        setFilter: value => set(() => ({ filter: value })),
        initalize: async () => {
            const notes = await noteServices.getAll()
            set(() => ({ notes }))
        }

    }
}))


export const useNotes = () => useNoteStore(state => state.notes)
export const useFilter = () => useNoteStore(state => state.filter)
export const useNoteActions = () => useNoteStore(state => state.actions)

export const useFilteredNotes = () => {
    const notes = useNotes()
    const filter = useFilter()
    if (filter === 'important') return notes.filter(note => note.important)
    if (filter === 'nonimportant') return notes.filter(note => !note.important)
    return notes
}