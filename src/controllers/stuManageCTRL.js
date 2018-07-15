const path = require("path");
var xtpl = require("xtpl");
//引入databaseTool
const databaseTool = require(path.join(__dirname, "../tools/databaseTool"));

// 1.暴露获取列表页面的方法
exports.getListPage = (req, res) => {
  let keyword = req.query.keyword || "";
  // 调用databaseTool的方法  连接数据库  查询所有学生的数据
  databaseTool.find(
    "studentInfo",
    { name: { $regex: keyword } },
    (err, docs) => {
      xtpl.renderFile(
        path.join(__dirname, "../views/list.html"),
        {
          studentList: docs,
          keyword,
          loginedName:req.session.loginedName
        },
        function(error, content) {
          res.send(content);
        }
      );
    }
  );
};

// 2.暴露获取新增页面的方法
exports.getAddPage = (req, res) => {
  xtpl.renderFile(path.join(__dirname, "../views/add.html"), {loginedName:req.session.loginedName}, function(
    err,
    content
  ) {
    res.send(content);
  });
};

//3.暴露新增信息的方法---插入新信息
exports.addStuInfo = (req, res) => {
  // console.log(req.body);
  //连接数据库  插入信息
  databaseTool.insertOne("studentInfo", req.body, (err, result) => {
    //跳回列表页面
    res.send("<script>location.href='/stuManageSystem/list'</script>");
  });
};

//4. 暴露获取编辑页面的方法
exports.getEditPage = (req, res) => {
  //将获取到的studentId字符串转为对象
  let _id = databaseTool.ObjectId(req.params.studentId);
  //根据id找到对应的数据
  databaseTool.findOne("studentInfo", { _id }, (err, doc) => {
    //将查找到的数据渲染到页面
    xtpl.renderFile(
      path.join(__dirname, "../views/edit.html"),
      {
        studentInfo: doc,
        loginedName:req.session.loginedName
      },
      (err, content) => {
        res.send(content);
      }
    );
  });
};

//5.暴露修改编辑页面的方法
exports.editStudent = (req, res) => {
  //获取传过来的id
  let _id = databaseTool.ObjectId(req.params.studentId);

  //修改信息
  databaseTool.upDate("studentInfo", { _id }, req.body, (err, result) => {
    if (result == null) {
      res.send("<script>alert('修改失败')</script>");
    } else {
      //跳回列表页
      res.send("<script>location.href='/stuManageSystem/list'</script>");
    }
  });
};

//6.暴露删除信息的方法
exports.deleteStudent = (req, res) => {
  //获取传过来的id
  let _id = databaseTool.ObjectId(req.params.studentId);
  //根据id找到数据
  //删除数据
  databaseTool.deleteStudent("studentInfo", { _id }, (err, result) => {
    if (result == null) {
      res.send('<script>alert("删除失败")</script>');
    } else {
      //跳回列表页面
      res.send("<script>location.href='/stuManageSystem/list'</script>");
    }
  });
};
