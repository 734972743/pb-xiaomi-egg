'use strict';

const BaseController = require("./base");

//商品类型
class GoodsTypeController extends BaseController {

  async index() {
    let list = await this.ctx.model.GoodsType.find({});
    await this.ctx.render("admin/goodsType/index", {
      list
    });  
  }

  async add() {

    await this.ctx.render("admin/goodsType/add", {
    });  
  }

  async doAdd() {

    let body = this.ctx.request.body;
    let goodsType = new this.ctx.model.GoodsType(body);

    await goodsType.save();

    await this.success("/admin/goodsType", "商品类型添加成功");
  }

  async edit() {
    let id = this.ctx.request.query.id;
    let data = await this.ctx.model.GoodsType.find({"_id": id});

    await this.ctx.render("admin/goodsType/edit", {
      data:data[0]
    });  
  }

  async doEdit() {
    let body = this.ctx.request.body;
    let id = body.id;
    let result = await this.ctx.model.GoodsType.updateOne({"_id":id} , body);

    if(result){
     await this.success("/admin/goodsType", "商品类型编辑成功");
    }
  }
}

module.exports = GoodsTypeController;
