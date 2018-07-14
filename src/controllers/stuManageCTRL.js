const path = require("path");
var xtpl = require("xtpl");

//引入mongodb
const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = "mongodb://localhost:27017";
// Database Name
const dbName = "ManageSystem_node";

//暴露获取列表页面的函数
exports.getListPage = (req, res) => {
  let keyword = req.query.keyword || "";
  //链接数据库  查询所有学生的数据
  MongoClient.connect(
    url,
    function(err, client) {
      const db = client.db(dbName);
      //获取数据集合
      const collection = db.collection("studentInfo");

      //查询数据
      collection.find({name:{$regex:keyword}}).toArray(function(err, docs) {
        // console.log(docs);
        xtpl.renderFile(
          path.join(__dirname, "../views/list.html"),
          {
            studentList: docs,
            keyword
          },
          function(error, content) {
            res.send(content);
            //关闭服务器
            client.close();
          }
        );
      });
    }
  );
};
