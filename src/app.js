const http = require('http')
const methods = require('methods')
const Router = require('./router')

module.exports = class App {
  init () {
    this.cache = {}
    this.engines = {}
    this.settings = {}
    this._router = undefined
    this._initMethods()
  }

  _initMethods () {
    for (const method of methods) {
      this[method] = this._makeRouteFunction.bind(this)(method)
    }
  }

  _makeRouteFunction (method) {
    return (path, ...args) => {
      this.lazyrouter()
      const route = this._router.route(path)
      route[method](...args)
      return this
    }
  }

  lazyrouter () {
    if (!this._router) {
      this._router = new Router({})
    }
  }

  handle (req, res, callback) {
    this._router.handle(req, res)
  }

  listen (...args) {
    const server = http.createServer(this.handle.bind(this))
    return server.listen(...args)
  }
}
