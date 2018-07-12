const express = require("express");
const path = require("path");

const captchapng = require('captchapng');

//暴露获取登录页面的函数
exports.getLoginPage = (req, res) => {
  // res.send('hello world111111');
  res.sendFile(path.join(__dirname, "../views/login.html"), err => {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log("Sent:", path.join(__dirname, "../views/login.html"));
    }
  });
};

//暴露获取验证码的函数
exports.getVcode = (req, res) => {
    var p = new captchapng(80, 30, parseInt(Math.random() * 9000 + 1000)); // width,height,numeric captcha
    p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    var imgbase64 = new Buffer(img, "base64");
    res.writeHead(200, {
      "Content-Type": "image/png"
    });
    res.end(imgbase64);
};
