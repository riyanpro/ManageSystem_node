//引入express
const express = require('express');
const path = require('path');


//创建路由对象
const stuManageRouter = express.Router();

//获取控制器
const stuManageCTRL = require(path.join(__dirname,"../controllers/stuManageCTRL"));

//获得列表页面
stuManageRouter.get('/list',stuManageCTRL.getListPage);
//获取新增页面
stuManageRouter.get("/add",stuManageCTRL.getAddPage);
//新增页面保存
stuManageRouter.post("/add",stuManageCTRL.addStuInfo);
//获取编辑页面
stuManageRouter.get("/edit/:studentId",stuManageCTRL.getEditPage);
//保存编辑页面
stuManageRouter.post("/edit/:studentId",stuManageCTRL.editStudent);
//删除页面
stuManageRouter.get("/delete/:studentId",stuManageCTRL.deleteStudent);


//导出
module.exports = stuManageRouter;
