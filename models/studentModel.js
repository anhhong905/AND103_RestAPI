const mongoose = require('mongoose'); // require = call the library
const Schema = mongoose.Schema; //Schema = collection 
const ObjectId = Schema.ObjectId;

const student = new Schema({
    id: { type: ObjectId }, // khóa chính
        fullname: {type: String},
        mssv: {type: String},
        GPA: {type: Number},
        department: {type: String},
        old: {type: Number}
});
module.exports = mongoose.models.student || mongoose.model('student', student);