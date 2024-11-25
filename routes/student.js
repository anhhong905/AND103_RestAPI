var express = require('express');
var router = express.Router();

var studentModel = require('../models/studentModel');

const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");
const userModel = require('../models/userModel');

// 1.Lấy toàn bộ danh sách sinh viên 
//localhost: 3000/student/all
    router.get("/all", async function(req, res) {
        try {
            const token = req.header("Authorization").split(' ')[1];
            if(token){
                JWT.verify(token, config.SECRETKEY, async function (err, id){
                if(err){
                    res.status(403).json({status: false,  message: 'Có lỗi xảy ra' + err});
                }else{
                    //xử lý chức năng tương ứng với API
                    var list = await studentModel.find(); // Lấy tất cả
                    res.status(200).json(list);
                }
                });
            }else{
                res.status(401).json({status: false,  message: 'Không xác thực'});
            }
        } catch (error) {
            res.status(400).json({status: false, message: 'Có lỗi xảy ra' + error});
        }
    });

// 2.Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
// localhost:3000/student/department/CNTT
    router.get("/department/CNTT", async function (req, res) {

    //     try {
    //         const student = await studentModel.find({ department: 'CNTT' });
    //         res.status(200).json(student)
    //     } catch (e) {
    //         res.status(400).json({ status: false, message: 'Có lỗi xảy ra' }); 
    //     }
    // });

    try {
        const token = req.header("Authorization").split(' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
            if(err){
                res.status(403).json({status: false,  message: 'Có lỗi xảy ra' + err});
            }else{
                //xử lý chức năng tương ứng với API
                const student = await studentModel.find({ department: 'CNTT' });
                res.status(200).json(student)
            }
            });
        }else{
            res.status(401).json({status: false,  message: 'Không xác thực'});
        }
    } catch (error) {
        res.status(400).json({status: false, message: 'Có lỗi xảy ra' + error});
    }
});

// 3.Lấy danh sách sinh viên có điểm trung bình từ 6.5 đến 8.5
// localhost:3000/student/dtb-6-5-den-8-5?GPA[gte]=6.5&GPA[lte]=8.5


    router.get("/dtb-6-5-den-8-5", async function(req, res) {
    //     try {
    //         const student = await studentModel.find({ GPA: { $gte: 6.5, $lte: 8.5 } });
    //         res.status(200).json(student);
    //     } catch (error) {
    //         res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    //     }
    // });

    try {
        const token = req.header("Authorization").split(' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
            if(err){
                res.status(403).json({status: false,  message: 'Có lỗi xảy ra' + err});
            }else{
                //xử lý chức năng tương ứng với API
                const student = await studentModel.find({ GPA: { $gte: 6.5, $lte: 8.5 } });
                res.status(200).json(student);
            }
            });
        }else{
            res.status(401).json({status: false,  message: 'Không xác thực'});
        }
    } catch (error) {
        res.status(400).json({status: false, message: 'Có lỗi xảy ra' + error});
    }
});

// 4.Tìm kiếm thông tin của sinh viên theo MSSV
//localhost: 3000/student/mssv
//localhost: 3000/student/mssv?mssvT=PS1234
    router.get("/mssv", async function (req, res) {
        try {
            const {mssvT} = req.query;
            var list = await studentModel.find({mssv:mssvT});
            res.status(200).json(list);
            
        } catch (error) {
            res.status(400).json({ status: false, message: 'Có lỗi xảy ra' +error });
        }
    });


// 5. Thêm mới một sinh viên mới
// localhost: 3000/student/themSV (post)
router.post("/themSV", async function (req, res) {
    try {
        const {fullname, mssv, GPA, old, department} = req.body;
        const newStudent = {fullname, mssv, GPA, old, department};
        await studentModel.create(newStudent);
        res.json({status: 1, message: "Thêm sinh viên thành công"});
    } catch (error) {
        res.json({status: 0, message:"Thêm sinh viên thất bại"});
    }
});

// 6. Thay đổi thông tin sinh viên theo MSSV
//localhost:3000/student/suaSV(post)
router.post("/suaSV", async function (req, res, next) {
    try {
      const { id, fullname, mssv, GPA, old, department} = req.body;
  
      var item = await studentModel.findById(id);
      if (item) {
        item.fullname = fullname ? fullname : item.fullname;
        item.mssv = mssv ? mssv : item.mssv;
        item. GPA = GPA ? GPA : item.GPA;
        item.old = old ? old : item.old;
        item.department = department ? department : item.department;
        await item.save();
        res.json({ status: 1, message: "Sửa sinh viên thành công" });
      }
    } catch (err) {
      res.json({ status: 0, message: "Sửa sinh viên thất bại" });
    }
  });
  

