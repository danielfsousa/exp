const parseUrl = require('parseurl')
const Route = require('./route')
const Layer = require('./layer')

module.exports = class Router {
  constructor (options = {}) {
    const router = (req, res, next) => {
      this.handle(req, res, next)
    }

    router.params = {}
    router._params = []
    router.caseSensitive = options.caseSensitive
    router.mergeParams = options.mergeParams
    router.strict = options.strict
    router.stack = [] 

    Object.setPrototypeOf(router, Router.prototype)
    return router
  }

  _getPathName (req) {
    try {
      return parseUrl(req).pathname
    } catch (err) {
      return undefined
    }
  }

  _matchLayer (layer, path) {
    try {
      return layer.match(path)
    } catch (err) {
      return err
    }
  }

  route (path) {
    const route = new Route(path)
    const layer = new Layer(path, {}, route.dispatch.bind(route))
    layer.route = route
    this.stack.push(layer)
    return route
  }

  handle (req, res, out) {
    const { stack } = this
    let layer, match, route
    let index = 0

    const next = () => {
      const path = this._getPathName(req)
      while (match !== true && index < stack.length) {
        layer = stack[index++]
        route = layer.route
        match = this._matchLayer(layer, path)

        if (match !== true) {
          continue
        }

        if (!route) {
          // process non-route handlers normally
          continue
        }

        route.stack[0].handleRequest(req, res, next)
      }
    }

    next()
  }
}
