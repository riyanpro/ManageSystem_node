const express = require('express');
const path = require('path');

//创建路由对象
const accountRouter = express.Router();

//引入获取登录页面的函数
const accountCTRL = require(path.join(__dirname,'../controllers/acountCTRl'));
//引入获取验证图片的函数

//请求 处理 响应
accountRouter.get('/index',accountCTRL.getLoginPage);
accountRouter.get('/vcodeImg',accountCTRL.getVcode);

//导出
module.exports = accountRouter;