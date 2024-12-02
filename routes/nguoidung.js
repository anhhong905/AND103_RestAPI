var express = require('express');
var router = express.Router();
var nguoidungModel = require('../models/nguoidungModel');

//localhost: 3000/nguoidung/all
// GET /nguoidung/all
router.get("/all", async function (req, res) { 
    try {
        const list = await nguoidungModel.find();
        res.json(list);
    } catch (err) {
        res.status(500).send("Server error");
    }
});




  module.exports = router;