'use strict';

const BaseController = require("./base");

class GoodsCateController extends BaseController {
  async index() {
    
    let list = await this.ctx.model.GoodsCate.find({});

    await this.ctx.render("admin/goodsCate/index",{
        list
    });
  }

  async add() {
    let list = await this.ctx.model.GoodsCate.find({"pid":"0"});
    await this.ctx.render("admin/goodsCate/add",{
        list
    });
  }

 async doAdd() {
    
 }


}

module.exports = GoodsCateController;
