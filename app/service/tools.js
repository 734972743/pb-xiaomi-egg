'use strict';

const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha');
const md5 = require("md5");

/**
 * 这是一个工具类服务 ,可以给后台,前端项目都可以访问
 */
class ToolsService extends Service {

  //生成随机二维码图
  async captcha(){
    //生成二维码图
    let captcha = svgCaptcha.create({
      size: 4,   //文字的字数
      fontSize: 50,   //文字的大小
      width: 100,
      height: 40,
      background: "#cc9966"
    });   

    this.ctx.session.code = captcha.text;  // 验证码上面的文字信息
    return captcha;
  }


  async md5(str){
    return md5(str);
  }
}

module.exports = ToolsService;
