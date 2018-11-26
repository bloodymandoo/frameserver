const user = require('./users.js')

module.exports =  (router) => {
  user('/api/user',router)
}
