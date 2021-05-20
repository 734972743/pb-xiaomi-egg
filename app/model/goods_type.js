module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  let d = new Date();
 /**
  * 商品类型
  */
  const GoodsTypeSchema = new Schema({
    title: {type: String},  //类型名称
    description: {type: String},  //类型描述
    add_time: {
      type: Number,
      default: d.getTime()
    },
    status: {
      type: Number, 
      default: 1
    }
  });
 
  return mongoose.model('GoodsType', GoodsTypeSchema, "goods_type");
}

