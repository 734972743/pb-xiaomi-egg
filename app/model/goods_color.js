module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
 
  //商品颜色模块
  const GoodsColorSchema = new Schema({
    color_name: { type: String  },  //模块名称
    color_value: { type: String  },  //操作名称
    status: {     //状态
      type: Number,
      default: 1
    },
    

  });
 
  return mongoose.model('GoodsColor', GoodsColorSchema, "goods_color");
}

