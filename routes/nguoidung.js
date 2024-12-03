var express = require('express');
var router = express.Router();
var nguoidungModel = require('../models/nguoidungModel');

//1. Lấy tất cả người dùng
//localhost: 3000/nguoidung/all
router.get("/all", async function(req, res) {
  try {
      const token = req.header("Authorization").split(' ')[1];
      if(token){
          JWT.verify(token, config.SECRETKEY, async function (err, id){
          if(err){
              res.status(403).json({status: false,  message: 'Có lỗi xảy ra' + err});
          }else{
              //xử lý chức năng tương ứng với API
              const list = await nguoidungModel.find();
              res.json(list);
          }
          });
      }else{
          res.status(401).json({status: false,  message: 'Không xác thực'});
      }
  } catch (error) {
      res.status(400).json({status: false, message: 'Có lỗi xảy ra' + error});
  }
});

//2. Thêm thông tin người dùng
//localhost: 3000/nguoidung/add 
router.post("/add", async function (req, res) {
    try {
        const { hovaten, matkhau, email, vaitro, sdt, ngaysinh, nghe, anh } = req.body;

        const newUser = new nguoidungModel({
            hovaten,
            matkhau,
            email,
            vaitro,
            sdt,
            ngaysinh,
            nghe,
            anh,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'Thêm user thành công', user: savedUser });
    } catch (err) {
        console.error('Lỗi:', err); 
        res.status(400).json({ error: err.message });
    }
});


// 3. Sửa người dùng
//localhost:3000/nguoidung/update/<ID>
router.put('/update/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { hovaten, matkhau, email, vaitro, sdt, ngaysinh, nghe, anh } = req.body;
  
      const updatedUser = await nguoidungModel.findByIdAndUpdate(
        id, 
        { hovaten, matkhau, email, vaitro, sdt, ngaysinh, nghe, anh },
        { new: true }  
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


//4. Xóa người dùng
//localhost:3000/nguoidung/delete/<ID>
    router.delete("/delete/:id", async function (req, res) {
        try {
            const {id} = req.params;
            await nguoidungModel.findByIdAndDelete(id);
            res.status(200).json({status: true, message: "Thành công"});
        } catch (e) {
            res.status(400).json({status: false, message: "Có lỗi xảy ra"});
        }
    });

//5. Lấy danh sách người dùng theo ID
//localhost:3000/nguoidung/get/<ID>
router.get('/get/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await nguoidungModel.findById(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

//6. Tìm kiếm người dùng
//localhost:3000/nguoidung/search?query=quanh
  router.get('/search', async (req, res) => {
    const { query } = req.query;  
  
    try {
      const users = await nguoidungModel.find({
        $or: [
          { hovaten: { $regex: query, $options: 'i' } },  // Tìm theo tên
          { email: { $regex: query, $options: 'i' } },  // Tìm theo email
          { sdt: { $regex: query, $options: 'i' } }  // Tìm theo số điện thoại
        ]
      });
  
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


//7. Cập nhật mật khẩu người dùng
router.put('/update-password/:id', async (req, res) => {
    const { id } = req.params;
    const { matkhau } = req.body;  // Mật khẩu mới
  
    try {
      const updatedUser = await nguoidungModel.findByIdAndUpdate(
        id, 
        { matkhau },
        { new: true }  
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
  
      res.status(200).json({ message: 'Cập nhật mật khẩu thành công', user: updatedUser });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

//8. Lấy thông tin người dùng với tên tìm kiếm
//localhost:3000/nguoidung/by-name?name=Quốc Anh
router.get('/by-name', async (req, res) => {
    const { name } = req.query;  // Lấy tên từ query string
  
    try {
      const users = await nguoidungModel.find({
        hovaten: { $regex: name, $options: 'i' }
      });
  
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

//9. Kiểm tra xem email đã tồn tại hay chưa
//localhost:3000/nguoidung/check-email?email=quanh@gmail.com
router.get('/check-email', async (req, res) => {
    const { email } = req.query;  // Lấy email từ query string
  
    try {
      const user = await nguoidungModel.findOne({ email });
  
      if (user) {
        res.status(200).json({ message: "Email is already registered" });
      } else {
        res.status(200).json({ message: "Email is available" });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  //10. Xóa nhiều người dùng
 //localhost:3000/nguoidung/delete-multiple
  router.delete('/delete-multiple', async (req, res) => {
    const { ids } = req.body;  // Danh sách ID người dùng cần xóa
  
    try {
      const result = await nguoidungModel.deleteMany({ _id: { $in: ids } });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Không tìm thấy người dùng để xóa" });
      }
  
      res.status(200).json({ message: `${result.deletedCount} xóa người dùng thàn công` });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


  








  module.exports = router;


  






