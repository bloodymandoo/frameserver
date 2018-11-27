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
  router.all('*', async (ctx, next) => {
    // 允许来自所有域名请求
    ctx.set('Access-Control-Allow-Origin', '*');
  
    // 是否允许发送Cookie，ture为运行
    // ctx.set('Access-Control-Allow-Credentials', true);
  
    // // 设置所允许的HTTP请求方法
    // ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
  
    // // 服务器支持的所有头信息字段，多个字段用逗号分隔
    // ctx.set('Access-Control-Allow-Headers', 'x-requested-with, x-ui-request,lang');
    await next();
  });
routes(router)
app.use(router.routes())

app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
})
