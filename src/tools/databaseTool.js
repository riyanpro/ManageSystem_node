//引入mongodb
const MongoClient = require("mongodb").MongoClient;
// Connection URL
const url = "mongodb://localhost:27017";
// Database Name
const dbName = "ManageSystem_node";

const ObjectId = require("mongodb").ObjectId;
exports.ObjectId = ObjectId;

//暴露查找一个数据的方法
//参数：控制器，数据，回调函数
exports.findOne = (collectionname, data, callback) => {
  //连接数据库
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    function(err, client) {
      const db = client.db(dbName);
      //获取数据集合
      const collection = db.collection(collectionname);

      //查询数据
      collection.findOne(data, (err, doc) => {
        //关闭数据库
        client.close();
        //返回结果
        callback(err, doc);
      });
    }
  );
};

//暴露插入数据的方法
exports.insertOne = (collectionname, data, callback) => {
  //连接数据库
  MongoClient.connect(
    url,
    function(err, client) {
      const db = client.db(dbName);
      //获取数据集合
      const collection = db.collection(collectionname);

      //查询数据
      collection.insertOne(data, (err, doc) => {
        //关闭数据库
        client.close();
        //返回结果
        callback(err, doc);
      });
    }
  );
};

//暴露查找的数据的方法
exports.find = (collectionname, data, callback) => {
  //连接数据库
  MongoClient.connect(
    url,
    function(err, client) {
      const db = client.db(dbName);
      //获取数据集合
      const collection = db.collection(collectionname);

      //查询数据
      collection.find(data).toArray((err, docs) => {
        //关闭数据库
        client.close();
        callback(err, docs);
      });
    }
  );
};

//暴露修改数据的方法
exports.upDate = (collectionname, option, data, callback) => {
  //连接数据库
  MongoClient.connect(
    url,
    function(err, client) {
      const db = client.db(dbName);
      //获取数据集合
      const collection = db.collection(collectionname);

      //修改数据
      collection.updateOne(option, { $set: data }, (err, result) => {
        //关闭数据库
        client.close();
        callback(err, result);
      });
    }
  );
};

//暴露出去删除数据的方法
exports.deleteStudent = (collectionname, data, callback) => {
  //连接数据库
  MongoClient.connect(
    url,
    function(err, client) {
      const db = client.db(dbName);
      const collection = db.collection(collectionname);

      //删除数据
      collection.deleteOne(data, function(err, result) {
        //关闭数据库
        client.close();
        callback(err, result);
      });
    }
  );
};
