module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  let d = new Date();
 
  //商品属性模块
  const GoodsAttrSchema = new Schema({
    goods_id: { type: Schema.Types.ObjectId  },  //商品id
    cate_id: {type: String},   // 商品分类id
    attribute_id: {type: String},   // 属性id 
    attribute_type: {type: Number},   // 属性类型
    attribute_title: {type: String},   // 属性名
    attribute_value: {type: String},   // 属性值
    
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
 
  return mongoose.model('GoodsAttr', GoodsAttrSchema, "goods_attr");
}

