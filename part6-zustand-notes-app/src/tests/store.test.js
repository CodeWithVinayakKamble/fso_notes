import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('../services/notes', () => ({
    default: {
        getAll: vi.fn(),
        createNew: vi.fn(),
        update: vi.fn()
    }
}))


import noteServices from '../services/notes'
import useNoteStore, { useNotes, useFilter, useNoteActions } from '../store'

beforeEach(() => {
    useNoteStore.setState({ notes: [], filter: '' })
    vi.clearAllMocks()
})

describe('useNoteActions', () => {

    it('initialize loads notes from service', async () => {
        const mockNotes = [{ id: 1, content: 'test by vitest', important: false }]
        noteServices.getAll.mockResolvedValue(mockNotes)

        const { result } = renderHook(() => useNoteActions())

        await act(async () => {
            await result.current.initialize()
        })

        const { result: notesResult } = renderHook(() => useNotes())
        expect(notesResult.current).toEqual(mockNotes)
    })

    it('add appends a new note', async () => {
        const newNote = { id: 2, content: 'New note', important: true }
        noteServices.createNew.mockResolvedValue(newNote)

        const { result } = renderHook(() => useNoteActions())

        await act(async () => {
            await result.current.add('New note')
        })

        const { result: notesResult } = renderHook(() => useNotes())
        expect(notesResult.current).toContainEqual(newNote)
    })

    it('toggleImportance flips important flag', async () => {

        const note = { id: 1, content: 'test', important: false }
        useNoteStore.setState({ notes: [note] })
        noteServices.update.mockResolvedValue({ ...note, important: true })

        const { result } = renderHook(() => useNoteActions())

        await act(async () => {
            await result.current.toggleImportance(1)
        })

        const { result: notesResult } = renderHook(() => useNotes())
        expect(notesResult.current[0].important).toBe(true)
    })
})

describe('useNotes filtering', () => {
    const notes = [
        { id: 1, content: 'A', important: true },
        { id: 2, content: 'B', important: false },
    ]

    beforeEach(() => {
        useNoteStore.setState({ notes })
    })

    it('returns all notes with no filter', () => {
        const { result } = renderHook(() => useNotes())
        expect(result.current).toHaveLength(2)
    })

    it('filters important notes', () => {
        useNoteStore.setState({ notes, filter: 'important' })
        const { result } = renderHook(() => useNotes())
        expect(result.current).toEqual([notes[0]])
    })

    it('filters nonimportant notes', () => {
        useNoteStore.setState({ notes, filter: 'nonimportant' })
        const { result } = renderHook(() => useNotes())
        expect(result.current).toEqual([notes[1]])
    })
})