// 7. Xóa một sinh viên ra khỏi danh sách
//localhost:3000/student/delete
router.delete("/delete", async function (req, res) {
    try {
      const {id} = req.body;
      const result = await studentModel.findByIdAndDelete(id);
      
      if(result){
        res.status(200).json({ status: true, message: "Xóa sinh viên thành công" });
      }else{
        res.status(404).json({ status: false, message: "Không tìm thấy sinh viên"});
      }
    } catch (err) {
        res.status(400).json({ status: false, message: "Xóa sinh viên thất bại", err: err });
    }
  });
  

// 8. Lấy danh sách các sinh viên thuộc BM CNTT và có DTB từ 9.0
//localhost:3000/student/khoa-cntt-dtb-9
    router.get("/khoa-cntt-dtb-9", async function(req, res) {
    //     try {
    //         const student = await studentModel.find({ department: 'CNTT', GPA: { $gte: 9.0 } });
    //         res.status(200).json(student);
    //     } catch (error) {
    //         res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    //     }
    // });

    try {
        const token = req.header("Authorization").split(' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
            if(err){
                res.status(403).json({status: false,  message: 'Có lỗi xảy ra' + err});
            }else{
                //xử lý chức năng tương ứng với API
                const student = await studentModel.find({ department: 'CNTT', GPA: { $gte: 9.0 } });
                res.status(200).json(student);
            }
            });
        }else{
            res.status(401).json({status: false,  message: 'Không xác thực'});
        }
    } catch (error) {
        res.status(400).json({status: false, message: 'Có lỗi xảy ra' + error});
    }
});

// 9. Lấy ra danh sách các sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT có điểm trung bình từ 6.5
//localhost:3000/student/getTuoiDiem
    router.get("/getTuoiDiem", async function (req, res) {
        try {
            const student = await studentModel.find({
                department : 'CNTT',
                old: {$gte: 18, $lte: 20},
                GPA: {$gte: 6.5}
            });
            res.status(200).json(student);
            
        } catch (error) {
            res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
            
        }
        
    });

//     try {
//         const token = req.header("Authorization").split(' ')[1];
//         if(token){
//             JWT.verify(token, config.SECRETKEY, async function (err, id){
//             if(err){
//                 res.status(403).json({status: false,  message: 'Có lỗi xảy ra' + err});
//             }else{
//                 //xử lý chức năng tương ứng với API
//                 const student = await studentModel.find({
//                  department : 'CNTT',
//                 old: {$gte: 18, $lte: 20},
//                 GPA: {$gte: 6.5}
//                 }
//             });
//             res.status(200).json(student);
            
//         }else{
//             res.status(401).json({status: false,  message: 'Không xác thực'});
//         }
//     } catch (error) {
//         res.status(400).json({status: false, message: 'Có lỗi xảy ra' + error});

// });




// 10.Sắp xếp danh sách sinh viên tăng dần theo dtb
//localhost:3000/student/sapXepDiem
    router.get("/sapXepDiem", async function (req, res) {
    //     try {
    //         const student = await studentModel.find().sort({GPA: 1}) //1 là sắp xếp tăng dần
    //         res.status(200).json(student);
    //     } catch (error) {
    //         res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });    
    //     }  
    // });


    try {
        const token = req.header("Authorization").split(' ')[1];
        if(token){
            JWT.verify(token, config.SECRETKEY, async function (err, id){
            if(err){
                res.status(403).json({status: false,  message: 'Có lỗi xảy ra' + err});
            }else{
                //xử lý chức năng tương ứng với API
                const student = await studentModel.find().sort({GPA: 1}) //1 là sắp xếp tăng dần
                res.status(200).json(student);
            }
            });
        }else{
            res.status(401).json({status: false,  message: 'Không xác thực'});
        }
    } catch (error) {
        res.status(400).json({status: false, message: 'Có lỗi xảy ra' + error});
    }
});

// 11.Tìm sinh viên có điểm trung bình cao nhất thuộc BM CNTT
    router.get("/dTB-maxCNTT", async function (req, res){
        try 
        {
            // var mon = "CNTT"
            var listCNTT = await studentModel.find({department : "CNTT"}).sort({GPA : -1}).limit(1);
            var listTrung = await studentModel.find({$and: [{department : "CNTT"}, {GPA : listCNTT[0].diemtb}]});
            res.json(listCNTT);
        }
        catch(e){
            res.status(400).json({status: false, message:"FAIL: " +e});
        }
    });





    //export  đâu ???????
    module.exports = router;
    // mọe
    //50
