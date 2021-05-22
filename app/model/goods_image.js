module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  let d = new Date();
 
  //商品图片模块
  const GoodsImageSchema = new Schema({
    goods_id: { type: Schema.Types.ObjectId  },  //商品id
    image_url: { type: String  },  //图片url
    color_id: {  // 颜色id
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
 
  return mongoose.model('GoodsImage', GoodsImageSchema, "goods_image");
}

