const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel.js')

class UserController{
  //注册
  static async register(ctx){
    const data = ctx.request.body
    const checkUser = await userModel.findOne({
      name:data.name
    })
    if(checkUser!==null){
      return ctx.sendError('000002','用户名已存在')
    }
    const user = new userModel({
      name:data.name,
      password:crypto.createHash('md5').update(data.password).digest('hex'),
      email:data.email
    })
    const result = await user.save()
    return result !==null?ctx.send(null,'注册成功'):ctx.sendError('000002','注册失败')
  }

  //登录
  static async login(ctx){
    const data = ctx.request.body
    if(!data.name||!data.password){
      return ctx.sendError('000002','参数不合法')
    }
    const result = await userModel.findOne({
      name:data.name,
      password:crypto.createHash('md5').update(data.password).digest('hex')
    })
    if(result!=null){
      const token = jwt.sign({
        name:result.name,
        _id:result._id
      },'my_token',{expiresIn:20*60})
      return ctx.send(token,'登录成功')
    }else{
      return ctx.sendError('000002','用户名或密码错误')
    }
  }
  //获取用户信息
  static async userInfo(ctx){
    try{
      const data = ctx.request.query
      const id = mongoose.mongo.ObjectId(data._id)
      const user = await userModel.findById(id)
      if(user!==null){
        const result = {
          _id:id,
          name:user.name,
          email:user.email
        }
        return ctx.send(result)
      }else{
        return ctx.sendError('000002')
      }
    }catch(ex){
      console.log(ex)
      return ctx.sendError('000002')
    }
    
  }
}

module.exports = UserController