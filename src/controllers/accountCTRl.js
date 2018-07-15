const path = require("path");
//引入图片验证的包
const captchapng = require("captchapng");
//引入databaseTool
const databaseTool = require(path.join(__dirname, "../tools/databaseTool"));

// //引入mongodb
const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = "mongodb://localhost:27017";
// Database Name
const dbName = "ManageSystem_node";

//暴露获取登录页面的函数
exports.getLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"), err => {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      // console.log("Sent:", path.join(__dirname, "../views/login.html"));
    }
  });
};

//暴露获取验证码的函数
exports.getVcode = (req, res) => {
  //随机生成验证码
  var vcode = parseInt(Math.random() * 9000 + 1000);
  //将验证码保存在session中
  req.session.vcode = vcode;

  var p = new captchapng(80, 30, vcode); // width,height,numeric captcha
  p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
  p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
  var img = p.getBase64();
  var imgbase64 = new Buffer(img, "base64");
  res.writeHead(200, {
    "Content-Type": "image/png"
  });
  res.end(imgbase64);
};

//暴露获取注册页面的函数
exports.getRegisterPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/register.html"));
};

//暴露处理注册的函数
exports.register = (req, res) => {
  const result = { status: 0, message: "注册成功" };

  //获取post请求的参数  用户名和密码
  const { username, password } = req.body;

  //调用databaseTool暴露的方法，连接数据库  将用户信息保存起来
  databaseTool.findOne("accountInfo", { username }, (err, doc) => {
    //如果用户名已经存在 返回提示信息
    if (doc != null) {
      //存在
      result.status = 1;
      result.message = "用户名已经存在!";

      client.close();
      res.json(result);
    } else {
      //不存在
      databaseTool.insertOne("accountInfo", req.body, (err, result1) => {
        if (result1 == null) {
          result.status = 2;
          result.message = "注册失败!";
        }

        res.json(result);
      });
    }
  });
};

//暴露处理登录的函数
exports.login = (req, res) => {
  //设置登录结果
  var result = { status: 0, message: "登陆成功" };

  //获取用户名、密码和验证码
  const { username, password, vcode } = req.body;
  console.log(vcode);

  //判断验证码是否正确
  // console.log(req.session);
  if (req.session.vcode != vcode) {
    result.status = 1;
    result.message = "验证码有误";
    //返回结果
    res.json(result);
    return;
  }

  //查询用户名和密码
  databaseTool.findOne("accountInfo", { username, password }, (err, docs) => {
    //判断如果为空  则提示用户名或密码错误
    if (docs == null) {
      result.status = 2;
      result.message = "用户名或密码不存在";
    } else {
      //不为空，登陆成功
      //保存用户名在session中
      req.session.loginedName = username;
    }
    res.json(result);
  });
};


//暴露处理退出的方法
exports.logout = (req,res)=>{
  //清除用户名缓存
  req.session.loginedName = null;
  //跳回登录页
  res.send("<script>location.href= '/account/login'</script>");
}
