import { create } from 'zustand'
import noteServices from './services/notes'
import { devtools } from 'zustand/middleware'

const useNoteStore = create(devtools((set, get) => ({
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
        initialize: async () => {
            const notes = await noteServices.getAll()
            set(() => ({ notes }))
        }

    }
})))


export const useNoteActions = () => useNoteStore(state => state.actions)
export const useFilter = () => useNoteStore(state => state.filter)
export const useNotes = () => {
    const notes = useNoteStore(state => state.notes)
    const filter = useFilter()
    if (filter === 'important') return notes.filter(note => note.important)
    if (filter === 'nonimportant') return notes.filter(note => !note.important)
    return notes
}


export default useNoteStore