const express =require('express');
const router= express.Router();
const commentController=require('../../controllers/commentController');


router.post('/createComment', commentController.createComment);

router.post('/updateComment', commentController.updateComment);

router.post('/listComment', commentController.listComment);

router.post('/deneme', commentController.deneme);
module.exports=router;