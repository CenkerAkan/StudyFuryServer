const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const BlogSchema=Schema(
    {
        userId:{
            type:String,
            required:true,
        },
        header:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        date:{
            type: Date, 
            default: Date.now,
            required:false
        },
        commentNumber:{
            type:Number,
            required:false,
            default:0
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

module.exports=mongoose.model('Blog', BlogSchema);