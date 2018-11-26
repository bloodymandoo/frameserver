const User = require('../controllers/user.js')

module.exports = (baseUrl,router)=>{
  router.post(baseUrl+'/register', User.register)
  router.post(baseUrl+'/login', User.login)
  router.get(baseUrl+'/getUserInfo', User.userInfo)
}
