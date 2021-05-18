'use strict';

const BaseController = require("./base");
const path = require("path");
const fs = require("fs");
const pump = require("mz-modules/pump");  //引入 pump 用于处理文件上传的

class FocusController extends BaseController {
  async index() {
    await this.ctx.render("admin/focus/index");
  }


  //渲染多文件上传页面
  async add() {
    await this.ctx.render("admin/focus/add");
  }


  //处理多文件上传
  async doMultiUpload() {
    console.log("doMultiUpload");

    let parts = this.ctx.multipart({autoFields: true});  // 获取多文件上传流
    console.log(parts);
    let files = {} ;  //这个是用来存放 文件的名
    let stream ; //这个是用来存放单个文件的
    while((stream = await parts()) != null){
      if(!stream.filename){   //如果没有传入图片就直接返回
        break     
      }
      console.log(stream);
      let fieldname = stream.fieldname;  //获取图片的name属性值
      let uploadPath = await this.ctx.service.tools.getUploadPath(stream.filename);
      console.log(uploadPath);
      let pathName = uploadPath.uploadDir;
      let writeStream = fs.createWriteStream(pathName);
      
      await pump(stream, writeStream);

      //对象合拼
      files = Object.assign(files , {  
        [fieldname]: uploadPath.saveDir // es6的属性名表达式
      });

    }

    console.log(files);

    let focus = new this.ctx.model.Focus(Object.assign(files,  parts.field));
    console.log(focus);
    await focus.save();

   await this.success("/admin/focus", "轮播图添加成功")
  }

}

module.exports = FocusController;
