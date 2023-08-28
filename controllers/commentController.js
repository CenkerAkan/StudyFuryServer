const User=require('../models/User');
const Blog=require('../models/Blog');
const Comment=require('../models/Comment');


async function createComment(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    const {post_id,description}=req.body;
    if(!post_id||!description) return res.status(422).json({message: "wrong comment input"});
    const blog=await Blog.findOne({_id:post_id});
    if(!blog)return res.status(404).json({message: "post can not found"});

    try {
        await Comment.create({userId:id,postId:post_id,description});
        
        user.commentCount++;
        await user.save();

        blog.commentNumber++;
        await blog.save();
        return res.status(200).json({message: "comment successful"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Could not create a blog post"});
   
    }

}



async function updateComment(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    const{comment_id,description,deleteFlag}=req.body;
    if(!description&&!(deleteFlag===true))return res.status(422).json({message: "wrong description input"});
    const currentComment=await Comment.findOne({_id:comment_id});
    if(!currentComment)return res.status(404).json({message:"comment not found"});
    try {
        if(deleteFlag){
            const blogId=currentComment.postId;
            const currentBlog=await Blog.findOne({_id:blogId});
            if(!currentBlog)return res.status(404).json({message:"post not found"});
            const authorId=currentComment.userId;
            const author = await User.findOne({_id:authorId}).exec();
            author.commentCount--;
            await author.save();


            currentBlog.commentNumber--;
            await currentBlog.save();
            
            await Comment.findByIdAndDelete(comment_id);
            return res.status(200).json({message:"comment delete succesful"});

        }else if(deleteFlag===false){
            currentComment.description=description;
            const date = new Date();
            currentComment.date=date;
            await currentComment.save();
            return res.status(200).json({message:"update succesful"});
        }else{
            return res.status(422).json({message: "wrong flag input"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while updating the comment" });
    }
}



async function listComment(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    const{postId}=req.body;
    if(!postId)return res.status(422).json({message: "wrong post id input"});
    
    try {
        const comments=await Comment.find({postId:postId});
        return res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while comment search" });
    }
}

async function deneme(req,res){
    res.send(req.cookies);
}
module.exports={createComment,updateComment,listComment,deneme};