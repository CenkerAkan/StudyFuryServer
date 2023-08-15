const User=require('../models/User');
const Task=require("../models/Task");


async function createTask(req,res){
    const user = await User.findOne({_id: req.user.id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    const {header,description,deadline}=req.body;

    if(!header||!description||!deadline)return res.status(422).json({message: "improper input"});
    try {
        const userId=user.id;
        const createdTask=await Task.create({userId,header,description,deadline,isCompletedInTime:false});
        console.log(createdTask)
        user.totalTasks++;
        await user.save();
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Task can not be created"});
    }
}

async function completeTask(req,res){
    const user = await User.findOne({_id: req.user.id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    const {taskId}=req.body;
    if(!taskId)return res.status(422).json({message: "improper input"});
    const completedTask = await Task.findOne({_id: taskId}).exec();
    if(!completedTask) return res.status(404).json({message: "task not found"});

    try {
        user.completedTasks++;
        await user.save();
        completedTask.isCompletedInTime=true;
        await completedTask.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Task Complete Command Failed"});
    }
}

async function updateTask(req,res){
    const {taskId,header,description,deadline}=req.body;
    console.log(taskId);
    console.log(header);
    console.log(description);
    console.log(deadline);
    if(!taskId||!header||!description||!deadline)return res.status(422).json({message: "improper input"});
    const updatedTask = await Task.findOne({_id: taskId}).exec();
    if(!updatedTask) return res.status(404).json({message: "task not found"});
    if(!(updatedTask.userId===req.user.id))return res.status(403).json({message:"userId and task is not matched :D"});

    try {
        updatedTask.header=header;
        updateTask.description=description;
        updatedTask.deadline=deadline;
        await updatedTask.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Update Complete Command Failed"});
    }

}

async function getCurrentTasks(req,res){
    const userId=req.user.id;
    try {
        const currentDate=new Date();
        const currentTasks=await Task.find({
            userId:userId,
            deadline:{$gt:currentDate},
            isCompletedInTime:false
        })
        res.status(200).json(currentTasks);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Get Current Task Command Failed"});
    }
}

module.exports={createTask,completeTask,updateTask,getCurrentTasks};