const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Định nghĩa schema cho bảng Nguoidung
const nguoidungSchema = new Schema({
    IDnd: { type: Schema.Types.ObjectId}, // ID tự động
    hovaten: { type: String}, // Họ và tên (bắt buộc)
    matkhau: { type: String }, // Mật khẩu (bắt buộc)
    email: { type: String}, // Email (bắt buộc, không trùng lặp)
    vaitro: { type: String, enum: ["user", "admin"], default: "user" }, // Vai trò (chỉ cho phép "user" hoặc "admin")
    sdt: { type: String }, // Số điện thoại (bắt buộc)
    ngaysinh: { type: Date }, 
    nghe: { type: String }, // Nghề nghiệp
});

// Export model
module.exports = mongoose.models.nguoidung || mongoose.model("nguoidung", nguoidungSchema);
