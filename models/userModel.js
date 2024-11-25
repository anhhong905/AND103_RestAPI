const mongoose = require('mongoose'); // require = call the library
const Schema = mongoose.Schema; //Schema = collection 
const ObjectId = Schema.ObjectId;
const user = new Schema({
    id: { type: ObjectId }, // khóa chính
        username: {type: String},
        password: {type: String},
        fullname: {type: String},
        old: {type: Number}
});
module.exports = mongoose.models.user || mongoose.model('user', user);
