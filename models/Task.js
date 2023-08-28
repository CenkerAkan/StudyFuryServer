const mongoose=require('mongoose');

const Schema=mongoose.Schema;


const TaskSchema=Schema(
    {
        userId:{
            type:String,
            required:true,
        },
        header:{
            type:String,
            required:true,
        },
        /*description:{
            type:String,
            required:true,
        },*/
        deadline:{
            type: Date,
            required:true
        },
        isCompletedInTime:{
            type:Boolean,
            required:false,
            default:false
        },
        completeDate:{
            type:Date,
            required:false,
            default: () => new Date('2023-01-01')
        }
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


module.exports=mongoose.model('Task', TaskSchema);