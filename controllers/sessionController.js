const User=require('../models/User');
const Session=require('../models/Session');


async function startSession(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"}); 

    const {duration}=req.body;

    if(!duration||duration<25) return res.status(422).json({message: "wrong duration input"});

    try {
        const userId=req.user.id;
        const start=new Date();
        const end=new Date(start);

        end.setMinutes(start.getMinutes()+duration);
        const currentSession=await Session.create({userId,duration,start,end,isCompleted:false});
        user.totalFocusSessions++;
        user.currentSessionId=currentSession.id;
        await user.save();

        console.log('session registered!')
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Could not create a focus session"});
    }
}
async function endSessionSuccess(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"}); 

    const currentSessionId=user.currentSessionId;
    const session= await Session.findOne({_id:currentSessionId}).exec();

    if(!session||currentSessionId==="")return res.status(404).json({message:"session not found"});

    try {
        user.completedFocusSessions++;
        user.totalMinsWorked+=session.duration;
        user.currentSessionId="";
        await user.save();

        session.isCompleted=true;
        await session.save();

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Could not end a focus session"});
    }
}

async function endSessionFail(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"}); 

    const currentSessionId=user.currentSessionId;
    const session= await Session.findOne({_id:currentSessionId}).exec();
    if(!session||currentSessionId==="")return res.status(404).json({message:"session not found"});
    const start=session.start;
    console.log("start date");
    console.log(start);
    const now=new Date();
    console.log("old now date");
    console.log(now);
    console.log("now date");
    console.log(now);
    console.log("difference:" )
    let timePassed=(now.getHours()-start.getHours())*60+now.getMinutes()-start.getMinutes();
    console.log(timePassed);

    try {
        user.totalMinsWorked+=timePassed;
        user.currentSessionId="";
        await user.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Could not end a focus session"});
    }
}

module.exports={startSession,endSessionSuccess,endSessionFail};