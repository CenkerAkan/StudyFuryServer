const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const BlogSchema=Schema(
    {
        userId:{
            type:String,
            required:true,
        },
        postId:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true
        },
        date:{
            type: Date, 
            default: Date.now,
            required:false
        },
    },
    {
        virtuals:{
            id:{
                get(){
                    return this._id;
                }
            }
        }
    }
);


module.exports=mongoose.model('Comment', BlogSchema);