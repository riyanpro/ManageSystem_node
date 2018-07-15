//引入express
const express = require("express");
const path = require("path");
//引入body-parser 获取post请求的参数
var bodyParser = require("body-parser");
//y引入express-session的包
var session = require("express-session");

//创建app
const app = express();
//处理静态资源的请求
app.use(express.static(path.join(__dirname + "/statics")));
//body-parser: parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//body-parser: parse application/json
app.use(bodyParser.json());
// Use the session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60000 }
  })
);

//进行跳转拦截
app.all("*", (req, res, next) => {
  //如果是登录注册操作可直接进行
  if (req.url.includes("account")) {
    next();
  } else {
    //判断是否登陆过，是的话下一步  不是的话跳到登录页
    if (!req.session.loginName) {
      res.send(
        '<script>alert("您还没有登录，请先登录");location.href="/account/login"</script>'
      );
      return;
    }
    next();
  }
});

//引入路由
const accountRouter = require(path.join(__dirname, "./routers/accountRouter"));
// const accountRouter = require("./routers/accountRouter");
const stuManageRouter = require(path.join(
  __dirname,
  "./routers/stuManageRouter"
));

//请求 处理 响应
app.use("/account", accountRouter);
app.use("/stuManageSystem", stuManageRouter);

//开启web服务
app.listen(3000, "127.0.0.1", err => {
  if (err) {
    console.log(err);
  }
  console.log("start");
});
