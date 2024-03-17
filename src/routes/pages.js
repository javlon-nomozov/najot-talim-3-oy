const { getHomePage } = require("../controllers/pages");

const router = require("express").Router();

// homepage
router.get("/hi", (req,res)=>{
    req.flash.set('alerts',{type:'danger',message:'Test'})
    res.redirect('/auth/login')
});
router.get("/", getHomePage);

module.exports = router;
