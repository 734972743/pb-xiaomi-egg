/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1620815178809_4744';

  //配置 session
  config.session = {
    key: 'EGG_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    // encrypt: true,
    renew: true, // 延迟会话有效周期
  };

  // add your middleware config here
  config.middleware = ["adminAuth"];

  //配置adminAuth 中间件
  config.adminAuth = {
    match: "/admin"  ,  //路由带有/admin的都会使用这个中间件
  }

  //配置视图模板
  config.view = {
    //多视图模板设置
    mapping: {
      '.html': 'ejs',    //后缀名为.html ，使用ejs模块
      ".nj": "nunjucks"  //后缀名为.nj ，使用nunjucks模块
    },
  };

  //配置mongoose数据库
  config.mongoose = {
    client:{
      url: 'mongodb://eggadmin:123456@127.0.0.1/eggxiaomi',
      options: {},
    }
    
  };


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
