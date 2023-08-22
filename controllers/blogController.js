const User=require('../models/User');
const Blog=require('../models/Blog');
const Comment=require('../models/Comment');

async function createBlog(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"}); 
    const {header,description}=req.body;
    if(!header||!description)return res.status(422).json({message: "wrong duration input"});

    try {
        const userId=id;
        await Blog.create({userId,header,description});

        user.blogCount++;
        await user.save();

        res.status(200).json({message:"blog post created"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Could not create a blog post"});
    }

}

async function updateBlog(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    // input control
    const {blogId,header,description,deleteFlag}=req.body;
    if(!header||!description||!blogId)return res.status(422).json({message: "wrong duration input"});
    //
    const currentBlog= await Blog.findOne({_id:blogId});
    if(!currentBlog) return res.status(404).json({message:"user not found"});

    try {
        
        if(!deleteFlag){
            currentBlog.header=header;
            currentBlog.description=description;
            await currentBlog.save();
            // TODO tüm commentleri de silmem lazım
            // burada
            //----------
            return res.status(200).json({message:"update succesful"});
        }else{
            await Blog.findByIdAndDelete(blogId);
            user.blogCount--;
            await user.save();
            return res.status(200).json({ message: "Blog deleted successfully" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while updating the blog" });
    }

}

async function findBlog(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    const {searchString}=req.body;
    if(!searchString)return res.status(422).json({message: "wrong search input"});
    try {
        const blogs = await Blog.find({ header: { $regex: searchString, $options: 'i' } });
        return res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while blog search" });
    }

}

async function viewBlog(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    const {blog_id}=req.body;
    console.log(blog_id);
    if(!blog_id)return res.status(422).json({message: "wrong blog id input"});
    try {
        const currentBlog=await Blog.findOne({_id:blog_id});
        return res.status(200).json(currentBlog);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while blog view" });
    }
    
}

async function getBlogs(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    try {
        const blogContent = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching blog content.' });
    }
}

async function getUserBlogs(req,res){
    const id=req.user.id;
    const user = await User.findOne({_id: id}).exec();
    if(!user) return res.status(401).json({message:"you are not authorized"});
    try {
        const blogContent = await Blog.find({userId:id}).sort({ createdAt: -1 });
        res.status(200).json(blogContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching blog content.' });
    }
}

module.exports={createBlog,updateBlog,findBlog,viewBlog,getBlogs,getUserBlogs};