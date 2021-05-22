'use strict';

const BaseController = require("./base");
const fs = require("fs");
const pump = require("mz-modules/pump");  //引入 pump 用于处理文件上传的

class GoodsCateController extends BaseController {
  async index() {

    let list = await this.ctx.model.Goods.find({});

    console.log(list);

    await this.ctx.render("admin/goods/index",{
        list
    });
  }

  async add() {

    //获取所有的颜色类型
    let goodsColorList = await this.ctx.model.GoodsColor.find({});

    //获取所有的商品类型
    let goodsTypeList = await this.ctx.model.GoodsType.find({});


    //获取所有的商品所属类别
    let goodsCateList = await this.ctx.model.GoodsCate.aggregate([
      {
        $lookup:{
          from: "goods_cate",
          localField: "_id",
          foreignField: "pid",
          as: "items"
        }
      },
      {
        $match:{
          "pid": "0"
        }
      }
    ]);

    await this.ctx.render("admin/goods/add",{
        goodsColorList,
        goodsTypeList,
        goodsCateList
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

     let goodsObject = Object.assign(files,  parts.field);

     console.log(goodsObject);

     let goods = new this.ctx.model.Goods(goodsObject);
     let goodsResult = await goods.save();   //保存商品信息
 
    if(goodsResult){

      //保存商品图片信息
      if(goodsObject.img_url){
        let img_url = goodsObject.img_url;
        for(let i=0; i<img_url.length; i++){
          let goods_color = goodsObject.goods_color;
          for(let j=0; j<goods_color.length; j++){

            let goodsImage = new this.ctx.model.GoodsImage({
              goods_id: goodsResult._id,
              image_url: img_url[i],
              color_id: goods_color[j]
            });
    
            await goodsImage.save();
          }
          
        }
      }
      
      
      //获取指定的商品属性
      let goodsTypeAttributes = await this.ctx.model.GoodsTypeAttribute.find({"cate_id": goodsObject.attribute_id});
      console.log("goodsTypeAttributes",goodsTypeAttributes);
      if(goodsObject.attribute_id != "0" && goodsTypeAttributes && goodsTypeAttributes.length > 0){
        
        let attr_id_list = goodsObject.attr_id_list; // 这个是商品属性输入的值
        for(let i=0; i<attr_id_list.length; i++){
          //保存商品属性
          let goodsAttr = new this.ctx.model.GoodsAttr({
            goods_id: goodsResult._id,
            cate_id: goodsObject.cate_id,
            attribute_id: goodsObject.attribute_id,
            attribute_type: goodsTypeAttributes[i].attr_type,
            attribute_title: goodsTypeAttributes[i].title,
            attribute_value: attr_id_list[i]
          });

          await goodsAttr.save(); 
        }
      }
      
      
       await this.success("/admin/goods", "轮播图添加成功")

    }

 }



 async edit() {
   let id = this.ctx.request.query.id;
  let list = await this.ctx.model.Goods.find({"_id": id});

  //获取所有的颜色类型
  let allGoodsColorList = await this.ctx.model.GoodsColor.find({});

  //获取当前商品的已选择的颜色
  let currGoodsColorList = await this.ctx.model.GoodsImage.find({"goods_id": id});

  currGoodsColorList = currGoodsColorList.map(item=>{
    return item.color_id;
  });

  currGoodsColorList = [...new Set(currGoodsColorList)];

  console.log("currGoodsColorList",currGoodsColorList);

  //获取所有的商品类型
  let goodsTypeList = await this.ctx.model.GoodsType.find({});


  //获取所有的商品所属类别
  let goodsCateList = await this.ctx.model.GoodsCate.aggregate([
    {
      $lookup:{
        from: "goods_cate",
        localField: "_id",
        foreignField: "pid",
        as: "items"
      }
    },
    {
      $match:{
        "pid": "0"
      }
    }
  ]);

  //获取当前商品的图片集
  let goodsImageList = await this.ctx.model.GoodsImage.find({"goods_id":id});

  await this.ctx.render("admin/goods/edit",{
      data: list[0],
      allGoodsColorList,
      currGoodsColorList,
      goodsTypeList,
      goodsCateList,
      goodsImageList
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
