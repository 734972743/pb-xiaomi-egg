module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  let d = new Date();
 /**
  * 商品类型属性表
  */
  const GoodsTypeAttributeSchema = new Schema({
    cate_id: {type: Schema.Types.ObjectId},  // 商品分类id
    title: {type: String},  //属性名称
    attr_type: {type:Number},  //属性类型： 1 input ; 2 textarea;  3 select
    attr_value: {type:String},   // 指定默认值，  1 2 的默认值为空， 3 select有默认值， 多个默认值已回车符隔开
    sort:{  //排序
      type:Number,
    },
    add_time: {
      type: Number,
      default: d.getTime()
    },
    status: {
      type: Number, 
      default: 1
    }
  });
 
  return mongoose.model('GoodsTypeAttribute', GoodsTypeAttributeSchema, "goods_type_attribute");
}

