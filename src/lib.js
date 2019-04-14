const AppProto = require('./app')

function createApp () {
  const app = (req, res, next) => {
    app.handle(req, res, next)
  }

  Object.setPrototypeOf(app, AppProto.prototype)

  app.init()
  return app
}

module.exports = createApp
