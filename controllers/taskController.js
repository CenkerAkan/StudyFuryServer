const User=require('../models/User');
const Task=require("../models/Task");


async function createTask(req,res){
    const user = await User.findOne({_id: req.user.id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    const {header,deadline}=req.body;
    console.log("header: "+header+" deadline: "+deadline);
    if(!header||!deadline)return res.status(422).json({message: "improper input"});
    try {
        const userId=user.id;
        const createdTask=await Task.create({userId,header,deadline,isCompletedInTime:false});
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
        const currentDate=new Date();
        completedTask.completeDate=currentDate;
        await completedTask.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Task Complete Command Failed"});
    }
}

async function updateTask(req,res){
    const {taskId,header,deadline}=req.body;
    console.log(taskId);
    console.log(header);
    console.log(deadline);
    if(!taskId||!header||!deadline)return res.status(422).json({message: "improper input"});
    const updatedTask = await Task.findOne({_id: taskId}).exec();
    if(!updatedTask) return res.status(404).json({message: "task not found"});
    if(!(updatedTask.userId===req.user.id))return res.status(403).json({message:"userId and task is not matched :D"});

    try {
        updatedTask.header=header;
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

async function getTasks(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    try {
        const taskContent = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(taskContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching task content.' });
    }
}

async function discardTask(req,res){
    const user = await User.findOne({_id: req.user.id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    const {taskId}=req.body;
    if(!taskId)return res.status(422).json({message: "improper input"});
    const discardedTask = await Task.findOne({_id: taskId}).exec();
    if(!discardedTask) return res.status(404).json({message: "task not found"});

    try {
        user.totalTasks--;
        await user.save();
        await Task.findByIdAndDelete(taskId);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Task Discard Command Failed"});
    }
}

module.exports={createTask,completeTask,updateTask,getCurrentTasks,getTasks,discardTask};