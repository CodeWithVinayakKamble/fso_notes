// utils/config.js
require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URL = process.env.MONGODB_URI
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI

const MONGODB_URI = process.env.NODE_ENV === 'test' ? TEST_MONGODB_URI : MONGODB_URL

module.exports = { MONGODB_URI, PORT }