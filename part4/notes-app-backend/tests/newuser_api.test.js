const { test, beforeEach, describe, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('dev@vpk', 10)
    const user = new User({ username: 'vkdev', name: 'vpk', passwordHash })
    await user.save()

})


describe('env for new User testing', () => {

    test("creation succeeds with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "admin",
            name: "adminvpk",
            password: "admin@vpk"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    // ========================================================== //

    test("creation fails with proper statuscode and message if username already taken", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "vkdev",
            name: "vpk",
            password: "dev@vpk"
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
        assert(result.body.error.includes('expected `username` to be unique'))

    })


})




after(async () => {
    await mongoose.connection.close()
})
