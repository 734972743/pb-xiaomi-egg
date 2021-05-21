'use strict';

const BaseController = require("./base");
const fs = require("fs");
const pump = require("mz-modules/pump");  //引入 pump 用于处理文件上传的

class GoodsCateController extends BaseController {
  async index() {
    
    // let list = await this.ctx.model.Goods.aggregate([
    //   {
    //     $lookup:{
    //       from: "goods_cate",
    //       localField: "_id",
    //       foreignField: "pid",
    //       as: "items"
    //     }
    //   },
    //   {
    //     $match:{
    //       "pid":"0"
    //     }
    //   }
    // ]);

    let list = await this.ctx.model.Goods.find({});

    await this.ctx.render("admin/goods/index",{
        list
    });
  }

  async add() {

    //获取所有的颜色类型
    let goodsColorList = await this.ctx.model.GoodsColor.find({});

    //获取所有的商品类型
    let goodsTypeList = await this.ctx.model.GoodsType.find({});

    await this.ctx.render("admin/goods/add",{
        goodsColorList,
        goodsTypeList
    });
  }

 async doAdd() {
    let parts = this.ctx.multipart({autoFields: true});  // 获取多文件上传流
    console.log(parts);
    let files = {} ;  //这个是用来存放 文件的名
    let stream ; //这个是用来存放单个文件的
    while((stream = await parts()) != null){
      if(!stream.filename){   //如果没有传入图片就直接返回
        break     
      }
      let fieldname = stream.fieldname;  //获取图片的name属性值
      let uploadPath = await this.ctx.service.tools.getUploadPath(stream.filename);
      let pathName = uploadPath.uploadDir;
      let writeStream = fs.createWriteStream(pathName);
      
      await pump(stream, writeStream);

      //生成缩略图
      this.ctx.service.tools.jimpImg(pathName);

      //对象合拼
      files = Object.assign(files , {  
        [fieldname]: uploadPath.saveDir // es6的属性名表达式
      });

    }

    // console.log(files);

    if(parts.field.pid != 0){
      parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);  //将字符串类型转成objectid类型
    }

    // files存放的是图片， parts.field存放的是非图片的其他字段
    let goodsCate = new this.ctx.model.GoodsCate(Object.assign(files,  parts.field));
    await goodsCate.save();

    await this.success("/admin/goods", "轮播图添加成功")
 }



 async edit() {
   let id = this.ctx.request.query.id;
  let list = await this.ctx.model.GoodsCate.find({"_id": id});

  //获取分类数组
  let cateList = await this.ctx.model.GoodsCate.find({"pid": "0"});
  await this.ctx.render("admin/goods/edit",{
      data: list[0],
      cateList
  });
}

async doEdit() {

  // 注意 ：前端使用enctype="multipart/form-data" ，后端就不能使用body来获取值
  // let body = this.ctx.request.body;  

  let parts = this.ctx.multipart({autoFields: true});  // 获取多文件上传流
  console.log(parts);
  let files = {} ;  //这个是用来存放 文件的名
  let stream ; //这个是用来存放单个文件的
  while((stream = await parts()) != null){
    if(!stream.filename){   //如果没有传入图片就直接返回
      break     
    }
    let fieldname = stream.fieldname;  //获取图片的name属性值
    let uploadPath = await this.ctx.service.tools.getUploadPath(stream.filename);
    let pathName = uploadPath.uploadDir;
    let writeStream = fs.createWriteStream(pathName);
    
    await pump(stream, writeStream);

    //生成缩略图
    this.ctx.service.tools.jimpImg(pathName);

    //对象合拼
    files = Object.assign(files , {  
      [fieldname]: uploadPath.saveDir // es6的属性名表达式
    });

  }

  // console.log(files);

  if(parts.field.pid != 0){
    parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);  //将字符串类型转成objectid类型
  }

  // files存放的是图片， parts.field存放的是非图片的其他字段
  // let goodsCate = new this.ctx.model.GoodsCate(Object.assign(files,  parts.field));

  let id = parts.field.id;

  let updateBody = Object.assign(files,  parts.field);

  let result = await this.ctx.model.GoodsCate.updateOne({"_id": id}, updateBody);

  if(result){
    await this.success("/admin/goodsCate", "轮播图修改成功")
  }else{
    await this.error("/admin/goodsCate/edit", "轮播图修改失败")
  }
  
}


//商品详情图片上传
async uploadImage() {
  let parts = this.ctx.multipart({autoFields: true});  // 获取多文件上传流
    let files = {} ;  //这个是用来存放 文件的名
    let stream ; //这个是用来存放单个文件的
    while((stream = await parts()) != null){
      if(!stream.filename){   //如果没有传入图片就直接返回
        break     
      }
      let fieldname = stream.fieldname;  //获取图片的name属性值
      let uploadPath = await this.ctx.service.tools.getUploadPath(stream.filename);
      let pathName = uploadPath.uploadDir;
      let writeStream = fs.createWriteStream(pathName);
      
      await pump(stream, writeStream);

      //对象合拼
      files = Object.assign(files , {  
        [fieldname]: uploadPath.saveDir // es6的属性名表达式
      });

      this.ctx.body = {  
        link: files.file  //返回上传的图片地址给前端
      }

    }
}




//商品相册上传
async uploadPhoto() {
  let parts = this.ctx.multipart({autoFields: true});  // 获取多文件上传流
    let files = {} ;  //这个是用来存放 文件的名
    let stream ; //这个是用来存放单个文件的
    while((stream = await parts()) != null){
      if(!stream.filename){   //如果没有传入图片就直接返回
        break     
      }
      let fieldname = stream.fieldname;  //获取图片的name属性值
      let uploadPath = await this.ctx.service.tools.getUploadPath(stream.filename);
      let pathName = uploadPath.uploadDir;
      let writeStream = fs.createWriteStream(pathName);
      
      await pump(stream, writeStream);

      //生成缩略图
      this.ctx.service.tools.jimpImg(pathName);

      //对象合拼
      files = Object.assign(files , {  
        [fieldname]: uploadPath.saveDir // es6的属性名表达式
      });

      this.ctx.body = {  
        link: files.file  //返回上传的图片地址给前端
      }

    }
}


}

module.exports = GoodsCateController;
