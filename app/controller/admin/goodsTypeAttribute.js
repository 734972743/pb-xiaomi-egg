'use strict';

const BaseController = require("./base");

//商品类型属性
class GoodsTypeAttributeController extends BaseController {

  async index() {
    let cate_id = this.ctx.request.query.id;

    let goodsTypes = await this.ctx.model.GoodsType.find({"_id":cate_id});

    let list = await this.ctx.model.GoodsTypeAttribute.aggregate([
      {
        $lookup:{
          from: "goods_type",
          localField: "cate_id",
          foreignField: "_id",
          as: "goodsTypes"
        }
      },
      {
        $match:{
          "cate_id": this.app.mongoose.Types.ObjectId(cate_id)
        }
      }
    ]);

    await this.ctx.render("admin/goodsTypeAttribute/index", {
      list,
      cate_id,
      goodsType: goodsTypes[0]
    });  
  }

  async add() {
    let cate_id = this.ctx.request.query.cate_id;

    //要获取所有的商品类型
    let cateList = await this.ctx.model.GoodsType.find({});

    

    await this.ctx.render("admin/goodsTypeAttribute/add", {
      cate_id,
      cateList
    });  
  }

  async doAdd() {

    let body = this.ctx.request.body;
    let goodsTypeAttribute = new this.ctx.model.GoodsTypeAttribute(body);

    await goodsTypeAttribute.save();

    await this.success("/admin/goodsTypeAttribute", "商品类型添加成功");
  }

  async edit() {
    let id = this.ctx.request.query.id;
    let data = await this.ctx.model.GoodsTypeAttribute.find({"_id": id});

    //要获取所有的商品类型
    let cateList = await this.ctx.model.GoodsType.find({});

    let cate_id = this.ctx.request.query.cate_id;

    await this.ctx.render("admin/goodsTypeAttribute/edit", {
      data:data[0],
      cateList,
      cate_id
    });  
  }

  async doEdit() {
    let body = this.ctx.request.body;
    console.log("body",body);
    let id = body.id;
    let result = await this.ctx.model.GoodsTypeAttribute.updateOne({"_id":id} , body);

    if(result){
     await this.success("/admin/goodsTypeAttribute?id="+body.cate_id, "商品属性编辑成功");
    }
  }


  async getByCateId(){
    let cate_id = this.ctx.request.query.cate_id;
    let data = await this.ctx.model.GoodsTypeAttribute.find({"cate_id":cate_id});
    //使用this.ctx.body 来返回数据  
    this.ctx.body = {
      data
    };
  }
}

module.exports = GoodsTypeAttributeController;
