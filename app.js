const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')
const koajwt = require('koa-jwt')
const config = require('./config/index')
const db = require('./config/db')
const routes = require('./routes/index')
const errorHandle = require('./middlewares/errorHandle.js')
const sendHandle = require('./middlewares/sendHandle.js')
const port = process.env.PORT || config.port

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
  .use(json())
  .use(bodyparser())
  .use(sendHandle())
  .use(errorHandle)
  .use(logger())
  // .use(koajwt({
  //       secret: 'my_token'
  //   }).unless({
  //       path: [/\/api\/register/, /\/api\/login/]
  //   }))
routes(router)
app.use(router.routes())

app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
})
