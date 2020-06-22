const Router = require('koa-router')

module.exports = {
    bind (...args)  {
        this.inject = function nextInject (fn) {
            return async function (ctx) {
                return fn.call(this, ctx, ...args)
            }
        }
    },
    hijackKoaRouter () {
        const injectorContext = this
        const oldMethod = Router.prototype.register
        const nextMethod = function (path, methods, middleware, opts) {
            const context = this
            oldMethod.call(context, 
                path, methods, middleware.map(_ => injectorContext.inject(_)), opts)
        }
        Router.prototype.register = nextMethod
    },
    inject (fn) {
        return fn
    }
}
