module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  let d = new Date();
 
  //商品分类模块
  const GoodsCateSchema = new Schema({
    title: { type: String  },  //分类名称
    cate_img: { type: String  },  //分类图片
    filter_attr: {type: String},   // 过滤属性 
    link: {type: String},   // 链接的url地址
    pid: {  // 父类id
      type: Schema.Types.Mixed  //混合类型
    },   
    template: {type: String},   // 模板
    sub_title: {type: String},   // 子标题
    keywords: {type: String},   // 关键字
    description: {type: String},   // 关键字描述
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
 
  return mongoose.model('GoodsCate', GoodsCateSchema, "goods_cate");
}

