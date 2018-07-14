const path = require("path");
//引入图片验证的包
const captchapng = require("captchapng");

//引入mongodb
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
  //将验证码保存在session重
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
  // console.log(req.body);
  //获取post请求的参数  用户名和密码
  const { username, password } = req.body;
  // console.log(username);
  // console.log(password);
  //连接数据库  将用户信息保存起来
  // Use connect method to connect to the server
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    function(err, client) {
      console.log("Connected successfully to server");

      const db = client.db(dbName);
      //获取集合 进行操作
      const collection = db.collection("accountInfo");

      // 根据用户名  查询是否已经存在
      collection.findOne({ username }, (err, doc) => {
        //如果用户名已经存在 返回提示信息
        if (doc != null) {
          //存在
          result.status = 1;
          result.message = "用户名已经存在!";

          client.close();
          res.json(result);
        } else {
          //不存在
          // req.body = {username:'admin',password:'123'}
          collection.insertOne(req.body, (err, result1) => {
            // 判断插入结果是否失败，如果失败就是null
            if (result1 == null) {
              result.status = 2;
              result.message = "注册失败!";
            }

            client.close();
            res.json(result);
          });
        }
      });
    }
  );
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

  //验证码正确，继续验证用户名和密码
  //连接服务器
  MongoClient.connect(
    url,
    function(err, client) {
      const db = client.db(dbName);
      //获取数据集合
      const collection = db.collection("accountInfo");

      //查询用户名和密码
      collection.findOne({username,password},(err, docs) =>{
        console.log(docs);  //没找到 返回null
        //判断如果为空  则提示用户名或密码错误
        if(docs == null){
          result.status = 2;
          result.message = '用户名或密码不存在';
          client.close();
          res.json(result);
          return;
        }else{
          //不为空，登陆成功
          res.json(result);
          console.log(result.message);
        }

      });
      //关闭服务器
      client.close();
    }
  );
};
