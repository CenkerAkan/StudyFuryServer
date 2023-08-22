const express =require('express');
const router= express.Router();
const taskController=require('../../controllers/taskController');

router.post('/createTask', taskController.createTask);

router.post('/completeTask', taskController.completeTask);

router.post('/updateTask', taskController.updateTask);

router.get('/getCurrentTasks', taskController.getCurrentTasks);

router.post('/discardTask', taskController.discardTask);

module.exports=router;