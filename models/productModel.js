var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const product = new Schema({
    id: {type: ObjectId},
    name: {type: String},
    price: {type: Number},
    quantity: {type: Number},
    category:{type: String}
});

module.exports = mongoose.models.product || mongoose.model("product", product);