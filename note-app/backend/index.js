// ================================== //
// Server Listener
// ================================== //
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server is live on port http://localhost:${config.PORT}`)
})