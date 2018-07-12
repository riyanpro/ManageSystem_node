//引入express
const express = require('express');
const path = require('path');

//创建app
const app = express();

//处理静态资源的请求
app.use(express.static(path.join(__dirname + '/statics')));

//引入路由
const accountRouter = require(path.join(__dirname,'./routers/accountRouter'));


//请求 处理 响应
app.use('/acount', accountRouter);

//开启web服务
app.listen(3000,'127.0.0.1',(err)=>{
    if(err){
        console.log(err)
    }
    console.log('start');
})
