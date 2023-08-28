const express =require('express');
const router= express.Router();
const sessionController=require('../../controllers/sessionController');

router.post('/startSession', sessionController.startSession);

router.get('/endSessionSuccess', sessionController.endSessionSuccess);

router.get('/endSessionFail', sessionController.endSessionFail);

module.exports=router;