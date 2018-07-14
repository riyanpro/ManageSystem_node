//引入express
const express = require('express');
const path = require('path');


//创建路由对象
const stuManageRouter = express.Router();

//获取控制器
const stuManageCTRL = require(path.join(__dirname,"../controllers/stuManageCTRL"));

//获得列表页面
stuManageRouter.get('/list',stuManageCTRL.getListPage);


//导出
module.exports = stuManageRouter;
