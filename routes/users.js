var express = require('express');
var router = express.Router();

var userModel = require('../models/userModel');

const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");


//localhost: 3000/users/all
router.get("/all", async function (req, res) { 
  //req = request, res = respon
  var list = await userModel.find(); // get all
  res.json(list);
});

//Lấy tất cả toàn bộ danh sách user có độ tuổi là X 
//Với X là số mà người dùng nhập vào
// QUERY: localhost:3000/users/findOld?OldX=xxx& value01=abcd&value02=defgh
router.get("/findOld", async function (req, res) {
  //Query
  const {oldX,value01, value02} = req.query;
  var list = await userModel.find({old: {$gt: oldX}});
  res.json(list);
  
});

//Lấy tất cả toàn bộ danh sách user có độ tuổi là X 
//Với X là số mà người dùng nhập vào
//PARAMS: localhost:3000/users/findOld
router.get("/findOld2/:oldX/:value01/:value02", async function (req, res) {
  //Query
  const {oldX, value01, value02} = req.params;
  var list = await userModel.find({old: {$gt: oldX}});
  res.json(list);
  
});




router.post("/login", async function (req, res){
  try {
    const {username, password} = req.body;
    const checkUser = await userModel.findOne({username: username, password: password});

    if(checkUser == null){
      res.status(200). json({status: false, message: "Username và mật khẩu không đúng"});
    }else{

    //Token người dùng sẽ sử dụng gửi lên trên header mỗi lần muốn gọi api
      const token = JWT.sign({username: username},config.SECRETKEY, {expiresIn: '1h'});

    //Khi token hết hạn, người dùng sẽ call 1 api khác để lấy token mới  
    const refreshToken = JWT.sign({username: username},config.SECRETKEY, {expiresIn: '1d'});

    res.status(200).json({status: true,message: "Đăng nhập thành công", token: token, refreshToken: refreshToken
    });
    
    }

  } catch (error) {
    res.status(400).json({ status: false, message: "Đã có lỗi xảy ra" });

  }
  
});
module.exports = router;
