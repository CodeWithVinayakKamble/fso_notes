const baseUrl = 'http://localhost:3001/initialNotes'

const getAll = async () => {

    const response = await fetch(baseUrl)

    if (!response.ok) {
        throw new Error('Failed to fetch notes')
    }

    return await response.json()
}

const createNew = async (content) => {

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, important: false })
    }

    const response = await fetch(baseUrl, options)

    if (!response.ok) {
        throw new Error('Failed to create')
    }

    return await response.json()
}


const update = async (id, note) => {

    const options = {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(note)
    }

    const response = await fetch(`${baseUrl}/${id}`, options)

    if (!response.ok) {
        throw new Error('Failed to update')
    }

    return await response.json()

}

export default { getAll, createNew, update }