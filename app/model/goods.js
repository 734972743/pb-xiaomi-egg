module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  let d = new Date();
 
  //商品模块
  const GoodsSchema = new Schema({
    title: { type: String  },  //商品名称
    sub_title: {type: String},   // 商品子标题
    goods_sn: {type: String},   // 商品型号
    cate_id: {type: String},   // 分类id
    click_count: {type: String},   // 点击数量
    goods_number: {type: String},   // 商品数量
    shop_price: {type: String},   // 店铺价格
    market_price: {type: String},   // 市场价格
    relation_goods: {type: String},   // 相关商品
    goods_attrs: {type: String},   // 商品属性
    goods_version: {type: String},   // 商品版本
    goods_img: {type: String},   // 商品图片
    goods_gift: {type: String},   // 商品赠品
    goods_keywords: {type: String},   // 商品关键字
    goods_desc: {type: String},   // 商品描述
    goods_content: {type: String},   // 商品内容
    is_delete: { type: String  },  // 是否删除
    is_hot: {type: String},   //  是否是畅销商品
    is_best: {type: String},   // 是否是最好的商品
    is_new: {type: String},   // 是否是最新的商品
    goods_type_id: {type: String},   // 商品类型id

    goods_color:{  //商品颜色
      type: String,
    },
    status: {     //状态
      type: Number,
      default: 1
    },
    sort:{ //排序
      type: Number,
      default: 100
    },
    
    add_time:{  //创建时间
      type: Number,
      default: d.getTime()
    },

  });
 
  return mongoose.model('Goods', GoodsSchema, "goods");
}

