const express =require('express');
const router= express.Router();
const sessionController=require('../../controllers/sessionController');

router.post('/startSession', sessionController.startSession);

router.post('/endSessionSuccess', sessionController.endSessionSuccess);

router.post('/endSessionFail', sessionController.endSessionFail);

module.exports=router;