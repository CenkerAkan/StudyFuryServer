const express =require('express');
const router= express.Router();
const blogControllers=require('../../controllers/blogController');


router.post('/createBlog', blogControllers.createBlog);

router.post('/updateBlog', blogControllers.updateBlog);

router.post('/findBlog', blogControllers.findBlog);

router.post('/viewBlog', blogControllers.viewBlog);


module.exports=router;