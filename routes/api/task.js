const express =require('express');
const router= express.Router();
const taskController=require('../../controllers/taskController');

router.post('/createTask', taskController.createTask);

router.post('/completeTask', taskController.completeTask);

router.post('/updateTask', taskController.updateTask);

router.post('/getCurrentTasks', taskController.getCurrentTasks);

module.exports=router;