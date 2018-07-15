const express = require('express');
const path = require('path');


//创建路由对象
const accountRouter = express.Router();

//引入获取登录页面的函数
const accountCTRL = require(path.join(__dirname,'../controllers/accountCTRl'));
//引入获取验证图片的函数

//请求 处理 响应
//登录页处理
accountRouter.get('/login',accountCTRL.getLoginPage);
//验证码处理
accountRouter.get('/vcodeImg',accountCTRL.getVcode);
//获取注册页处理
accountRouter.get('/register',accountCTRL.getRegisterPage);
//处理注册请求
accountRouter.post('/register',accountCTRL.register);
//处理登录请求
accountRouter.post('/login',accountCTRL.login);
//处理退出请求
accountRouter.get('/logout',accountCTRL.logout);


//导出
module.exports = accountRouter;