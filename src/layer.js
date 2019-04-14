module.exports = class Layer {
  constructor (path, options, fn) {
    this.handle = fn
    this.name = fn.name || '<anonymous>'
    this.params = undefined
    this.path = undefined
  }

  match (path) {
    return this.route.path === path
  }

  handleRequest (req, res, next) {
    try {
      this.handle(req, res, next)
    } catch (err) {
      console.error(err)
    }
  }
}
