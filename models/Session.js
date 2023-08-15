const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const SessionSchema=Schema(
    {
        userId:{
            type:String,
            required:true,
        },
        duration:{
            type:Number,
            required:true,
            min:25,
            max:180
        },
        start:{
            type: Date, 
            default: Date.now,
            required:false
        },
        end:{
            type: Date,
            required:false
        },
        isCompleted:{
            type:Boolean,
            required:false,
            default:false
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


module.exports=mongoose.model('Session', SessionSchema);