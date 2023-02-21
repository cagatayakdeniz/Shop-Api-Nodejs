const express = require('express');
const router = express.Router();

router.get("",(req,res)=>{
    res.send("Ana Sayfa");
});

module.exports = router;