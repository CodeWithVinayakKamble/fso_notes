const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByRole('textbox', { name: 'username', exact: true }).fill(username)
    await page.getByRole('textbox', { name: 'password', exact: true }).fill(password)
    await page.getByRole('button', { name: 'login' }).click()

}

const createNote = async (request, content, important = true) => {
    const response = await request.post('/api/login', {
        data: { username: 'vinayak', password: 'test@#123' }
    })

    const user = await response.json()

    await request.post('/api/notes', {
        data: { content, important },
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    })

}

export { loginWith, createNote }