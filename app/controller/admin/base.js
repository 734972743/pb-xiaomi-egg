'use strict';

const Controller = require('egg').Controller;


//公共的controller
class BaseController extends Controller {

  //成功之后的操作
  async success(redirectUrl, message) {
    await this.ctx.render("public/success.html",{
      redirectUrl: redirectUrl,
      message: message
    });
  }

  //失败之后的操作
  async error(redirectUrl, message) {
    await this.ctx.render("public/error.html",{
      redirectUrl: redirectUrl,
      message: message
    });
  }

  async verify(){
   
    let captcha = await this.service.tools.captcha();

    this.ctx.response.type = "image/svg+xml";  //指定验证码的类型
    this.ctx.body = captcha.data;    //给页面返回一张验证码的图片
  }


  //公共的删除方法
  async delete(){
    
    //要从url中获取 要删除的数据库 model
    //要从url 中获取 数据的id
    //执行删除
    //返回上一页

    let model =  this.ctx.request.query.model; 
    let _id = this.ctx.request.query._id;
    console.log(model, _id);
    await this.ctx.model[model].deleteOne({_id});

    this.ctx.redirect(this.ctx.state.prevPage);  //返回上一页
  }

  
}

module.exports = BaseController;
